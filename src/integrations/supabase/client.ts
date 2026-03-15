import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// ─── Resolve Supabase URL ────────────────────────────────────
// Accepts several naming conventions so the same code works across
// local .env files and hosting providers (Netlify, Vercel, etc.).
// Priority: explicit URL → project URL alias → constructed from project ID
const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_PROJECT_URL ||
  (SUPABASE_PROJECT_ID ? `https://${SUPABASE_PROJECT_ID}.supabase.co` : '');

// ─── Resolve Supabase Key ────────────────────────────────────
// Modern Supabase dashboards label the public key as "publishable key",
// while older docs/tooling call it "anon key". Accept both.
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Whether Supabase environment variables are properly configured.
 * When false, the app operates in offline/local-only mode.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

if (!isSupabaseConfigured) {
  const parts: string[] = [];
  if (!SUPABASE_URL) parts.push('VITE_SUPABASE_URL (or VITE_SUPABASE_PROJECT_ID)');
  if (!SUPABASE_KEY) parts.push('VITE_SUPABASE_PUBLISHABLE_KEY');
  console.warn(
    `[GraphNotes] Missing Supabase env vars: ${parts.join(', ')}. ` +
    'The app will operate in local-only mode. ' +
    'Set these in your .env file or hosting provider environment variables.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;