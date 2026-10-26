import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://nuknakbgyefxlpedyiot.supabase.co";

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_aioWvh3yuvRA-7Ob9tPwew_bdCYWOer";

const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY || supabasePublishableKey;

// Client for browser / public actions (RLS governed)
export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// Admin client for secure backend API routes (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey);
