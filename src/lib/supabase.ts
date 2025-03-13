import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types"; // Ensure you have this type definition

const supabaseUrl = "https://fgupppcvyddxuttscnpn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndXBwcGN2eWRkeHV0dHNjbnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NDg5MDEsImV4cCI6MjA1MjQyNDkwMX0.nhaUDwgCjBL6Exr4Y_pYQGCPzTIiZmP-iIC0AsWfmuc";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Enable this for Next.js Auth handling
  },
});
