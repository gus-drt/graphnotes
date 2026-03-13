import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useStorageMode } from '@/hooks/useStorageMode';
import { Note, NoteLink } from '@/types/note';
import { WELCOME_NOTES_DATA } from '@/data/welcomeNotes';
import { toast } from 'sonner';

// ─── Helpers ────────────────────────────────────────────────────

const extractLinks = (content: string): string[] => {
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const matches: string[] = [];
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};

// ─── localStorage helpers ───────────────────────────────────────

const LS_NOTES = (uid: string) => `gn_notes_${uid}`;
const LS_CLOUD_IDS = (uid: string) => `gn_cloud_ids_${uid}`;

const readLocalNotes = (uid: string): Note[] => {
  try {
    const raw = localStorage.getItem(LS_NOTES(uid));
    if (!raw) return [];
    return (JSON.parse(raw) as any[]).map(n => ({
      ...n,
      createdAt: new Date(n.createdAt),
      updatedAt: new Date(n.updatedAt),
      pinnedAt: n.pinnedAt ? new Date(n.pinnedAt) : null,
      linkedNotes: extractLinks(n.content),
    }));
  } catch {
    return [];
  }
};

const writeLocalNotes = (uid: string, notes: Note[]) => {
  try {
    localStorage.setItem(
      LS_NOTES(uid),
      JSON.stringify(
        notes.map(n => ({
          id: n.id,
          title: n.title,
          content: n.content,
          createdAt: n.createdAt instanceof Date ? n.createdAt.toISOString() : n.createdAt,
          updatedAt: n.updatedAt instanceof Date ? n.updatedAt.toISOString() : n.updatedAt,
          pinned: n.pinned,
          pinnedAt: n.pinnedAt instanceof Date ? n.pinnedAt.toISOString() : n.pinnedAt,
        }))
      )
    );
  } catch (e) {
    console.error('localStorage write failed:', e);
  }
};

const readCloudIds = (uid: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(LS_CLOUD_IDS(uid)) || '[]');
  } catch {
    return [];
  }
};

const writeCloudIds = (uid: string, ids: string[]) => {
  localStorage.setItem(LS_CLOUD_IDS(uid), JSON.stringify(ids));
};

// Map Supabase row → Note
const mapDbNote = (row: any): Note => ({
  id: row.id,
  title: row.title,
  content: row.content,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  linkedNotes: extractLinks(row.content),
  pinned: row.pinned,
  pinnedAt: row.pinned_at ? new Date(row.pinned_at) : null,
});

// ─── Hook ───────────────────────────────────────────────────────

