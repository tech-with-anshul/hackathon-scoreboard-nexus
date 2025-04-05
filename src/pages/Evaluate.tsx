
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useHackathon } from '@/contexts/HackathonContext';
import { toast } from 'sonner';

const Evaluate = () => {
  const { user } = useAuth();
  const { teams, submitEvaluation, getJudgeEvaluations } = useHackathon();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [criteria, setCriteria] = useState({
    innovation: 10,
    technical: 10,
    presentation: 10,
    impact: 10,
    completion: 10
  });
  const [notes, setNotes] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTeam || !user) {
      toast.error('Please select a team first');
      return;
    }
    
    submitEvaluation({
      teamId: selectedTeam,
      judgeId: user.id,
      criteria,
      totalScore: Object.values(criteria).reduce((sum, score) => sum + score, 0),
      notes
    });
    
    // Reset form
    setSelectedTeam(null);
    setCriteria({
      innovation: 10,
      technical: 10,
      presentation: 10,
      impact: 10,
      completion: 10
    });
    setNotes('');
  };

  const totalScore = Object.values(criteria).reduce((sum, score) => sum + score, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evaluate Teams</h1>
        <p className="text-muted-foreground">
          Select a team to evaluate or update your evaluation.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Team List</h2>
          
          <div className="grid gap-3">
            {teams.map((team) => (
              <Button
                key={team.id}
                variant={selectedTeam === team.id ? "default" : "outline"}
                className={`justify-start h-auto py-3 ${
                  selectedTeam === team.id ? "bg-hackathon-blue text-white" : ""
                }`}
                onClick={() => handleTeamSelect(team.id)}
              >
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center w-full justify-between">
                    <span className="font-medium">{team.name}</span>
                    {evaluatedTeamIds.has(team.id) && (
                      <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                        Evaluated
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs opacity-70 mt-1">{team.project}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          {selectedTeam ? (
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Form</CardTitle>
                <CardDescription>
                  Rate the team on each criteria (0-20 points each)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="evaluationForm" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Innovation & Creativity</label>
                        <span className="text-sm font-semibold">{criteria.innovation}/20</span>
                      </div>
                      <Slider 
                        value={[criteria.innovation]} 
                        min={0} 
                        max={20} 
                        step={1}
                        onValueChange={(value) => setCriteria({...criteria, innovation: value[0]})}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Technical Complexity</label>
                        <span className="text-sm font-semibold">{criteria.technical}/20</span>
                      </div>
                      <Slider 
                        value={[criteria.technical]} 
                        min={0} 
                        max={20} 
                        step={1}
                        onValueChange={(value) => setCriteria({...criteria, technical: value[0]})}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Presentation & Demo</label>
                        <span className="text-sm font-semibold">{criteria.presentation}/20</span>
                      </div>
                      <Slider 
                        value={[criteria.presentation]} 
                        min={0} 
                        max={20} 
                        step={1}
                        onValueChange={(value) => setCriteria({...criteria, presentation: value[0]})}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Impact & Usefulness</label>
                        <span className="text-sm font-semibold">{criteria.impact}/20</span>
                      </div>
                      <Slider 
                        value={[criteria.impact]} 
                        min={0} 
                        max={20} 
                        step={1}
                        onValueChange={(value) => setCriteria({...criteria, impact: value[0]})}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Completion & Polish</label>
                        <span className="text-sm font-semibold">{criteria.completion}/20</span>
                      </div>
                      <Slider 
                        value={[criteria.completion]} 
                        min={0} 
                        max={20} 
                        step={1}
                        onValueChange={(value) => setCriteria({...criteria, completion: value[0]})}
                      />
                    </div>
                    
                    <div className="pt-2">
                      <label className="text-sm font-medium block mb-2">Notes (Optional)</label>
                      <Textarea 
                        placeholder="Enter any additional notes or feedback..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <div className="text-xl font-bold">
                  Total: <span className="text-hackathon-red">{totalScore}/100</span>
                </div>
                <Button 
                  type="submit"
                  form="evaluationForm"
                  className="bg-hackathon-blue hover:bg-hackathon-blue/80"
                >
                  {evaluatedTeamIds.has(selectedTeam) ? 'Update Evaluation' : 'Submit Evaluation'}
                </Button>
              </CardFooter>
            </Card>
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
