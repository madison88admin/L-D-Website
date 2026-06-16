import { createClient } from '@supabase/supabase-js';

// The publishable (anon) key is designed to be exposed in the browser, so we
// fall back to the project's public values when the host hasn't set env vars.
// This keeps deployments working even without dashboard-configured env vars.
// NOTE: never add the secret/service-role key or DB password here.
const FALLBACK_SUPABASE_URL = 'https://geaqyvwridivvbdomiqq.supabase.co';
const FALLBACK_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_T8ojEZfpmZewf07bXI2z6w_bBAZy4tC';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;
