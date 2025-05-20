import { createClient } from "@supabase/supabase-js";

//If this was a real project we should use a .env file so its more secure.

const supabaseUrl = "https://vddtoxergynyxlqdyafa.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZHRveGVyZ3lueXhscWR5YWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTk4MTcsImV4cCI6MjA2MzEzNTgxN30.tpDcXgkhW7X9QKsGjjhauL4vUXyVg1VDDsRGslt4jFU";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
