import { createClient } from '@supabase/supabase-js';

// Create a Supabase client using environment variables.
// If these variables are missing the client will throw on use.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);