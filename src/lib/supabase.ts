import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log("Supabase Client Init - URL:", supabaseUrl ? "Found" : "MISSING");
console.log("Supabase Client Init - Key:", supabaseAnonKey ? "Found" : "MISSING");

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing. Image uploads will fail until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
