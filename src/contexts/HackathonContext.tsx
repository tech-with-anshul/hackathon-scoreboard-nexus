
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

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

  // Load initial data
  useEffect(() => {
    // In a real app, this would fetch from an API
    const loadInitialData = () => {
      try {
        // Load from localStorage or use mock data
        const storedTeams = localStorage.getItem('hackathon_teams');
        const storedJudges = localStorage.getItem('hackathon_judges');
        const storedEvaluations = localStorage.getItem('hackathon_evaluations');

        if (storedTeams) {
          setTeams(JSON.parse(storedTeams));
        } else {
          setTeams(MOCK_TEAMS);
          localStorage.setItem('hackathon_teams', JSON.stringify(MOCK_TEAMS));
        }

        if (storedJudges) {
          setJudges(JSON.parse(storedJudges));
        } else {
          // Get judges from auth context mock
          const mockJudges: Judge[] = [];
          localStorage.setItem('hackathon_judges', JSON.stringify(mockJudges));
        }

        if (storedEvaluations) {
          setEvaluations(JSON.parse(storedEvaluations));
        } else {
          localStorage.setItem('hackathon_evaluations', JSON.stringify([]));
        }

      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Failed to load hackathon data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('hackathon_teams', JSON.stringify(teams));
    }
  }, [teams, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('hackathon_judges', JSON.stringify(judges));
    }
  }, [judges, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('hackathon_evaluations', JSON.stringify(evaluations));
    }
  }, [evaluations, loading]);

  // Admin functions
  const addTeam = (team: Omit<Team, 'id'>) => {
    const newTeam = { ...team, id: `team_${Date.now()}` };
    setTeams([...teams, newTeam]);
    toast.success(`Team "${team.name}" added successfully`);
  };

  const removeTeam = (id: string) => {
    setTeams(teams.filter((team) => team.id !== id));
    // Also remove all evaluations for this team
    setEvaluations(evaluations.filter((eval) => eval.teamId !== id));
    toast.success('Team removed successfully');
  };

  const addJudge = (judge: Omit<Judge, 'id'>) => {
    const newJudge = { ...judge, id: `judge_${Date.now()}` };
    setJudges([...judges, newJudge]);
    toast.success(`Judge "${judge.name}" added successfully`);
  };

  const removeJudge = (id: string) => {
    setJudges(judges.filter((judge) => judge.id !== id));
    // Also remove all evaluations by this judge
    setEvaluations(evaluations.filter((eval) => eval.judgeId !== id));
    toast.success('Judge removed successfully');
  };

  const uploadTeams = (teamsData: Omit<Team, 'id'>[]) => {
    const newTeams = teamsData.map((team) => ({
      ...team,
      id: `team_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    }));
    setTeams([...teams, ...newTeams]);
    toast.success(`${newTeams.length} teams uploaded successfully`);
  };

  const uploadJudges = (judgesData: Omit<Judge, 'id'>[]) => {
    const newJudges = judgesData.map((judge) => ({
      ...judge,
      id: `judge_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    }));
    setJudges([...judges, ...newJudges]);
    toast.success(`${newJudges.length} judges uploaded successfully`);
  };

  const resetEvaluations = () => {
    setEvaluations([]);
    toast.success('All evaluations have been reset');
  };

  // Judge functions
  const submitEvaluation = (evaluation: Omit<Evaluation, 'id' | 'timestamp'>) => {
    // Calculate total score
    const { criteria } = evaluation;
    const totalScore = 
      criteria.innovation + 
      criteria.technical + 
      criteria.presentation + 
      criteria.impact + 
      criteria.completion;

    // Check if this judge has already evaluated this team
    const existingEvalIndex = evaluations.findIndex(
      (eval) => eval.teamId === evaluation.teamId && eval.judgeId === evaluation.judgeId
    );

    if (existingEvalIndex !== -1) {
      // Update existing evaluation
      const updatedEvaluations = [...evaluations];
      updatedEvaluations[existingEvalIndex] = {
        ...updatedEvaluations[existingEvalIndex],
        ...evaluation,
        totalScore,
        timestamp: new Date().toISOString()
      };
      setEvaluations(updatedEvaluations);
      toast.success('Evaluation updated successfully');
    } else {
      // Create new evaluation
      const newEvaluation: Evaluation = {
        id: `eval_${Date.now()}`,
        ...evaluation,
        totalScore,
        timestamp: new Date().toISOString()
      };
      setEvaluations([...evaluations, newEvaluation]);
      toast.success('Evaluation submitted successfully');
    }
  };

  const getJudgeEvaluations = (judgeId: string) => {
    return evaluations.filter((eval) => eval.judgeId === judgeId);
  };

  // Results
  const getTeamResults = (): TeamResult[] => {
    return teams.map((team) => {
      const teamEvaluations = evaluations.filter((eval) => eval.teamId === team.id);
      const totalScore = teamEvaluations.reduce((sum, eval) => sum + eval.totalScore, 0);
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

    const teamEvaluations = evaluations.filter((eval) => eval.teamId === teamId);
    const totalScore = teamEvaluations.reduce((sum, eval) => sum + eval.totalScore, 0);
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
