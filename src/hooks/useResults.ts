
import { Team, Evaluation, TeamResult } from '@/types/hackathon';

export const useResults = (teams: Team[], evaluations: Evaluation[]) => {
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

  return {
    getTeamResults,
    getTeamResultById
  };
};
