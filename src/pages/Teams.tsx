
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useHackathon } from '@/contexts/HackathonContext';
import { Plus, Trash2 } from 'lucide-react';

const Teams = () => {
  const { teams, addTeam, removeTeam } = useHackathon();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    members: '',
    project: '',
    institution: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeam(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTeam.name || !newTeam.project) return;
    
    addTeam({
      name: newTeam.name,
      members: newTeam.members.split(',').map(m => m.trim()),
      project: newTeam.project,
      institution: newTeam.institution
    });
    
    // Reset form and close dialog
    setNewTeam({
      name: '',
      members: '',
      project: '',
      institution: ''
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            Manage participating teams in the hackathon.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-hackathon-blue hover:bg-hackathon-blue/80">
              <Plus size={16} />
              <span>Add Team</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team</DialogTitle>
              <DialogDescription>
                Enter the details for the new team.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTeam} id="addTeamForm">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newTeam.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project Name*</Label>
                  <Input
                    id="project"
                    name="project"
                    value={newTeam.project}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="members">Team Members (comma separated)</Label>
                  <Input
                    id="members"
                    name="members"
                    value={newTeam.members}
                    onChange={handleInputChange}
                    placeholder="John Doe, Jane Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    name="institution"
                    value={newTeam.institution}
                    onChange={handleInputChange}
                    placeholder="University name"
                  />
                </div>
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="addTeamForm">
                Add Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Registered Teams</CardTitle>
          <CardDescription>
            {teams.length} teams participating in the hackathon
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teams.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>{team.project}</TableCell>
                    <TableCell>
                      {team.members.slice(0, 2).join(', ')}
                      {team.members.length > 2 && ` (+${team.members.length - 2} more)`}
                    </TableCell>
                    <TableCell>{team.institution || '—'}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeTeam(team.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No teams added yet</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Add Your First Team</span>
              </Button>
            </div>
          )}
        </CardContent>
        {teams.length > 0 && (
          <CardFooter className="border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Teams can also be added by uploading a JSON file in the Import Data section.
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Teams;
