import { useAuth } from './useAuth';

const ADMIN_EMAIL = 'duartegustavoh@gmail.com';
const FREE_CLOUD_LIMIT = 50;

/**
 * Determines whether the user should save to cloud or locally.
 *
 * - Admin: unlimited cloud notes
 * - All users: up to FREE_CLOUD_LIMIT notes in the cloud, rest local
 *
 * `cloudNoteCount` is passed in from useNotesDb so this hook stays
 * lightweight and doesn't need to query Supabase itself.
 */
export function useStorageMode(cloudNoteCount: number = 0) {
  const { user } = useAuth();

  const isAdmin = user?.email === ADMIN_EMAIL;

  const cloudNoteLimit = isAdmin ? Infinity : FREE_CLOUD_LIMIT;
  const canStoreInCloud = isAdmin || cloudNoteCount < FREE_CLOUD_LIMIT;

  return {
    isAdmin,
    /** Whether the NEXT new note can go to cloud */
    canStoreInCloud,
    /** Whether the user has ANY cloud access (is authenticated + Supabase available) */
    useCloud: !!user,
    cloudNoteLimit,
    /** Always false — no subscription loading anymore */
    loading: false,
    /** Always false — no migration between plans */
    migrationInProgress: false,
  };
}
