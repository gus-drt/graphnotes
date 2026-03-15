import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useStorageMode } from '@/hooks/useStorageMode';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, Upload, Loader2 } from 'lucide-react';

const LS_NOTES = (uid: string) => `gn_notes_${uid}`;

export const ImportExport = () => {
  const { user } = useAuth();
  const { useCloud } = useStorageMode();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExportAll = async () => {
    if (!user) return;
    setExporting(true);

    try {
      let notesData: any[];

      if (useCloud && supabase) {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        if (error) throw error;
        notesData = (data || []).map(n => ({
          title: n.title,
          content: n.content,
          createdAt: n.created_at,
          pinned: n.pinned,
        }));
      } else {
        const raw = localStorage.getItem(LS_NOTES(user.id));
        const notes = raw ? JSON.parse(raw) : [];
        notesData = notes.map((n: any) => ({
          title: n.title,
          content: n.content,
          createdAt: n.createdAt,
          pinned: n.pinned,
        }));
      }

      if (notesData.length === 0) {
        toast.error('Nenhuma nota para exportar');
        return;
      }

      const blob = new Blob(
        [JSON.stringify({ exportedAt: new Date().toISOString(), version: 1, notes: notesData }, null, 2)],
        { type: 'application/json' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `graphnotes-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`${notesData.length} notas exportadas`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erro ao exportar notas');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    setImporting(true);
    let imported = 0;

    try {
      for (const file of Array.from(files)) {
        const text = await file.text();

        if (file.name.endsWith('.json')) {
          const data = JSON.parse(text);
          const notes = data.notes || [];

          if (useCloud && supabase) {
            for (const n of notes) {
              await supabase.from('notes').insert({
                user_id: user.id,
                title: n.title || 'Nota importada',
                content: n.content || '',
              });
            }
          } else {
            const raw = localStorage.getItem(LS_NOTES(user.id));
            const existing = raw ? JSON.parse(raw) : [];
            const newNotes = notes.map((n: any) => ({
              id: crypto.randomUUID(),
              title: n.title || 'Nota importada',
              content: n.content || '',
              createdAt: n.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              pinned: false,
              pinnedAt: null,
            }));
            localStorage.setItem(LS_NOTES(user.id), JSON.stringify([...newNotes, ...existing]));
          }
          imported += notes.length;
        } else if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
          const title = file.name.replace(/\.(md|txt)$/, '');

          if (useCloud && supabase) {
            await supabase.from('notes').insert({
              user_id: user.id,
              title,
              content: text,
            });
          } else {
            const raw = localStorage.getItem(LS_NOTES(user.id));
            const existing = raw ? JSON.parse(raw) : [];
            existing.unshift({
              id: crypto.randomUUID(),
              title,
              content: text,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              pinned: false,
              pinnedAt: null,
            });
            localStorage.setItem(LS_NOTES(user.id), JSON.stringify(existing));
          }
          imported += 1;
        }
      }

      toast.success(
        `${imported} nota${imported !== 1 ? 's' : ''} importada${imported !== 1 ? 's' : ''}! Volte à tela principal para visualizar.`
      );
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Erro ao importar notas. Verifique o formato do arquivo.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-2"
          onClick={handleExportAll}
          disabled={exporting}
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Exportar todas
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
        >
          {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Importar
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.md,.txt"
        multiple
        onChange={handleImport}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground">
        Exporte em JSON (todas as notas) ou importe arquivos .json, .md ou .txt
      </p>
    </div>
  );
};
