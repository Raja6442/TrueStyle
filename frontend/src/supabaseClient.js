import { createClient } from '@supabase/supabase-js';

// Replace these variables with your actual Supabase project credentials later if needed
const SUPABASE_URL = "https://ahvsinxbmpnczzobgjpm.supabase.co";
const SUPABASE_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnNpbnhibXBuY3p6b2JnanBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODkzOTEsImV4cCI6MjEwMjE2NTM5MX0.8Bwkiq0d0CFpyv1vo3LRKqs970I8q9BXkAjyccq4yMY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
