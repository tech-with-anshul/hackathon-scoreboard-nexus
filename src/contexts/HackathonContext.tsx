
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase, isValidUUID, prepareIdForDatabase } from '@/integrations/supabase/client';
import { useTeams } from '@/hooks/useTeams';
import { useJudges } from '@/hooks/useJudges';
import { useEvaluations } from '@/hooks/useEvaluations';
import { useResults } from '@/hooks/useResults';
import type { Team, Judge, Evaluation, TeamResult, HackathonContextType } from '@/types/hackathon';

// Create the context with a defined default value
const HackathonContext = createContext<HackathonContextType | undefined>(undefined);

// Provider component
export const HackathonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  
  const { 
    teams, setTeams, loadTeams, addTeam, removeTeam, uploadTeams 
  } = useTeams();
  
  const {
    judges, setJudges, loadJudges, addJudge, removeJudge, uploadJudges
  } = useJudges();
  
  const {
    evaluations, setEvaluations, loadEvaluations, submitEvaluation, resetEvaluations, getJudgeEvaluations
  } = useEvaluations();
  
  const { getTeamResults, getTeamResultById } = useResults(teams, evaluations);

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
            // Teams will load mock data automatically
            await loadTeams(setConnectionError);
            setLoading(false);
            return;
          } else {
            setConnectionError(false);
          }
        } catch (connectionError) {
          console.error('Error connecting to Supabase:', connectionError);
          setConnectionError(true);
          // Teams will load mock data automatically
          await loadTeams(setConnectionError);
          setLoading(false);
          return;
        }
        
        // Load data from Supabase
        await loadTeams(setConnectionError);
        await loadJudges();
        await loadEvaluations();
        
      } catch (error) {
        console.error('Error loading initial data:', error);
        setConnectionError(true);
        toast.error('Failed to load hackathon data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Submit evaluation wrapper that includes the connection error state
  const handleSubmitEvaluation = (evaluation: Omit<Evaluation, 'id' | 'timestamp'>) => {
    // Validate that team and judge IDs are present
    if (!evaluation.teamId || !evaluation.judgeId) {
      const errorMsg = 'Team or judge ID is missing';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Using our improved validation function
    if (!isValidUUID(evaluation.teamId)) {
      console.error(`Team ID validation failed: ${evaluation.teamId}`);
      const errorMsg = `Invalid team ID format: ${evaluation.teamId}`;
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    if (!isValidUUID(evaluation.judgeId)) {
      console.error(`Judge ID validation failed: ${evaluation.judgeId}`);
      const errorMsg = `Invalid judge ID format: ${evaluation.judgeId}`;
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    return submitEvaluation(evaluation, connectionError);
  };

  // Provide the context
  const value: HackathonContextType = {
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
    submitEvaluation: handleSubmitEvaluation,
    getJudgeEvaluations,
    getTeamResults,
    getTeamResultById
  };

  console.log('HackathonProvider rendering with teams:', teams.length);
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

// Re-export types
export type { Team, Judge, Evaluation, TeamResult };
