import { describe, expect, it } from 'vitest';
import { toggleTaskCheckboxInMarkdown } from '@/lib/markdownTasks';

describe('toggleTaskCheckboxInMarkdown', () => {
  it('marca a tarefa correta pelo índice', () => {
    const content = ['- [ ] primeira', '- [ ] segunda', '- [x] terceira'].join('\n');
    const updated = toggleTaskCheckboxInMarkdown(content, 1, true);

    expect(updated).toBe(['- [ ] primeira', '- [x] segunda', '- [x] terceira'].join('\n'));
  });

  it('desmarca tarefa já concluída', () => {
    const content = '- [x] concluída';
    const updated = toggleTaskCheckboxInMarkdown(content, 0, false);

    expect(updated).toBe('- [ ] concluída');
  });

  it('não altera conteúdo com índice inválido', () => {
    const content = '- [ ] tarefa';
    const updated = toggleTaskCheckboxInMarkdown(content, 99, true);

    expect(updated).toBe(content);
  });

  it('funciona com listas ordenadas', () => {
    const content = ['1. [ ] passo 1', '2. [ ] passo 2'].join('\n');
    const updated = toggleTaskCheckboxInMarkdown(content, 0, true);

    expect(updated).toBe(['1. [x] passo 1', '2. [ ] passo 2'].join('\n'));
  });
});
