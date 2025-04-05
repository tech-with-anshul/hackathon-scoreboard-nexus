
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useHackathon } from '@/contexts/HackathonContext';
import { AlertCircle, FileJson, Upload } from 'lucide-react';
import { toast } from 'sonner';

const Import = () => {
  const { uploadTeams, uploadJudges } = useHackathon();
  const [teamsJson, setTeamsJson] = useState('');
  const [judgesJson, setJudgesJson] = useState('');
  const [teamsError, setTeamsError] = useState('');
  const [judgesError, setJudgesError] = useState('');

  const handleTeamsImport = () => {
    if (!teamsJson.trim()) {
      setTeamsError('Please enter JSON data');
      return;
    }

    try {
      const data = JSON.parse(teamsJson);
      
      if (!Array.isArray(data)) {
        setTeamsError('JSON data must be an array of teams');
        return;
      }
      
      // Validate team fields
      const validTeams = data.filter(team => {
        if (!team.name || !team.project) {
          return false;
        }
        if (!team.members || !Array.isArray(team.members)) {
          team.members = [];
        }
        return true;
      });
      
      if (validTeams.length === 0) {
        setTeamsError('No valid teams found in the data');
        return;
      }
      
      uploadTeams(validTeams);
      setTeamsJson('');
      setTeamsError('');
      
    } catch (error) {
      setTeamsError('Invalid JSON format');
    }
  };

  const handleJudgesImport = () => {
    if (!judgesJson.trim()) {
      setJudgesError('Please enter JSON data');
      return;
    }

    try {
      const data = JSON.parse(judgesJson);
      
      if (!Array.isArray(data)) {
        setJudgesError('JSON data must be an array of judges');
        return;
      }
      
      // Validate judge fields
      const validJudges = data.filter(judge => {
        return judge.name && judge.email;
      });
      
      if (validJudges.length === 0) {
        setJudgesError('No valid judges found in the data');
        return;
      }
      
      uploadJudges(validJudges);
      setJudgesJson('');
      setJudgesError('');
      
    } catch (error) {
      setJudgesError('Invalid JSON format');
    }
  };

  const handleTeamSample = () => {
    const sampleTeams = [
      {
        "name": "Sample Team 1",
        "project": "AI Healthcare Assistant",
        "members": ["Member 1", "Member 2", "Member 3"],
        "institution": "Sample University"
      },
      {
        "name": "Sample Team 2",
        "project": "Blockchain Supply Chain",
        "members": ["Member A", "Member B"],
        "institution": "Tech Institute"
      }
    ];
    
    setTeamsJson(JSON.stringify(sampleTeams, null, 2));
    setTeamsError('');
  };

  const handleJudgeSample = () => {
    const sampleJudges = [
      {
        "name": "Dr. Jane Smith",
        "email": "jane.smith@example.com"
      },
      {
        "name": "Prof. John Doe",
        "email": "john.doe@example.com"
      }
    ];
    
    setJudgesJson(JSON.stringify(sampleJudges, null, 2));
    setJudgesError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
        <p className="text-muted-foreground">
          Import teams and judges data using JSON format.
        </p>
      </div>
      
      <Tabs defaultValue="teams">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="judges">Judges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson size={20} />
                <span>Import Teams</span>
              </CardTitle>
              <CardDescription>
                Upload team data in JSON format. Each team should have a name, project, and optional members array.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder={`[
  {
    "name": "Team Name",
    "project": "Project Name",
    "members": ["Member 1", "Member 2"],
    "institution": "University Name"
  }
]`}
                  value={teamsJson}
                  onChange={(e) => {
                    setTeamsJson(e.target.value);
                    setTeamsError('');
                  }}
                  rows={10}
                  className="font-mono text-sm"
                />
                
                {teamsError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm p-2 bg-red-50 rounded">
                    <AlertCircle size={16} />
                    <span>{teamsError}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <Button 
                variant="outline" 
                onClick={handleTeamSample}
              >
                Show Sample
              </Button>
              <Button 
                onClick={handleTeamsImport}
                className="flex items-center gap-2 bg-hackathon-blue hover:bg-hackathon-blue/80"
              >
                <Upload size={16} />
                <span>Import Teams</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="judges">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson size={20} />
                <span>Import Judges</span>
              </CardTitle>
              <CardDescription>
                Upload judge data in JSON format. Each judge should have a name and email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder={`[
  {
    "name": "Judge Name",
    "email": "judge@example.com"
  }
]`}
                  value={judgesJson}
                  onChange={(e) => {
                    setJudgesJson(e.target.value);
                    setJudgesError('');
                  }}
                  rows={10}
                  className="font-mono text-sm"
                />
                
                {judgesError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm p-2 bg-red-50 rounded">
                    <AlertCircle size={16} />
                    <span>{judgesError}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <Button 
                variant="outline" 
                onClick={handleJudgeSample}
              >
                Show Sample
              </Button>
              <Button 
                onClick={handleJudgesImport}
                className="flex items-center gap-2 bg-hackathon-yellow text-hackathon-dark hover:bg-hackathon-yellow/80"
              >
                <Upload size={16} />
                <span>Import Judges</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Import;
