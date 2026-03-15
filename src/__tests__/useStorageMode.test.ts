import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useAuth module
const mockUser = { email: 'usuario@test.com', id: 'test-123' };
const mockAdminUser = { email: 'duartegustavoh@gmail.com', id: 'admin-123' };
let currentUser: typeof mockUser | null = null;

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: currentUser }),
}));

// Import after mocking
import { useStorageMode } from '@/hooks/useStorageMode';

// We need to test the hook logic directly since it's a simple hook
// We'll use a minimal renderHook approach via vitest

describe('useStorageMode', () => {
  beforeEach(() => {
    currentUser = null;
  });

  describe('Regular User', () => {
    beforeEach(() => {
      currentUser = mockUser;
    });

    it('should allow cloud storage when under limit', () => {
      const result = useStorageMode(10);
      expect(result.isAdmin).toBe(false);
      expect(result.canStoreInCloud).toBe(true);
      expect(result.cloudNoteLimit).toBe(50);
    });

    it('should deny cloud storage when at limit', () => {
      const result = useStorageMode(50);
      expect(result.canStoreInCloud).toBe(false);
      expect(result.cloudNoteLimit).toBe(50);
    });

    it('should deny cloud storage when over limit', () => {
      const result = useStorageMode(75);
      expect(result.canStoreInCloud).toBe(false);
    });

    it('should have loading always false', () => {
      const result = useStorageMode(0);
      expect(result.loading).toBe(false);
    });

    it('should have migrationInProgress always false', () => {
      const result = useStorageMode(0);
      expect(result.migrationInProgress).toBe(false);
    });

    it('should default cloudNoteCount to 0', () => {
      const result = useStorageMode();
      expect(result.canStoreInCloud).toBe(true);
    });
  });

  describe('Admin User', () => {
    beforeEach(() => {
      currentUser = mockAdminUser;
    });

    it('should always allow cloud storage for admin', () => {
      const result = useStorageMode(500);
      expect(result.isAdmin).toBe(true);
      expect(result.canStoreInCloud).toBe(true);
      expect(result.cloudNoteLimit).toBe(Infinity);
    });

    it('should have unlimited cloud note limit', () => {
      const result = useStorageMode(0);
      expect(result.cloudNoteLimit).toBe(Infinity);
    });
  });

  describe('No User', () => {
    it('should not be admin when no user', () => {
      currentUser = null;
      const result = useStorageMode(0);
      expect(result.isAdmin).toBe(false);
      expect(result.useCloud).toBe(false);
    });
  });
});
