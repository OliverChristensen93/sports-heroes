import { createClient } from "@supabase/supabase-js";

const SupaBaseUrl = "https://vddtoxergynyxlqdyafa.supabase.co";
const SupaBaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZHRveGVyZ3lueXhscWR5YWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTk4MTcsImV4cCI6MjA2MzEzNTgxN30.tpDcXgkhW7X9QKsGjjhauL4vUXyVg1VDDsRGslt4jFU";

const SupaBase = createClient(SupaBaseUrl, SupaBaseKey);

export default SupaBase;
