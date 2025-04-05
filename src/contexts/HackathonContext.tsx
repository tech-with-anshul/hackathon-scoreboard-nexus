
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Types
export interface Judge {
  id: string;
  name: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  project: string;
  institution?: string;
}

export interface Evaluation {
  id: string;
  teamId: string;
  judgeId: string;
  criteria: {
    innovation: number;
    technical: number;
    presentation: number;
    impact: number;
    completion: number;
  };
  totalScore: number;
  notes?: string;
  timestamp: string;
}

export interface TeamResult {
  team: Team;
  evaluations: Evaluation[];
  totalScore: number;
  averageScore: number;
}

interface HackathonContextType {
  teams: Team[];
  judges: Judge[];
  evaluations: Evaluation[];
  loading: boolean;
  connectionError: boolean;
  // Admin functions
  addTeam: (team: Omit<Team, 'id'>) => void;
  removeTeam: (id: string) => void;
  addJudge: (judge: Omit<Judge, 'id'>) => void;
  removeJudge: (id: string) => void;
  uploadTeams: (teamsData: Omit<Team, 'id'>[]) => void;
  uploadJudges: (judgesData: Omit<Judge, 'id'>[]) => void;
  resetEvaluations: () => void;
  // Judge functions
  submitEvaluation: (evaluation: Omit<Evaluation, 'id' | 'timestamp'>) => void;
  getJudgeEvaluations: (judgeId: string) => Evaluation[];
  // Results
  getTeamResults: () => TeamResult[];
  getTeamResultById: (teamId: string) => TeamResult | undefined;
}

// Mock data for demo
const MOCK_TEAMS: Team[] = [
  {
    id: "t1",
    name: "Code Wizards",
    members: ["Alice Johnson", "Bob Smith", "Charlie Brown"],
    project: "AI-Powered Waste Management System",
    institution: "Delhi Technical University"
  },
  {
    id: "t2",
    name: "Binary Beasts",
    members: ["Diana Prince", "Bruce Wayne", "Clark Kent"],
    project: "Smart Agriculture Monitoring",
    institution: "IIT Roorkee"
  },
  {
    id: "t3",
    name: "Tech Titans",
    members: ["Elon Mask", "Steve Job", "Bill Get"],
    project: "Blockchain for Supply Chain",
    institution: "Dev Bhoomi Uttarakhand University"
  },
  {
    id: "t4",
    name: "Quantum Quips",
    members: ["Priya Singh", "Rahul Sharma", "Neha Kumar"],
    project: "AR Navigation for Campus",
    institution: "Dev Bhoomi Uttarakhand University"
  },
  {
    id: "t5",
    name: "Data Dragons",
    members: ["Amit Patel", "Sanjay Gupta", "Kiran Rao"],
    project: "ML-based Disease Prediction",
    institution: "IIIT Delhi"
  }
];

// Create the context
const HackathonContext = createContext<HackathonContextType | undefined>(undefined);

