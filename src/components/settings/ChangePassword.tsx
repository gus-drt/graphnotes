import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Lock } from 'lucide-react';

export const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      if (!supabase) {
        toast.error('Funcionalidade indisponível no modo offline.');
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast.success('Senha alterada com sucesso!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleChange} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="new-password" className="text-sm">Nova senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="new-password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-background/50"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-sm">Confirmar nova senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-background/50"
          />
        </div>
      </div>
      <Button type="submit" size="sm" className="rounded-xl" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Alterar senha'}
      </Button>
    </form>
  );
};
