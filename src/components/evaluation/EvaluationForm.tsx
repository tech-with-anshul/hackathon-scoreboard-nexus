
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CriteriaType {
  innovation: number;
  technical: number;
  presentation: number;
  impact: number;
  completion: number;
}

interface EvaluationFormProps {
  criteria: CriteriaType;
  setCriteria: React.Dispatch<React.SetStateAction<CriteriaType>>;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isUpdate: boolean;
  connectionError?: boolean;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({
  criteria,
  setCriteria,
  notes,
  setNotes,
  onSubmit,
  isSubmitting,
  isUpdate,
  connectionError
}) => {
  const totalScore = Object.values(criteria).reduce((sum, score) => sum + score, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation Form</CardTitle>
        <CardDescription>
          Rate the team on each criteria (0-20 points each)
        </CardDescription>
        {connectionError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You're working in offline mode. Your evaluations will be saved locally.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <form id="evaluationForm" onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <CriteriaSlider
              label="Innovation & Creativity"
              value={criteria.innovation}
              onChange={(value) => setCriteria({...criteria, innovation: value})}
            />
            
            <CriteriaSlider
              label="Technical Complexity"
              value={criteria.technical}
              onChange={(value) => setCriteria({...criteria, technical: value})}
            />
            
            <CriteriaSlider
              label="Presentation & Demo"
              value={criteria.presentation}
              onChange={(value) => setCriteria({...criteria, presentation: value})}
            />
            
            <CriteriaSlider
              label="Impact & Usefulness"
              value={criteria.impact}
              onChange={(value) => setCriteria({...criteria, impact: value})}
            />
            
            <CriteriaSlider
              label="Completion & Polish"
              value={criteria.completion}
              onChange={(value) => setCriteria({...criteria, completion: value})}
            />
            
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : isUpdate ? 'Update Evaluation' : 'Submit Evaluation'}
        </Button>
      </CardFooter>
    </Card>
  );
};

interface CriteriaSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const CriteriaSlider: React.FC<CriteriaSliderProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm font-semibold">{value}/20</span>
      </div>
      <Slider 
        value={[value]} 
        min={0} 
        max={20} 
        step={1}
        onValueChange={(values) => onChange(values[0])}
      />
    </div>
  );
};

export default EvaluationForm;
