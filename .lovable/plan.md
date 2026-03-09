
Objetivo
- Corrigir definitivamente o bug do grafo “cortado/zoom errado” (mobile e desktop), inclusive cenários com cache/cookies antigos e mudanças de view/menu.

Diagnóstico (investigação feita)
1. Sintoma reproduzido em runtime: o canvas do grafo fica com área ~600x400 no canto, enquanto o restante da tela fica vazio.
2. Causa principal provável: o estado `dimensions` no `NoteGraph` começa em `{600, 400}` e depende do `ResizeObserver` para atualizar; em alguns ciclos de renderização/dispositivo isso não dispara no momento esperado.
3. Efeito colateral crítico: o código força `canvas.style.width/height = dimensions(px)`, então se `dimensions` travar em 600x400, o canvas permanece pequeno.
4. Causa secundária: `fitToView` pode rodar antes da medição real, deixando câmera/zoom inconsistentes.
5. Causa adicional de layout: offset inferior fixo (`5rem`) pode não refletir 100% da altura real da bottom bar em todos os devices/escala/fonte.

Plano de correção (implementação)
1. Tornar a medição do canvas robusta (não depender só de ResizeObserver)
- Arquivo: `src/components/notes/NoteGraph.tsx`
- Criar `measureCanvas()` usando `containerRef.current.getBoundingClientRect()`.
- Chamar `measureCanvas()` em:
  - `useLayoutEffect` no mount,
  - `requestAnimationFrame` após mount (1-2 frames),
  - `window.resize`, `orientationchange`,
  - `visualViewport.resize` (quando disponível),
  - ativação da view de grafo (via nova prop `isActive`),
  - abertura/fechamento do menu lateral (se impactar layout).
- Manter `ResizeObserver` como reforço, não como única fonte.

2. Evitar travamento visual por estilo inline em px
- Arquivo: `src/components/notes/NoteGraph.tsx`
- Remover `canvas.style.width = w + 'px'` e `canvas.style.height = h + 'px'` como fonte de verdade.
- Manter CSS (`w-full h-full`) para tamanho visual.
- Atualizar apenas `canvas.width`/`canvas.height` (bitmap HiDPI) com o tamanho medido real.

3. Recalibrar auto-fit no momento certo
- Arquivo: `src/components/notes/NoteGraph.tsx`
- Só executar `fitToView` depois da primeira medição válida (`width>0 && height>0`).
- Reexecutar auto-fit uma única vez quando houver salto grande de dimensão (ex.: troca de orientação), sem ficar “brigando” com zoom manual do usuário.

4. Sincronizar o espaço útil com a altura real da bottom bar
- Arquivo: `src/pages/Index.tsx`
- Medir altura real da barra inferior com `ref` + `ResizeObserver` e expor em CSS var (ex.: `--bottom-bar-offset`).
- Usar essa variável no `bottom` dos containers editor/grafo no lugar de valor fixo.
- Isso remove inconsistência entre “área do canvas” e “área ocupada pela barra”.

5. Passar estado de visibilidade para o grafo
- Arquivo: `src/pages/Index.tsx` + `src/components/notes/NoteGraph.tsx`
- Adicionar prop `isActive` no `NoteGraph` para forçar medição/reflow ao trocar Editor ↔ Grafo.
- Opcional: prop `layoutVersion` incrementada em eventos de layout relevantes (abrir menu, viewport change) para gatilho explícito de recalcular.

Validação (obrigatória)
1. Android (produção): abrir site “frio” e “quente” (sem limpar dados), confirmar que o grafo ocupa toda área útil.
2. Alternar Editor ↔ Grafo repetidamente (10x), sem perder escala/posição de forma errada.
3. Abrir/fechar menu lateral várias vezes e voltar ao grafo.
4. Rotacionar portrait ↔ landscape.
5. Desktop: abrir direto no grafo e após trocar views/menu.
6. Verificar que texto de stats/footer não sobrepõe a barra nem o conteúdo.

Arquivos que serão alterados
- `src/components/notes/NoteGraph.tsx` (correção principal de medição/render/câmera)
- `src/pages/Index.tsx` (offset dinâmico da bottom bar + prop `isActive`)

Detalhes técnicos
- Problema raiz: fallback inicial fixo (600x400) + medição assíncrona não confiável em todos os ciclos + estilo inline fixando tamanho errado.
- Estratégia: arquitetura “medição ativa + fallbacks”:
  - medição imediata (`getBoundingClientRect`)
  - observação contínua (`ResizeObserver`)
  - eventos globais (`resize`, `orientationchange`, `visualViewport`)
  - recalibração na ativação do grafo.
- Resultado esperado: canvas sempre sincronizado com o tamanho real do container, sem depender de limpar cookies/cache.
