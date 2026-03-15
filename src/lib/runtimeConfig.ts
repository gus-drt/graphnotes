export function getMissingPublicConfig(): string[] {
  const missing: string[] = [];

  // URL can be provided directly or constructed from the project ID
  if (
    !import.meta.env.VITE_SUPABASE_URL &&
    !import.meta.env.VITE_SUPABASE_PROJECT_URL &&
    !import.meta.env.VITE_SUPABASE_PROJECT_ID
  ) {
    missing.push('VITE_SUPABASE_URL');
  }

  // Accept either the modern "publishable key" or legacy "anon key"
  if (!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY && !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    missing.push('VITE_SUPABASE_PUBLISHABLE_KEY');
  }

  return missing;
}
