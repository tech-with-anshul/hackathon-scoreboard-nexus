
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useHackathon } from '@/contexts/HackathonContext';
import { toast } from 'sonner';
import TeamList from '@/components/evaluation/TeamList';
import EvaluationForm from '@/components/evaluation/EvaluationForm';

const Evaluate = () => {
  const { user } = useAuth();
  const { teams, submitEvaluation, getJudgeEvaluations, connectionError } = useHackathon();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [criteria, setCriteria] = useState({
    innovation: 10,
    technical: 10,
    presentation: 10,
    impact: 10,
    completion: 10
  });
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const judgeId = user?.id || '';
  const judgeEvaluations = getJudgeEvaluations(judgeId);
  
  // Get teams that have already been evaluated
  const evaluatedTeamIds = new Set(judgeEvaluations.map(assessment => assessment.teamId));

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
    
    // Check if team has been evaluated and pre-fill the form
    const existingAssessment = judgeEvaluations.find(assessment => assessment.teamId === teamId);
    
    if (existingAssessment) {
      setCriteria(existingAssessment.criteria);
      setNotes(existingAssessment.notes || '');
    } else {
      // Reset to default values
      setCriteria({
        innovation: 10,
        technical: 10,
        presentation: 10,
        impact: 10,
        completion: 10
      });
      setNotes('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTeam || !user) {
      toast.error('Please select a team first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await submitEvaluation({
        teamId: selectedTeam,
        judgeId: user.id,
        criteria,
        totalScore: Object.values(criteria).reduce((sum, score) => sum + score, 0),
        notes
      });
      
      // Reset form only on successful submission
      setSelectedTeam(null);
      setCriteria({
        innovation: 10,
        technical: 10,
        presentation: 10,
        impact: 10,
        completion: 10
      });
      setNotes('');
    } catch (error) {
      console.error('Submission error:', error);
      // Error is already handled by the submitEvaluation function which shows toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evaluate Teams</h1>
        <p className="text-muted-foreground">
          Select a team to evaluate or update your evaluation.
        </p>
      </div>
      
      {connectionError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Unable to connect to the server. Your evaluations will be saved locally.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <TeamList 
          teams={teams} 
          selectedTeam={selectedTeam} 
          evaluatedTeamIds={evaluatedTeamIds} 
          onTeamSelect={handleTeamSelect}
          connectionError={connectionError}
        />
        
        <div>
          {selectedTeam ? (
            <EvaluationForm
              criteria={criteria}
              setCriteria={setCriteria}
              notes={notes}
              setNotes={setNotes}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isUpdate={evaluatedTeamIds.has(selectedTeam)}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Form</CardTitle>
                <CardDescription>
                  Select a team from the list to begin evaluation
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-12">
                <p className="text-center text-muted-foreground">
                  Please select a team to start or update an evaluation
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Evaluate;
