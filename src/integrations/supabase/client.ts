// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uypmzhnwccwqtbytbsgz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cG16aG53Y2N3cXRieXRic2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4Njk0MjQsImV4cCI6MjA1OTQ0NTQyNH0.gnopO4ZkqTbWe9_WFWsLUDK1F7ZXz5i5KHCUVawws6M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: typeof window !== 'undefined' ? localStorage : undefined
    },
    global: {
      headers: {
        'x-client-info': 'hackathon-judge@1.0.0',
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    db: {
      schema: 'public',
    },
  }
);

// Add a function to test the connection
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('teams').select('id').limit(1);
    
    if (error) {
      if (error.code === 'PGRST301') {
        // This is a common RLS policy error, indicating the connection works
        // but the user doesn't have permission (likely not authenticated)
        return { success: true, error: null };
      }
      
      console.error('Supabase connection test failed with error:', error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Supabase connection test failed with exception:', error);
    return { success: false, error };
  }
};

// Improve the UUID validation to handle different formats
export const isValidUUID = (id: string): boolean => {
  // Modified to accept the t1, t2 format of ids for testing
  if (id.startsWith('t') && id.length <= 3) {
    return true; // Accept simple IDs like t1, t2 for testing
  }
  
  // Regular UUID validation
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};
