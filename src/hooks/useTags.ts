import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useStorageMode } from '@/hooks/useStorageMode';
import { toast } from 'sonner';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface NoteTag {
  note_id: string;
  tag_id: string;
}

const TAG_COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
  '#ef4444', '#8b5cf6', '#14b8a6', '#f97316', '#84cc16',
];

export const getTagColors = () => TAG_COLORS;

// ─── localStorage helpers ───────────────────────────────────────

const LS_TAGS = (uid: string) => `gn_tags_${uid}`;
const LS_NOTE_TAGS = (uid: string) => `gn_note_tags_${uid}`;

const readLocalTags = (uid: string): Tag[] => {
  try {
    return JSON.parse(localStorage.getItem(LS_TAGS(uid)) || '[]');
  } catch { return []; }
};

const writeLocalTags = (uid: string, tags: Tag[]) => {
  localStorage.setItem(LS_TAGS(uid), JSON.stringify(tags));
};

const readLocalNoteTags = (uid: string): NoteTag[] => {
  try {
    return JSON.parse(localStorage.getItem(LS_NOTE_TAGS(uid)) || '[]');
  } catch { return []; }
};

const writeLocalNoteTags = (uid: string, nts: NoteTag[]) => {
  localStorage.setItem(LS_NOTE_TAGS(uid), JSON.stringify(nts));
};

// ─── Hook ───────────────────────────────────────────────────────

export const useTags = () => {
  const { user } = useAuth();
  const { useCloud, loading: storageModeLoading } = useStorageMode();
  const [tags, setTags] = useState<Tag[]>([]);
  const [noteTags, setNoteTags] = useState<NoteTag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = useCallback(async () => {
    if (!user) {
      setTags([]);
      setNoteTags([]);
      setLoading(false);
      return;
    }
    if (storageModeLoading) return;

    try {
      if (useCloud) {
        const [tagsRes, noteTagsRes] = await Promise.all([
          supabase.from('tags').select('*').eq('user_id', user.id).order('name'),
          supabase.from('note_tags').select('*'),
        ]);
        if (tagsRes.error) throw tagsRes.error;
        if (noteTagsRes.error) throw noteTagsRes.error;
        setTags((tagsRes.data || []).map(t => ({ id: t.id, name: t.name, color: t.color })));
        setNoteTags((noteTagsRes.data || []).map(nt => ({ note_id: nt.note_id, tag_id: nt.tag_id })));
      } else {
        setTags(readLocalTags(user.id));
        setNoteTags(readLocalNoteTags(user.id));
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  }, [user, useCloud, storageModeLoading]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const createTag = useCallback(async (name: string, color: string) => {
    if (!user) return null;

    if (useCloud) {
      try {
        const { data, error } = await supabase
          .from('tags')
          .insert({ user_id: user.id, name: name.trim(), color })
          .select()
          .single();
        if (error) throw error;
        const newTag: Tag = { id: data.id, name: data.name, color: data.color };
        setTags(prev => [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name)));
        return newTag;
      } catch (error: any) {
        if (error.code === '23505') toast.error('Tag já existe');
        else toast.error('Erro ao criar tag');
        return null;
      }
    } else {
      const existing = readLocalTags(user.id);
      if (existing.some(t => t.name.toLowerCase() === name.trim().toLowerCase())) {
        toast.error('Tag já existe');
        return null;
      }
      const newTag: Tag = { id: crypto.randomUUID(), name: name.trim(), color };
      const updated = [...existing, newTag].sort((a, b) => a.name.localeCompare(b.name));
      writeLocalTags(user.id, updated);
      setTags(updated);
      return newTag;
    }
  }, [user, useCloud]);

  const deleteTag = useCallback(async (tagId: string) => {
    if (!user) return;

    if (useCloud) {
      try {
        const { error } = await supabase.from('tags').delete().eq('id', tagId);
        if (error) throw error;
      } catch (error) {
        toast.error('Erro ao remover tag');
        return;
      }
    } else {
      const updatedTags = readLocalTags(user.id).filter(t => t.id !== tagId);
      writeLocalTags(user.id, updatedTags);
      const updatedNTs = readLocalNoteTags(user.id).filter(nt => nt.tag_id !== tagId);
      writeLocalNoteTags(user.id, updatedNTs);
    }

    setTags(prev => prev.filter(t => t.id !== tagId));
    setNoteTags(prev => prev.filter(nt => nt.tag_id !== tagId));
    toast.success('Tag removida');
  }, [user, useCloud]);

  const addTagToNote = useCallback(async (noteId: string, tagId: string) => {
    if (!user) return;

    if (useCloud) {
      try {
        const { error } = await supabase
          .from('note_tags')
          .insert({ note_id: noteId, tag_id: tagId });
        if (error) {
          if (error.code === '23505') return;
          throw error;
        }
      } catch (error) {
        toast.error('Erro ao adicionar tag');
        return;
      }
    } else {
      const existing = readLocalNoteTags(user.id);
      if (existing.some(nt => nt.note_id === noteId && nt.tag_id === tagId)) return;
      const updated = [...existing, { note_id: noteId, tag_id: tagId }];
      writeLocalNoteTags(user.id, updated);
    }

    setNoteTags(prev => [...prev, { note_id: noteId, tag_id: tagId }]);
  }, [user, useCloud]);

  const removeTagFromNote = useCallback(async (noteId: string, tagId: string) => {
    if (!user) return;

    if (useCloud) {
      try {
        const { error } = await supabase
          .from('note_tags')
          .delete()
          .eq('note_id', noteId)
          .eq('tag_id', tagId);
        if (error) throw error;
      } catch (error) {
        toast.error('Erro ao remover tag');
        return;
      }
    } else {
      const updated = readLocalNoteTags(user.id).filter(
        nt => !(nt.note_id === noteId && nt.tag_id === tagId)
      );
      writeLocalNoteTags(user.id, updated);
    }

    setNoteTags(prev => prev.filter(nt => !(nt.note_id === noteId && nt.tag_id === tagId)));
  }, [user, useCloud]);

  const getTagsForNote = useCallback((noteId: string): Tag[] => {
    const tagIds = noteTags.filter(nt => nt.note_id === noteId).map(nt => nt.tag_id);
    return tags.filter(t => tagIds.includes(t.id));
  }, [tags, noteTags]);

  return {
    tags,
    noteTags,
    loading,
    createTag,
    deleteTag,
    addTagToNote,
    removeTagFromNote,
    getTagsForNote,
    getTagColors,
  };
};
