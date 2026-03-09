import { useNavigate } from 'react-router-dom';
import { Note } from '@/types/note';
import { Tag } from '@/hooks/useTags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FileText, Loader2, Pin, Crown } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onTogglePin: (id: string) => void;
  pinnedCount: number;
  loading?: boolean;
  getTagsForNote: (noteId: string) => Tag[];
}

export const NoteList = ({
  notes,
  selectedNoteId,
  searchQuery,
  onSearchChange,
  onSelectNote,
  onCreateNote,
  onTogglePin,
  pinnedCount,
  loading = false,
  getTagsForNote,
}: NoteListProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Pricing Banner */}
      <button
        onClick={() => navigate('/pricing')}
        className="mx-3 mt-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 flex items-center gap-3 hover:from-purple-500/20 hover:to-pink-500/20 transition-colors text-left"
      >
        <div className="h-9 w-9 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Upgrade Pro</p>
          <p className="text-xs text-muted-foreground truncate">Notas ilimitadas + IA</p>
        </div>
        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Ver planos →</span>
      </button>

      {/* Header */}
      <div className="p-3 sm:p-4">
        <h2 className="text-lg font-semibold mb-3">Minhas Notas</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar notas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>

        {/* Create button */}
        <Button
          onClick={onCreateNote}
          className="w-full h-10 rounded-xl"
          variant="outline"
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Nota
        </Button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-auto px-3 pb-3">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center p-4">
            {searchQuery ? 'Nenhuma nota encontrada' : 'Nenhuma nota ainda'}
          </p>
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedNoteId === note.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted/50 hover:bg-muted'
                }`}
              >
                <div className="flex items-start gap-2 min-w-0">
                  <button
                    onClick={() => onSelectNote(note.id)}
                    className="flex-1 min-w-0 text-left active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-60" />
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <h3 className="font-medium truncate text-sm">{note.title}</h3>
                        <p className={`text-xs truncate mt-0.5 ${
                          selectedNoteId === note.id ? 'opacity-70' : 'text-muted-foreground'
                        }`}>
                          {note.content.replace(/[#*_\[\]`]/g, '').slice(0, 50)}...
                        </p>
                        {note.linkedNotes.length > 0 && (
                          <p className={`text-xs mt-1 ${
                            selectedNoteId === note.id ? 'opacity-60' : 'text-muted-foreground'
                          }`}>
                            🔗 {note.linkedNotes.length} conexão(ões)
                          </p>
                        )}
                        {(() => {
                          const noteTags = getTagsForNote(note.id);
                          return noteTags.length > 0 ? (
                            <div className="flex gap-1 flex-wrap mt-1.5">
                              {noteTags.map(tag => (
                                <span
                                  key={tag.id}
                                  className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
                                  style={{ backgroundColor: tag.color }}
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(note.id);
                    }}
                    className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                      note.pinned
                        ? selectedNoteId === note.id
                          ? 'text-primary-foreground'
                          : 'text-primary'
                        : selectedNoteId === note.id
                          ? 'text-primary-foreground/40 hover:text-primary-foreground'
                          : 'text-muted-foreground/40 hover:text-muted-foreground'
                    }`}
                    title={note.pinned ? 'Desafixar nota' : pinnedCount >= 3 ? 'Limite de 3 notas fixadas' : 'Fixar nota'}
                  >
                    <Pin className={`w-4 h-4 ${note.pinned ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 text-xs text-muted-foreground text-center border-t border-border/50">
        {loading ? 'Carregando...' : `${notes.length} nota(s)`}
      </div>
    </div>
  );
};