export const useNotes = () => {
  const { user } = useAuth();
  const { useCloud, cloudNoteLimit, loading: storageModeLoading } = useStorageMode();

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [cloudNoteCount, setCloudNoteCount] = useState(0);

  // Debounce timers for cloud saves
  const saveTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const pendingUpdatesRef = useRef<Map<string, Partial<Pick<Note, 'title' | 'content'>>>>(new Map());

  useEffect(() => {
    return () => {
      saveTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // ─── Auto-select Índice/Index note ─────────────────────────
  const autoSelectIndex = useCallback(
    (notesList: Note[]) => {
      if (!selectedNoteId) {
        const idx = notesList.find(
          n => /^[ií]ndice$/i.test(n.title.trim()) || /^index$/i.test(n.title.trim())
        );
        if (idx) setSelectedNoteId(idx.id);
      }
    },
    [selectedNoteId]
  );

  // ─── Welcome Notes (Cloud) ────────────────────────────────
  const createWelcomeNotesCloud = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert(
          WELCOME_NOTES_DATA.map(n => ({
            user_id: user.id,
            title: n.title,
            content: n.content,
            pinned: n.pinned || false,
            pinned_at: n.pinned ? new Date().toISOString() : null,
          }))
        )
        .select();
      if (error) throw error;
      const created = (data || []).map(mapDbNote);
      setNotes(created);
      const idx = created.find(n => n.title === 'Índice');
      if (idx) setSelectedNoteId(idx.id);
    } catch (error) {
      console.error('Error creating welcome notes:', error);
    }
  }, [user]);

  // ─── Welcome Notes (Local) ────────────────────────────────
  const createWelcomeNotesLocal = useCallback((): Note[] => {
    const now = new Date();
    return WELCOME_NOTES_DATA.map(n => ({
      id: crypto.randomUUID(),
      title: n.title,
      content: n.content,
      createdAt: now,
      updatedAt: now,
      linkedNotes: extractLinks(n.content),
      pinned: n.pinned || false,
      pinnedAt: n.pinned ? now : null,
    }));
  }, []);

  // ─── fetchNotes ────────────────────────────────────────────
  const fetchNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }
    if (storageModeLoading) return;

    try {
      if (useCloud) {
        // ── CLOUD MODE ──
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        if (error) throw error;

        const fetched = (data || []).map(mapDbNote);
        setNotes(fetched);
        autoSelectIndex(fetched);
        if (fetched.length === 0) await createWelcomeNotesCloud();
      } else {
        // ── LOCAL MODE ──
        let localNotes = readLocalNotes(user.id);

        if (localNotes.length === 0) {
          // Try pulling existing cloud notes (e.g. migration from paid → free)
          try {
            const { data } = await supabase
              .from('notes')
              .select('*')
              .eq('user_id', user.id)
              .order('updated_at', { ascending: false })
              .limit(cloudNoteLimit === Infinity ? 1000 : cloudNoteLimit);

            if (data && data.length > 0) {
              localNotes = data.map(mapDbNote);
              writeLocalNotes(user.id, localNotes);
              writeCloudIds(user.id, data.map(d => d.id));
              setCloudNoteCount(data.length);
            } else {
              localNotes = createWelcomeNotesLocal();
              writeLocalNotes(user.id, localNotes);
            }
          } catch {
            localNotes = createWelcomeNotesLocal();
            writeLocalNotes(user.id, localNotes);
          }
        } else {
          const cloudIds = readCloudIds(user.id);
          setCloudNoteCount(cloudIds.length);
        }

        setNotes(localNotes);
        autoSelectIndex(localNotes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Erro ao carregar notas');
    } finally {
      setLoading(false);
    }
  }, [user, useCloud, storageModeLoading, cloudNoteLimit, autoSelectIndex, createWelcomeNotesCloud, createWelcomeNotesLocal]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ─── saveToDatabase (cloud debounce target) ────────────────
  const saveToDatabase = useCallback(
    async (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
      if (!user) return;
      try {
        const { error } = await supabase
          .from('notes')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .eq('user_id', user.id);
        if (error) throw error;
      } catch (error) {
        console.error('Error updating note:', error);
        if (useCloud) toast.error('Erro ao salvar nota');
      }
    },
    [user, useCloud]
  );

  // ─── createNote ────────────────────────────────────────────
  const createNote = useCallback(
    async (title: string = 'Nova Nota', initialContent?: string) => {
      if (!user) return null;
      const content = initialContent ?? `# ${title}\n\n`;

      if (useCloud) {
        try {
          const { data, error } = await supabase
            .from('notes')
            .insert({ user_id: user.id, title, content })
            .select()
            .single();
          if (error) throw error;
          const newNote = mapDbNote(data);
          setNotes(prev => [newNote, ...prev]);
          setSelectedNoteId(newNote.id);
          return newNote;
        } catch (error) {
          console.error('Error creating note:', error);
          toast.error('Erro ao criar nota');
          return null;
        }
      } else {
        const newNote: Note = {
          id: crypto.randomUUID(),
          title,
          content,
          createdAt: new Date(),
          updatedAt: new Date(),
          linkedNotes: extractLinks(content),
          pinned: false,
          pinnedAt: null,
        };

        setNotes(prev => {
          const updated = [newNote, ...prev];
          writeLocalNotes(user.id, updated);
          return updated;
        });
        setSelectedNoteId(newNote.id);

        // Cloud sync if under limit
        const cloudIds = readCloudIds(user.id);
        if (cloudIds.length < cloudNoteLimit) {
          supabase
            .from('notes')
            .insert({ id: newNote.id, user_id: user.id, title, content })
            .then(({ error }) => {
              if (!error) {
                const ids = [...cloudIds, newNote.id];
                writeCloudIds(user.id, ids);
                setCloudNoteCount(ids.length);
              }
            });
        }

        return newNote;
      }
    },
    [user, useCloud, cloudNoteLimit]
  );

  // ─── updateNote ────────────────────────────────────────────
  const updateNote = useCallback(
    (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
      // Immediate local state update
      setNotes(prev => {
        const updated = prev.map(note => {
          if (note.id !== id) return note;
          const newContent = updates.content ?? note.content;
          return {
            ...note,
            ...updates,
            linkedNotes: extractLinks(newContent),
            updatedAt: new Date(),
          };
        });
        // For local mode, persist immediately
        if (!useCloud && user) writeLocalNotes(user.id, updated);
        return updated;
      });

      // Debounced cloud save
      const shouldSyncCloud =
        useCloud || (user && readCloudIds(user.id).includes(id));

      if (shouldSyncCloud) {
        const currentPending = pendingUpdatesRef.current.get(id) || {};
        pendingUpdatesRef.current.set(id, { ...currentPending, ...updates });

        const existingTimer = saveTimersRef.current.get(id);
        if (existingTimer) clearTimeout(existingTimer);

        const timer = setTimeout(() => {
          const pendingUpdate = pendingUpdatesRef.current.get(id);
          if (pendingUpdate) {
            saveToDatabase(id, pendingUpdate);
            pendingUpdatesRef.current.delete(id);
          }
          saveTimersRef.current.delete(id);
        }, 500);

        saveTimersRef.current.set(id, timer);
      }
    },
    [user, useCloud, saveToDatabase]
  );

  // ─── flushPendingUpdates ───────────────────────────────────
  const flushPendingUpdates = useCallback(async () => {
    const promises: Promise<void>[] = [];
    saveTimersRef.current.forEach((timer, id) => {
      clearTimeout(timer);
      const pendingUpdate = pendingUpdatesRef.current.get(id);
      if (pendingUpdate) promises.push(saveToDatabase(id, pendingUpdate));
    });
    saveTimersRef.current.clear();
    pendingUpdatesRef.current.clear();
    await Promise.all(promises);
  }, [saveToDatabase]);

  // ─── deleteNote ────────────────────────────────────────────
  const deleteNote = useCallback(
    async (id: string) => {
      if (!user) return;

      // Clear pending updates
      const timer = saveTimersRef.current.get(id);
      if (timer) {
        clearTimeout(timer);
        saveTimersRef.current.delete(id);
      }
      pendingUpdatesRef.current.delete(id);

      if (useCloud) {
        try {
          const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);
          if (error) throw error;
        } catch (error) {
          console.error('Error deleting note:', error);
          toast.error('Erro ao excluir nota');
          return;
        }
      }

      setNotes(prev => {
        const updated = prev.filter(n => n.id !== id);
        if (!useCloud) writeLocalNotes(user.id, updated);
        return updated;
      });

      // Clean up cloud sync for local mode
      if (!useCloud) {
        const cloudIds = readCloudIds(user.id);
        if (cloudIds.includes(id)) {
          supabase
            .from('notes')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)
            .then(() => {
              const newIds = cloudIds.filter(cid => cid !== id);
              writeCloudIds(user.id, newIds);
              setCloudNoteCount(newIds.length);
            });
        }
      }

      if (selectedNoteId === id) setSelectedNoteId(null);
      toast.success('Nota excluída');
    },
    [user, useCloud, selectedNoteId]
  );

  // ─── togglePinNote ─────────────────────────────────────────
  const togglePinNote = useCallback(
    async (id: string) => {
      if (!user) return;
      const note = notes.find(n => n.id === id);
      if (!note) return;

      const currentPinnedCount = notes.filter(n => n.pinned).length;
      const newPinned = !note.pinned;

      if (newPinned && currentPinnedCount >= 3) {
        toast.error('Você pode fixar no máximo 3 notas');
        return;
      }

      const pinnedAt = newPinned ? new Date() : null;

      // Optimistic update
      setNotes(prev => {
        const updated = prev.map(n =>
          n.id === id ? { ...n, pinned: newPinned, pinnedAt } : n
        );
        if (!useCloud) writeLocalNotes(user.id, updated);
        return updated;
      });

      if (useCloud) {
        try {
          const { error } = await supabase
            .from('notes')
            .update({
              pinned: newPinned,
              pinned_at: pinnedAt?.toISOString() ?? null,
            })
            .eq('id', id)
            .eq('user_id', user.id);
          if (error) throw error;
        } catch (error) {
          console.error('Error toggling pin:', error);
          setNotes(prev =>
            prev.map(n =>
              n.id === id ? { ...n, pinned: note.pinned, pinnedAt: note.pinnedAt } : n
            )
          );
          toast.error('Erro ao fixar nota');
          return;
        }
      } else {
        // Background cloud sync
        const cloudIds = readCloudIds(user.id);
        if (cloudIds.includes(id)) {
          supabase
            .from('notes')
            .update({
              pinned: newPinned,
              pinned_at: pinnedAt?.toISOString() ?? null,
            })
            .eq('id', id)
            .eq('user_id', user.id);
        }
      }

      toast.success(newPinned ? 'Nota fixada' : 'Nota desafixada');
    },
    [user, useCloud, notes]
  );

  // ─── Computed values ───────────────────────────────────────

  const selectedNote = notes.find(n => n.id === selectedNoteId) || null;
  const pinnedCount = notes.filter(n => n.pinned).length;

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (a.pinned && b.pinned) {
      return (b.pinnedAt?.getTime() || 0) - (a.pinnedAt?.getTime() || 0);
    }
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  const filteredNotes = sortedNotes.filter(
    note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── getLinks ──────────────────────────────────────────────

  const getLinks = useCallback((): NoteLink[] => {
    const links: NoteLink[] = [];
    const addedLinks = new Set<string>();

    notes.forEach(note => {
      const linkedTitles = extractLinks(note.content);
      linkedTitles.forEach(linkedTitle => {
        const targetNote = notes.find(
          n => n.title.toLowerCase().trim() === linkedTitle.toLowerCase().trim()
        );
        if (targetNote && targetNote.id !== note.id) {
          const linkKey = [note.id, targetNote.id].sort().join('-');
          if (!addedLinks.has(linkKey)) {
            links.push({ source: note.id, target: targetNote.id });
            addedLinks.add(linkKey);
          }
        }
      });
    });

    return links;
  }, [notes]);

  const getNoteByTitle = useCallback(
    (title: string): Note | undefined => {
      return notes.find(n => n.title.toLowerCase().trim() === title.toLowerCase().trim());
    },
    [notes]
  );

  const navigateToNote = useCallback(
    async (title: string) => {
      await flushPendingUpdates();
      const note = getNoteByTitle(title);
      if (note) {
        setSelectedNoteId(note.id);
      } else {
        const newNote = await createNote(title);
        if (newNote) setSelectedNoteId(newNote.id);
      }
    },
    [getNoteByTitle, createNote, flushPendingUpdates]
  );

  return {
    notes,
    filteredNotes,
    selectedNote,
    selectedNoteId,
    setSelectedNoteId,
    searchQuery,
    setSearchQuery,
    createNote,
    updateNote,
    deleteNote,
    togglePinNote,
    pinnedCount,
    getLinks,
    getNoteByTitle,
    navigateToNote,
    flushPendingUpdates,
    loading,
    cloudNoteCount,
    cloudNoteLimit,
    useCloud,
  };
};
