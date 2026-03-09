
## Visão Geral da Mudança

O projeto passa de um visual **neo-brutalista** (bordas duras, sem raio, sombras sólidas) para uma estética **moderna e clean**, inspirada na UI do Lovable.dev / ChatGPT / iOS 18. A navegação superior lotada é substituída por uma **bottom bar flutuante** com glassmorphism.

---

## Design System — O Que Muda

### Tokens CSS (`src/index.css`)
- **Border radius:** `--radius: 0rem` → `1rem` (cantos arredondados em tudo)
- **Sombras:** flat offsets → `box-shadow` suaves com blur (`rgba`)
- **Bordas:** `border-2 border-border` pesadas → `border border-white/10` sutis com fundo `bg-white/70 backdrop-blur`
- **Fundo:** mantém a paleta atual de cores (Cloud Dancer / dark muted) — só a geometria muda
- **Glassmorphism vars:** adição de `--glass-bg`, `--glass-border`, `--glass-shadow` para reutilização

### Tailwind config (`tailwind.config.ts`)
- `borderRadius` atualizado para usar `--radius` variável (herdará o novo valor)

---

## Nova Estrutura de Layout — `Index.tsx`

```text
┌─────────────────────────────────────┐
│                                     │  ← Conteúdo principal ocupa 100dvh
│   [Editor / Graph]                  │     com padding-bottom para não ficar
│                                     │     atrás da bottom bar
│                                     │
│  ●  FAB (+)  ← centro flutuante     │
│                                     │
├─────────────────────────────────────┤
│  [☰]   [✏ Editor] [+] [⬡ Graph] [⚙]│  ← Bottom Bar flutuante com glass
└─────────────────────────────────────┘
```

**Bottom Bar (mobile + desktop)**
- Posição: `fixed bottom-4 left-4 right-4` com `rounded-2xl backdrop-blur-xl`
- 5 zonas: `[☰ Menu]` · `[✏ Editor]` · `[+ FAB central]` · `[⬡ Graph]` · `[⚙ Settings]`
- O botão central `+` é elevado (maior, com cor de destaque) para criar nota
- O **Crown/Pricing** vai **dentro do menu lateral** (`NoteList`), como um banner no topo — soluciona o problema de simetria sem sobrecarregar a bottom bar
- Swipe horizontal (já existente no `useSwipe`) passa a trocar entre Editor e Graph

**Note List / Menu Lateral**
- Mobile: Sheet que sobe de **baixo** (`side="bottom"`) em vez de lateral — mais natural no iOS
- Desktop: Overlay lateral mantido, mas estilizado com glass

**FAB (Floating Action Button)**
- Removido do bottom bar como item e adicionado como botão central destacado no próprio bottom bar (não separado)

---

## Arquivos a Modificar

| Arquivo | O que muda |
|---|---|
| `src/index.css` | Novos tokens de design (radius, shadows, glass vars, markdown styles atualizadas) |
| `tailwind.config.ts` | Atualiza radius default |
| `src/pages/Index.tsx` | Remove header top, adiciona bottom bar flutuante, reorganiza layout |
| `src/components/notes/NoteList.tsx` | Banner de upgrade do Crown, estilo glass/moderno |
| `src/components/notes/NoteEditor.tsx` | Remove header interno pesado, estilo mais limpo |
| `src/pages/Settings.tsx` | Adiciona ThemeToggle na seção de preferências, estilo moderno |
| `src/pages/Auth.tsx` | Card com glass, bordas arredondadas |
| `src/pages/Pricing.tsx` | Atualiza estilo dos cards |

---

## Bottom Bar — Detalhe de Simetria

```text
[ ☰ ]  [ ✏ ]  [  ➕  ]  [ ⬡ ]  [ ⚙ ]
  Menu  Editor  (grande)  Graph  Config
```
- Crown/Pricing: banner sutil no topo do menu lateral (Sheet), com gradiente púrpura e botão "Ver Planos"
- ThemeToggle: movido para Settings

---

## Swipe para Trocar de View
- `useSwipe` já existe — reutiliza com `edgeOnly: false` para swipe em qualquer lugar da área de conteúdo trocar entre Editor e Graph (swipe left → Graph, swipe right → Editor)

---

## O Que **Não** Muda
- Funcionalidade do grafo, editor, tags, auth
- Paleta de cores (apenas geometria e camadas mudam)
- Suporte ao tema escuro
