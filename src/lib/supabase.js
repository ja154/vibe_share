import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://myaltytkgiejtkvvsesejd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15YWx0eWtnaWVqdGt2dnNlc2pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjYwMjAsImV4cCI6MjA2NzY0MjAyMH0.I9JtpCVyBNstVk27bvTV2m9ngyujdFPoQsHC6csUPfg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)