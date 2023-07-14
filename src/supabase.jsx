import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabaseUrl = "https://dydrduassiuiklasdfnf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5ZHJkdWFzc2l1aWtsYXNkZm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODgyMDIwMTIsImV4cCI6MjAwMzc3ODAxMn0.m3k09BPX_IyHEZA-oZyfnpnkGeeDdgx6gCjMzAYwdsA";
export const supabase = createClient(supabaseUrl, supabaseKey);
