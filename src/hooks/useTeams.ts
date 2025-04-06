
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Team } from '@/types/hackathon';
import { MOCK_TEAMS } from '@/data/mockTeams';

export const useTeams = (initialTeams: Team[] = []) => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  const loadTeams = async (setConnectionError: (value: boolean) => void) => {
    try {
      // Fetch teams from Supabase
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*');
        
      if (teamsError) throw teamsError;
      
      if (teamsData && teamsData.length > 0) {
        // Map Supabase data to our Team interface
        const mappedTeams: Team[] = teamsData.map(team => ({
          id: team.id,
          name: team.name,
          members: team.members,
          project: team.project,
          institution: team.institution || undefined
        }));
        setTeams(mappedTeams);
        return true;
      } else {
        // If no teams in DB, use mock data
        setTeams(MOCK_TEAMS);
        
        // Insert mock teams into Supabase
        for (const team of MOCK_TEAMS) {
          // Create a new team object without the 'id' field
          // as Supabase will generate UUID automatically
          const { name, members, project, institution } = team;
          
          try {
            await supabase.from('teams').insert({
              name,
              members,
              project,
              institution
            });
          } catch (insertError) {
            console.error('Error inserting team:', insertError);
          }
        }
        return true;
      }
    } catch (error) {
      console.error('Error loading teams:', error);
      setConnectionError(true);
      setTeams(MOCK_TEAMS);
      return false;
    }
  };

  const addTeam = async (team: Omit<Team, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: team.name,
          members: team.members,
          project: team.project,
          institution: team.institution || null
        })
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        const newTeam: Team = {
          id: data.id,
          name: data.name,
          members: data.members,
          project: data.project,
          institution: data.institution || undefined
        };
        setTeams([...teams, newTeam]);
        toast.success(`Team "${team.name}" added successfully`);
      }
    } catch (error) {
      console.error('Error adding team:', error);
      toast.error('Failed to add team');
    }
  };

  const removeTeam = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setTeams(teams.filter((team) => team.id !== id));
      toast.success('Team removed successfully');
    } catch (error) {
      console.error('Error removing team:', error);
      toast.error('Failed to remove team');
    }
  };

  const uploadTeams = async (teamsData: Omit<Team, 'id'>[]) => {
    try {
      const teamsToInsert = teamsData.map(team => ({
        name: team.name,
        members: team.members,
        project: team.project,
        institution: team.institution || null
      }));
      
      const { data, error } = await supabase
        .from('teams')
        .insert(teamsToInsert)
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newTeams: Team[] = data.map(team => ({
          id: team.id,
          name: team.name,
          members: team.members,
          project: team.project,
          institution: team.institution || undefined
        }));
        setTeams([...teams, ...newTeams]);
        toast.success(`${newTeams.length} teams uploaded successfully`);
      }
    } catch (error) {
      console.error('Error uploading teams:', error);
      toast.error('Failed to upload teams');
    }
  };

  return {
    teams,
    setTeams,
    loadTeams,
    addTeam,
    removeTeam,
    uploadTeams
  };
};
