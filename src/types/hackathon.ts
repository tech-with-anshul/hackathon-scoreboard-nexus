
// Define types for the hackathon application

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

export interface HackathonContextType {
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
