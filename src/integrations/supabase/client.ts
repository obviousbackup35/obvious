// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jnrqywgcjfrbcojfsssk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucnF5d2djamZyYmNvamZzc3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2OTYxNzQsImV4cCI6MjA1NDI3MjE3NH0.w3sD_bzR66JIcZe2opb6oBfjEfKd8T2u3wm_oZnJkiY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);