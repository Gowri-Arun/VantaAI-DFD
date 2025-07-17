
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lgtzqdokshkyvepkndqz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxndHpxZG9rc2hreXZlcGtuZHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NTE4MjAsImV4cCI6MjA2ODMyNzgyMH0.fZ9JuUeLwHRIcQcyKaceb5PJ2AO-C2qkuN6EYnjzAvM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

