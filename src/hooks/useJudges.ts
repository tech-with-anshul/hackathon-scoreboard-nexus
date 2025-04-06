
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Judge } from '@/types/hackathon';

export const useJudges = (initialJudges: Judge[] = []) => {
  const [judges, setJudges] = useState<Judge[]>(initialJudges);

  const loadJudges = async () => {
    try {
      // Fetch judges from Supabase
      const { data: judgesData, error: judgesError } = await supabase
        .from('judges')
        .select('*');
        
      if (judgesError) throw judgesError;
      
      if (judgesData) {
        // Map Supabase data to our Judge interface
        const mappedJudges: Judge[] = judgesData.map(judge => ({
          id: judge.id,
          name: judge.name,
          email: judge.email
        }));
        setJudges(mappedJudges);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading judges:', error);
      return false;
    }
  };

  const addJudge = async (judge: Omit<Judge, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('judges')
        .insert({
          name: judge.name,
          email: judge.email
        })
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        const newJudge: Judge = {
          id: data.id,
          name: data.name,
          email: data.email
        };
        setJudges([...judges, newJudge]);
        toast.success(`Judge "${judge.name}" added successfully`);
      }
    } catch (error) {
      console.error('Error adding judge:', error);
      toast.error('Failed to add judge');
    }
  };

  const removeJudge = async (id: string) => {
    try {
      const { error } = await supabase
        .from('judges')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setJudges(judges.filter((judge) => judge.id !== id));
      toast.success('Judge removed successfully');
    } catch (error) {
      console.error('Error removing judge:', error);
      toast.error('Failed to remove judge');
    }
  };

  const uploadJudges = async (judgesData: Omit<Judge, 'id'>[]) => {
    try {
      const judgesToInsert = judgesData.map(judge => ({
        name: judge.name,
        email: judge.email
      }));
      
      const { data, error } = await supabase
        .from('judges')
        .insert(judgesToInsert)
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newJudges: Judge[] = data.map(judge => ({
          id: judge.id,
          name: judge.name,
          email: judge.email
        }));
        setJudges([...judges, ...newJudges]);
        toast.success(`${newJudges.length} judges uploaded successfully`);
      }
    } catch (error) {
      console.error('Error uploading judges:', error);
      toast.error('Failed to upload judges');
    }
  };

  return {
    judges,
    setJudges,
    loadJudges,
    addJudge,
    removeJudge,
    uploadJudges
  };
};
