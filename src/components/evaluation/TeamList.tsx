
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Team } from '@/contexts/HackathonContext';
import { Wifi, WifiOff } from 'lucide-react';

interface TeamListProps {
  teams: Team[];
  selectedTeam: string | null;
  evaluatedTeamIds: Set<string>;
  onTeamSelect: (teamId: string) => void;
  connectionError?: boolean;
}

const TeamList: React.FC<TeamListProps> = ({ 
  teams, 
  selectedTeam, 
  evaluatedTeamIds, 
  onTeamSelect,
  connectionError = false
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Team List</h2>
        {connectionError && (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <WifiOff className="h-3 w-3" /> Offline
          </Badge>
        )}
        {!connectionError && (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <Wifi className="h-3 w-3" /> Connected
          </Badge>
        )}
      </div>
      
      <div className="grid gap-3">
        {teams.map((team) => (
          <Button
            key={team.id}
            variant={selectedTeam === team.id ? "default" : "outline"}
            className={`justify-start h-auto py-3 ${
              selectedTeam === team.id ? "bg-hackathon-blue text-white" : ""
            }`}
            onClick={() => onTeamSelect(team.id)}
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
  );
};

export default TeamList;