// Provider component
export const HackathonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Test connection to Supabase
        try {
          const { error: pingError } = await supabase.from('teams').select('id').limit(1);
          if (pingError) {
            console.error('Supabase connection error:', pingError);
            setConnectionError(true);
            // Fall back to mock data if can't connect to Supabase
            setTeams(MOCK_TEAMS);
            setLoading(false);
            return;
          } else {
            setConnectionError(false);
          }
        } catch (connectionError) {
          console.error('Error connecting to Supabase:', connectionError);
          setConnectionError(true);
          // Fall back to mock data if can't connect to Supabase
          setTeams(MOCK_TEAMS);
          setLoading(false);
          return;
        }
        
        // Fetch teams from Supabase
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('*');
          
        if (teamsError) throw teamsError;
        
        if (teamsData && teamsData.length > 0) {
          // Map Supabase data to our Team interface
          const mappedTeams: Team[] = teamsData.map(team => ({
            id: team.id,
            name: team.name,
            members: team.members,
            project: team.project,
            institution: team.institution || undefined
          }));
          setTeams(mappedTeams);
        } else {
          // If no teams in DB, use mock data
          setTeams(MOCK_TEAMS);
          
          // Insert mock teams into Supabase
          for (const team of MOCK_TEAMS) {
            // Create a new team object without the 'id' field
            // as Supabase will generate UUID automatically
            const { name, members, project, institution } = team;
            
            try {
              await supabase.from('teams').insert({
                name,
                members,
                project,
                institution
              });
            } catch (insertError) {
              console.error('Error inserting team:', insertError);
            }
          }
        }
        
        // Fetch judges from Supabase
        const { data: judgesData, error: judgesError } = await supabase
          .from('judges')
          .select('*');
          
        if (judgesError) throw judgesError;
        
        if (judgesData) {
          // Map Supabase data to our Judge interface
          const mappedJudges: Judge[] = judgesData.map(judge => ({
            id: judge.id,
            name: judge.name,
            email: judge.email
          }));
          setJudges(mappedJudges);
        }
        
        // Fetch evaluations from Supabase
        const { data: evaluationsData, error: evaluationsError } = await supabase
          .from('evaluations')
          .select('*');
          
        if (evaluationsError) throw evaluationsError;
        
        if (evaluationsData) {
          // Map Supabase data to our Evaluation interface
          // Fixed: renamed 'eval' to 'evaluation' to avoid using reserved keyword
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
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        setConnectionError(true);
        toast.error('Failed to load hackathon data');
        // Fall back to mock data
        setTeams(MOCK_TEAMS);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Admin functions
  const addTeam = async (team: Omit<Team, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: team.name,
          members: team.members,
          project: team.project,
          institution: team.institution || null
        })
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        const newTeam: Team = {
          id: data.id,
          name: data.name,
          members: data.members,
          project: data.project,
          institution: data.institution || undefined
        };
        setTeams([...teams, newTeam]);
        toast.success(`Team "${team.name}" added successfully`);
      }
    } catch (error) {
      console.error('Error adding team:', error);
      toast.error('Failed to add team');
    }
  };

  const removeTeam = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setTeams(teams.filter((team) => team.id !== id));
      // Evaluations will be cascade deleted due to foreign key constraint
      setEvaluations(evaluations.filter((assessment) => assessment.teamId !== id));
      toast.success('Team removed successfully');
    } catch (error) {
      console.error('Error removing team:', error);
      toast.error('Failed to remove team');
    }
  };

  const addJudge = async (judge: Omit<Judge, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('judges')
        .insert({
          name: judge.name,
          email: judge.email
        })
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        const newJudge: Judge = {
          id: data.id,
          name: data.name,
          email: data.email
        };
        setJudges([...judges, newJudge]);
        toast.success(`Judge "${judge.name}" added successfully`);
      }
    } catch (error) {
      console.error('Error adding judge:', error);
      toast.error('Failed to add judge');
    }
  };

  const removeJudge = async (id: string) => {
    try {
      const { error } = await supabase
        .from('judges')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setJudges(judges.filter((judge) => judge.id !== id));
      // Evaluations will be cascade deleted due to foreign key constraint
      setEvaluations(evaluations.filter((assessment) => assessment.judgeId !== id));
      toast.success('Judge removed successfully');
    } catch (error) {
      console.error('Error removing judge:', error);
      toast.error('Failed to remove judge');
    }
  };

  const uploadTeams = async (teamsData: Omit<Team, 'id'>[]) => {
    try {
      const teamsToInsert = teamsData.map(team => ({
        name: team.name,
        members: team.members,
        project: team.project,
        institution: team.institution || null
      }));
      
      const { data, error } = await supabase
        .from('teams')
        .insert(teamsToInsert)
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newTeams: Team[] = data.map(team => ({
          id: team.id,
          name: team.name,
          members: team.members,
          project: team.project,
          institution: team.institution || undefined
        }));
        setTeams([...teams, ...newTeams]);
        toast.success(`${newTeams.length} teams uploaded successfully`);
      }
    } catch (error) {
      console.error('Error uploading teams:', error);
      toast.error('Failed to upload teams');
    }
  };

  const uploadJudges = async (judgesData: Omit<Judge, 'id'>[]) => {
    try {
      const judgesToInsert = judgesData.map(judge => ({
        name: judge.name,
        email: judge.email
      }));
      
      const { data, error } = await supabase
        .from('judges')
        .insert(judgesToInsert)
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newJudges: Judge[] = data.map(judge => ({
          id: judge.id,
          name: judge.name,
          email: judge.email
        }));
        setJudges([...judges, ...newJudges]);
        toast.success(`${newJudges.length} judges uploaded successfully`);
      }
    } catch (error) {
      console.error('Error uploading judges:', error);
      toast.error('Failed to upload judges');
    }
  };

  const resetEvaluations = async () => {
    try {
      const { error } = await supabase
        .from('evaluations')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all evaluations
        
      if (error) throw error;
      
      setEvaluations([]);
      toast.success('All evaluations have been reset');
    } catch (error) {
      console.error('Error resetting evaluations:', error);
      toast.error('Failed to reset evaluations');
    }
  };

  // Judge functions
  const submitEvaluation = async (evaluation: Omit<Evaluation, 'id' | 'timestamp'>) => {
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
      const tempId = crypto.randomUUID?.() || Date.now().toString();
      const timestamp = new Date().toISOString();

      // Check if we have a connection error or if this judge has already evaluated this team
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
          toast.error('Failed to update evaluation');
          return;
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
            team_id: evaluation.teamId,
            judge_id: evaluation.judgeId,
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
          toast.error('Failed to submit evaluation');
          return;
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
      toast.error('Failed to submit evaluation');
    }
  };

  const getJudgeEvaluations = (judgeId: string) => {
    return evaluations.filter((assessment) => assessment.judgeId === judgeId);
  };

  // Results
  const getTeamResults = (): TeamResult[] => {
    return teams.map((team) => {
      const teamEvaluations = evaluations.filter((assessment) => assessment.teamId === team.id);
      const totalScore = teamEvaluations.reduce((sum, assessment) => sum + assessment.totalScore, 0);
      const averageScore = teamEvaluations.length > 0 
        ? totalScore / teamEvaluations.length 
        : 0;

      return {
        team,
        evaluations: teamEvaluations,
        totalScore,
        averageScore
      };
    }).sort((a, b) => b.totalScore - a.totalScore); // Sort by total score, highest first
  };

  const getTeamResultById = (teamId: string): TeamResult | undefined => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return undefined;

    const teamEvaluations = evaluations.filter((assessment) => assessment.teamId === teamId);
    const totalScore = teamEvaluations.reduce((sum, assessment) => sum + assessment.totalScore, 0);
    const averageScore = teamEvaluations.length > 0 
      ? totalScore / teamEvaluations.length 
      : 0;

    return {
      team,
      evaluations: teamEvaluations,
      totalScore,
      averageScore
    };
  };

  // Provide the context
  const value = {
    teams,
    judges,
    evaluations,
    loading,
    connectionError,
    addTeam,
    removeTeam,
    addJudge,
    removeJudge,
    uploadTeams,
    uploadJudges,
    resetEvaluations,
    submitEvaluation,
    getJudgeEvaluations,
    getTeamResults,
    getTeamResultById
  };

  return <HackathonContext.Provider value={value}>{children}</HackathonContext.Provider>;
};

// Custom hook to use the hackathon context
export const useHackathon = () => {
  const context = useContext(HackathonContext);
  if (context === undefined) {
    throw new Error('useHackathon must be used within a HackathonProvider');
  }
  return context;
};
