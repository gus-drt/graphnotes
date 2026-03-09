

## Problema

Os wrappers do Editor e do Graph usam `absolute inset-0`, que ignora o `paddingBottom` do `<main>` — eles se estendem até o fundo da tela, ficando atrás da bottom bar. Além disso, o texto de stats ("X notas • Y conexões") abaixo da bottom bar empurra conteúdo para fora da área visível.

## Solução

**`src/pages/Index.tsx`:**

1. Trocar `absolute inset-0` dos wrappers do Editor e Graph por `absolute inset-x-0 top-0 bottom-[calc(5rem+env(safe-area-inset-bottom,0px))]` — assim respeitam o espaço da bottom bar.
2. Remover o `paddingBottom` inline do `<main>` (não é mais necessário, os filhos absolutos já param antes da bar).
3. Mover o texto de stats para **dentro** da bottom bar (abaixo dos botões, dentro do container glass), em vez de fora — evita sobreposição e flutuação solta.

