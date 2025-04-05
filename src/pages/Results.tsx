
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useHackathon } from '@/contexts/HackathonContext';
import { Award, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const Results = () => {
  const { getTeamResults, resetEvaluations, judges } = useHackathon();
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');
  const [isResetting, setIsResetting] = useState(false);

  const teamResults = getTeamResults();
  
  // Sort teams based on selection
  const sortedResults = [...teamResults].sort((a, b) => {
    if (sortBy === 'score') {
      return b.totalScore - a.totalScore;
    } else {
      return a.team.name.localeCompare(b.team.name);
    }
  });

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all evaluations? This cannot be undone.')) {
      setIsResetting(true);
      setTimeout(() => {
        resetEvaluations();
        setIsResetting(false);
      }, 1000);
    }
  };

  const handleExport = () => {
    try {
      const data = {
        exportedAt: new Date().toISOString(),
        results: sortedResults.map(result => ({
        team: result.team.name,
        project: result.team.project,
        institution: result.team.institution,
        totalScore: result.totalScore,
        averageScore: result.averageScore,
        evaluationCount: result.evaluations.length,
        criteriaAverages: {
          innovation: result.evaluations.reduce((sum, e) => sum + e.criteria.innovation, 0) / Math.max(1, result.evaluations.length),
          technical: result.evaluations.reduce((sum, e) => sum + e.criteria.technical, 0) / Math.max(1, result.evaluations.length),
          presentation: result.evaluations.reduce((sum, e) => sum + e.criteria.presentation, 0) / Math.max(1, result.evaluations.length),
          impact: result.evaluations.reduce((sum, e) => sum + e.criteria.impact, 0) / Math.max(1, result.evaluations.length),
          completion: result.evaluations.reduce((sum, e) => sum + e.criteria.completion, 0) / Math.max(1, result.evaluations.length),
        }
      }))
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `hackathon-results-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast.success('Results exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export results');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Final Results</h1>
          <p className="text-muted-foreground">
            View and sort the final hackathon results.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isResetting ? "animate-spin" : ""} />
            <span>Reset All</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Hackathon Leaderboard</CardTitle>
              <CardDescription>
                Teams ranked by their total scores across all judges
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select 
                value={sortBy}
                onValueChange={(value) => setSortBy(value as 'score' | 'name')}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Total Score</SelectItem>
                  <SelectItem value="name">Team Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedResults.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-center">Evaluations</TableHead>
                  <TableHead className="text-right">Score / 100</TableHead>
                  <TableHead className="text-right">Total / {judges.length * 100}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedResults.map((result, index) => (
                  <TableRow key={result.team.id}>
                    <TableCell className="text-center font-medium">
                      {sortBy === 'score' ? (
                        <div className="relative">
                          {index < 3 && (
                            <Award 
                              size={16} 
                              className={`absolute -left-1 -top-1 ${
                                index === 0 ? "text-yellow-500" : 
                                index === 1 ? "text-gray-400" : 
                                "text-amber-700"
                              }`} 
                            />
                          )}
                          {index + 1}
                        </div>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="font-medium">
                      {result.team.name}
                      <div className="text-xs text-muted-foreground">{result.team.institution}</div>
                    </TableCell>
                    <TableCell>
                      {result.team.project}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.evaluations.length} / {judges.length}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {result.evaluations.length > 0 
                        ? (result.totalScore / result.evaluations.length).toFixed(1) 
                        : "—"
                      }
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      <span className={
                        index === 0 ? "text-hackathon-red" : 
                        index === 1 ? "text-hackathon-blue" : 
                        index === 2 ? "text-hackathon-yellow" : ""
                      }>
                        {result.totalScore}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No evaluation data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
