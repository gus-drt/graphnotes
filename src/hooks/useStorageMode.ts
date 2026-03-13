import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';

const ADMIN_EMAIL = 'duartegustavoh@gmail.com';
const FREE_CLOUD_LIMIT = 20;

export function useStorageMode() {
  const { user } = useAuth();
  const { plan, loading: subLoading } = useSubscription(user?.email ?? undefined);

  const isAdmin = user?.email === ADMIN_EMAIL;

  // Use cached mode during subscription loading to avoid flicker
  const cachedMode = user ? localStorage.getItem(`gn_mode_${user.id}`) : null;

  const isPaid = plan !== 'free';
  const useCloud = isAdmin || isPaid;

  useEffect(() => {
    if (!subLoading && user) {
      localStorage.setItem(`gn_mode_${user.id}`, useCloud ? 'cloud' : 'local');
    }
  }, [subLoading, user, useCloud]);

  const resolvedUseCloud = subLoading
    ? (cachedMode === 'cloud' || isAdmin)
    : useCloud;

  return {
    isAdmin,
    isPaid: subLoading ? cachedMode === 'cloud' : isPaid,
    useCloud: resolvedUseCloud,
    cloudNoteLimit: resolvedUseCloud ? Infinity : FREE_CLOUD_LIMIT,
    loading: subLoading && !cachedMode && !isAdmin,
  };
}
