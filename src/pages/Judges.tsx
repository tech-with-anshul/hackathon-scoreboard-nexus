
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useHackathon } from '@/contexts/HackathonContext';
import { Plus, Trash2 } from 'lucide-react';

const Judges = () => {
  const { judges, addJudge, removeJudge } = useHackathon();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newJudge, setNewJudge] = useState({
    name: '',
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewJudge(prev => ({ ...prev, [name]: value }));
  };

  const handleAddJudge = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newJudge.name || !newJudge.email) return;
    
    addJudge({
      name: newJudge.name,
      email: newJudge.email
    });
    
    // Reset form and close dialog
    setNewJudge({
      name: '',
      email: ''
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Judges</h1>
          <p className="text-muted-foreground">
            Manage judges evaluating the hackathon.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-hackathon-yellow text-hackathon-dark hover:bg-hackathon-yellow/80">
              <Plus size={16} />
              <span>Add Judge</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Judge</DialogTitle>
              <DialogDescription>
                Enter the details for the new judge.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddJudge} id="addJudgeForm">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newJudge.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address*</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newJudge.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="addJudgeForm">
                Add Judge
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Registered Judges</CardTitle>
          <CardDescription>
            {judges.length} judges evaluating the hackathon
          </CardDescription>
        </CardHeader>
        <CardContent>
          {judges.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {judges.map((judge) => (
                  <TableRow key={judge.id}>
                    <TableCell className="font-medium">{judge.name}</TableCell>
                    <TableCell>{judge.email}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeJudge(judge.id)}
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
              <p className="text-muted-foreground mb-4">No judges added yet</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Add Your First Judge</span>
              </Button>
            </div>
          )}
        </CardContent>
        {judges.length > 0 && (
          <CardFooter className="border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Judges can also be added by uploading a JSON file in the Import Data section.
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Judges;
