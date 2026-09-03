import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Sigma } from 'lucide-react';

const Formatting = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border/50 p-3 sm:p-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="h-9 w-9 p-0 rounded-xl sm:h-auto sm:w-auto sm:px-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Voltar</span>
          </Button>
          <h1 className="text-lg font-semibold flex-1">Guia de Formatação</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sigma className="w-5 h-5" />
              Fórmulas matemáticas (LaTeX)
            </CardTitle>
            <CardDescription>
              Você pode escrever fórmulas inline ou em bloco e visualizar no preview.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>Use os botões <strong>$...$</strong> e <strong>$$...$$</strong> no editor para inserir os modelos.</p>
            <div className="space-y-2">
              <p className="font-medium">Inline</p>
              <pre className="bg-muted/40 rounded-xl p-3 overflow-x-auto"><code>$x^2 + y^2 = z^2$</code></pre>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Bloco</p>
              <pre className="bg-muted/40 rounded-xl p-3 overflow-x-auto"><code>{`$$
\\int_0^1 x^2\\,dx = \\frac{1}{3}
$$`}</code></pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Formatações básicas</CardTitle>
            <CardDescription>Os mesmos recursos de Markdown já suportados nas notas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-2">Títulos</p>
              <pre className="bg-muted/40 rounded-xl p-3 overflow-x-auto"><code>{`# Título
## Subtítulo
### Seção`}</code></pre>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Texto</p>
              <pre className="bg-muted/40 rounded-xl p-3 overflow-x-auto"><code>{`**negrito**
*itálico*
++sublinhado++
~~riscado~~
\`código\``}</code></pre>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Listas e tarefas</p>
              <pre className="bg-muted/40 rounded-xl p-3 overflow-x-auto"><code>{`- item
1. primeiro
- [ ] pendente
- [x] concluída`}</code></pre>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Links</p>
              <pre className="bg-muted/40 rounded-xl p-3 overflow-x-auto"><code>{`[site](https://example.com)
[[nome da nota]]`}</code></pre>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Formatting;
