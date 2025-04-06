
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Evaluation, Team } from '@/types/hackathon';

export const useEvaluations = (initialEvaluations: Evaluation[] = []) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations);

  const loadEvaluations = async () => {
    try {
      // Fetch evaluations from Supabase
      const { data: evaluationsData, error: evaluationsError } = await supabase
        .from('evaluations')
        .select('*');
        
      if (evaluationsError && evaluationsError.code !== 'PGRST301') {
        // If the error is something other than a permissions issue, throw it
        throw evaluationsError;
      }
      
      if (evaluationsData && evaluationsData.length > 0) {
        // Map Supabase data to our Evaluation interface
        const mappedEvaluations: Evaluation[] = evaluationsData.map(evaluation => ({
          id: evaluation.id,
          teamId: evaluation.team_id,
          judgeId: evaluation.judge_id,
          criteria: {
            innovation: evaluation.innovation,
            technical: evaluation.technical,
            presentation: evaluation.presentation,
            impact: evaluation.impact,
            completion: evaluation.completion
          },
          totalScore: evaluation.total_score,
          notes: evaluation.notes || undefined,
          timestamp: evaluation.updated_at
        }));
        setEvaluations(mappedEvaluations);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading evaluations:', error);
      return false;
    }
  };

  const submitEvaluation = async (evaluation: Omit<Evaluation, 'id' | 'timestamp'>, connectionError: boolean) => {
    try {
      // Calculate total score
      const { criteria } = evaluation;
      const totalScore = 
        criteria.innovation + 
        criteria.technical + 
        criteria.presentation + 
        criteria.impact + 
        criteria.completion;

      // Generate a temporary ID for offline mode
      const tempId = crypto.randomUUID?.() || `temp-${Date.now()}`;
      const timestamp = new Date().toISOString();

      // Ensure teamId and judgeId are valid UUIDs
      const teamId = evaluation.teamId;
      const judgeId = evaluation.judgeId;
      
      // Validate that teamId and judgeId are valid UUIDs
      const isValidUUID = (id: string) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      };
      
      if (!isValidUUID(teamId) || !isValidUUID(judgeId)) {
        toast.error('Invalid team or judge ID format');
        throw new Error('Invalid UUID format for team or judge ID');
      }

      // Check if this judge has already evaluated this team
      const existingEvaluation = evaluations.find(
        (assessment) => assessment.teamId === evaluation.teamId && assessment.judgeId === evaluation.judgeId
      );

      if (connectionError) {
        // Handle offline mode - just update local state
        if (existingEvaluation) {
          // Update existing evaluation in local state
          const updatedEvaluations = evaluations.map(item => {
            if (item.id === existingEvaluation.id) {
              return {
                ...item,
                criteria,
                totalScore,
                notes: evaluation.notes,
                timestamp
              };
            }
            return item;
          });
          
          setEvaluations(updatedEvaluations);
        } else {
          // Create new evaluation in local state
          const newEvaluation: Evaluation = {
            id: tempId,
            teamId: evaluation.teamId,
            judgeId: evaluation.judgeId,
            criteria,
            totalScore,
            notes: evaluation.notes,
            timestamp
          };
          
          setEvaluations([...evaluations, newEvaluation]);
        }
        
        toast.success('Evaluation saved locally (offline mode)');
        return;
      }

      if (existingEvaluation) {
        // Update existing evaluation
        const { error } = await supabase
          .from('evaluations')
          .update({
            innovation: criteria.innovation,
            technical: criteria.technical,
            presentation: criteria.presentation,
            impact: criteria.impact,
            completion: criteria.completion,
            total_score: totalScore,
            notes: evaluation.notes || null,
            updated_at: timestamp
          })
          .eq('id', existingEvaluation.id);
          
        if (error) {
          console.error('Error updating evaluation:', error);
          
          // For RLS issues, still update local state
          if (error.code === 'PGRST301') {
            // Update local state despite Supabase error
            const updatedEvaluations = evaluations.map(item => {
              if (item.id === existingEvaluation.id) {
                return {
                  ...item,
                  criteria,
                  totalScore,
                  notes: evaluation.notes,
                  timestamp
                };
              }
              return item;
            });
            
            setEvaluations(updatedEvaluations);
            toast.warning('Online update failed, but saved locally');
            return;
          }
          
          toast.error('Failed to update evaluation');
          throw new Error(error.message);
        }
        
        // Update local state
        const updatedEvaluations = evaluations.map(item => {
          if (item.id === existingEvaluation.id) {
            return {
              ...item,
              criteria,
              totalScore,
              notes: evaluation.notes,
              timestamp
            };
          }
          return item;
        });
        
        setEvaluations(updatedEvaluations);
        toast.success('Evaluation updated successfully');
      } else {
        // Create new evaluation
        const { data, error } = await supabase
          .from('evaluations')
          .insert({
            team_id: teamId,
            judge_id: judgeId,
            innovation: criteria.innovation,
            technical: criteria.technical,
            presentation: criteria.presentation,
            impact: criteria.impact,
            completion: criteria.completion,
            total_score: totalScore,
            notes: evaluation.notes || null
          })
          .select()
          .single();
          
        if (error) {
          console.error('Error creating evaluation:', error);
          
          // For RLS issues, still update local state
          if (error.code === 'PGRST301') {
            // Create in local state despite Supabase error
            const newEvaluation: Evaluation = {
              id: tempId,
              teamId: evaluation.teamId,
              judgeId: evaluation.judgeId,
              criteria,
              totalScore,
              notes: evaluation.notes,
              timestamp
            };
            
            setEvaluations([...evaluations, newEvaluation]);
            toast.warning('Online submission failed, but saved locally');
            return;
          }
          
          toast.error(`Failed to submit evaluation: ${error.message}`);
          throw new Error(error.message);
        }
        
        if (data) {
          const newEvaluation: Evaluation = {
            id: data.id,
            teamId: data.team_id,
            judgeId: data.judge_id,
            criteria: {
              innovation: data.innovation,
              technical: data.technical,
              presentation: data.presentation,
              impact: data.impact,
              completion: data.completion
            },
            totalScore: data.total_score,
            notes: data.notes || undefined,
            timestamp: data.created_at
          };
          
          setEvaluations([...evaluations, newEvaluation]);
          toast.success('Evaluation submitted successfully');
        }
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      if (error instanceof Error) {
        toast.error(`Failed to submit evaluation: ${error.message}`);
        throw error;
      } else {
        toast.error('Failed to submit evaluation');
        throw new Error('Unknown error occurred');
      }
    }
  };

  const resetEvaluations = async () => {
    try {
      const { error } = await supabase
        .from('evaluations')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all evaluations
        
      if (error && error.code !== 'PGRST301') {
        throw error;
      }
      
      setEvaluations([]);
      toast.success('All evaluations have been reset');
    } catch (error) {
      console.error('Error resetting evaluations:', error);
      toast.error('Failed to reset evaluations');
    }
  };

  const getJudgeEvaluations = (judgeId: string) => {
    return evaluations.filter((assessment) => assessment.judgeId === judgeId);
  };

  return {
    evaluations,
    setEvaluations,
    loadEvaluations,
    submitEvaluation,
    resetEvaluations,
    getJudgeEvaluations
  };
};
