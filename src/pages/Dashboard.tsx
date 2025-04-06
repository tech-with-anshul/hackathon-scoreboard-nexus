
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useHackathon } from '@/contexts/HackathonContext';
import { Award, ClipboardList, Users, Star } from 'lucide-react';

const Dashboard = () => {
  const { user, role } = useAuth();
  
  // Debug info
  useEffect(() => {
    console.log('Dashboard mounting, auth user:', user?.name, 'role:', role);
  }, [user, role]);
  
  try {
    // Wrap the hook usage in try/catch for better error reporting
    const { teams, judges, evaluations, getJudgeEvaluations } = useHackathon();
    console.log('useHackathon successful, teams:', teams.length);
    
    const isAdmin = role === 'admin';
    const isJudge = role === 'judge';
    
    // For judges, get their evaluations
    const judgeEvaluations = isJudge && user ? getJudgeEvaluations(user.id) : [];
    const teamsEvaluated = isJudge ? new Set(judgeEvaluations.map(e => e.teamId)).size : 0;
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome {user?.name}! {isAdmin ? 'Manage the hackathon from here.' : 'You can evaluate teams from here.'}
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-hackathon-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teams.length}</div>
              <p className="text-xs text-muted-foreground">
                {isJudge && `You've evaluated ${teamsEvaluated} teams`}
              </p>
            </CardContent>
          </Card>
          
          {isAdmin && (
            <Card className="border-l-4 border-l-hackathon-yellow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Judges</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{judges.length}</div>
              </CardContent>
            </Card>
          )}
          
          <Card className="border-l-4 border-l-hackathon-red">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evaluations</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isAdmin ? evaluations.length : judgeEvaluations?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {isAdmin && judges.length > 0 
                  ? `${evaluations.length} / ${teams.length * judges.length} total possible`
                  : isJudge ? `${teamsEvaluated} / ${teams.length} teams` : ''
                }
              </p>
            </CardContent>
          </Card>
          
          {isAdmin && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {judges.length && teams.length 
                    ? `${Math.round((evaluations.length / (teams.length * judges.length)) * 100)}%` 
                    : '0%'
                  }
                </div>
                <p className="text-xs text-muted-foreground">Evaluation completion</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {isAdmin 
                  ? 'Admin Quick Guide' 
                  : 'Judge Quick Guide'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAdmin ? (
                <ul className="list-disc pl-6 space-y-2">
                  <li>Manage teams and judges using the sidebar navigation</li>
                  <li>Import team and judge data via JSON in the Import section</li>
                  <li>View and sort final results in the Results section</li>
                  <li>Reset all evaluations if needed (use with caution)</li>
                </ul>
              ) : (
                <ul className="list-disc pl-6 space-y-2">
                  <li>Click on "Evaluate Teams" to start evaluating</li>
                  <li>Each team is evaluated on 5 criteria with 20 points each</li>
                  <li>You can only see your own evaluations</li>
                  <li>You can update your evaluations at any time</li>
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard render error:', error);
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <h1 className="text-xl font-bold">Error Loading Dashboard</h1>
        <p>There was an error initializing the application.</p>
        <p className="text-sm mt-2">Technical details: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
};

export default Dashboard;
