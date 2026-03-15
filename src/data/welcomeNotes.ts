export const WELCOME_NOTES_DATA = [
  {
    title: 'Índice',
    content: `# Índice 🧠

Bem-vindo ao **Graph Notes** — seu segundo cérebro em forma de grafo!

Aqui suas ideias se conectam visualmente. Comece explorando as notas abaixo:

---

## 📚 Guias

- [[Como Usar o Graph Notes]]
- [[Formatação Markdown]]
- [[Tags e Organização]]

---

## 💡 Dicas

- Crie notas curtas e focadas em um único assunto
- Use \`[[nome da nota]]\` para conectar ideias
- Abra o **Grafo** no menu superior para ver todas as conexões
- Esta nota "Índice" sempre aparece no **centro do grafo**!

---

> Dica: fixe esta nota para acessá-la rapidamente! (Você pode fixar até **3 notas**)`,
    pinned: true,
  },
  {
    title: 'Como Usar o Graph Notes',
    content: `# Como Usar o Graph Notes 🚀

Voltar para o [[Índice]]

---

## Criando notas

- Clique em **"Nova Nota"** no painel lateral ou no botão **+**
- Cada nota tem um título e conteúdo em Markdown

## Conectando notas

O grande diferencial do Graph Notes é conectar ideias entre si!

Use a sintaxe \`[[nome da nota]]\` no conteúdo para criar um link. Por exemplo:

> Veja também: [[Tags e Organização]]

Se a nota ainda não existir, ela será criada automaticamente ao clicar no link.

## Navegação

- **Editor**: escreva e visualize suas notas com Markdown
- **Grafo**: veja todas as notas e conexões visualmente
- Clique em um nó no grafo para abrir a nota

## Fixar notas 📌

Você pode **fixar até 3 notas** no topo da lista para acesso rápido. Basta clicar no ícone de pin ao lado da nota.

## Sincronização e Nuvem ☁️

O Graph Notes é gratuito e **Open Source**! Você tem duas formas de usá-lo:

1. **Uso Padrão:** Suas primeiras **50 notas** são salvas na nuvem automaticamente e podem ser acessadas de qualquer dispositivo. Após 50 notas, elas são salvas **apenas localmente** (no seu navegador).
2. **Self-Hosting (Ilimitado):** Como o projeto é de código aberto, você pode fazer um fork no GitHub e conectar seu próprio banco de dados (Supabase) para ter armazenamento em nuvem 100% ilimitado e sob o seu controle!

Saiba mais no [Repositório Oficial no GitHub](https://github.com/gus-drt/graphnotes).

---

Veja também: [[Formatação Markdown]]`,
    pinned: false,
  },
  {
    title: 'Formatação Markdown',
    content: `# Formatação Markdown ✍️

Voltar para o [[Índice]]

---

O Graph Notes suporta Markdown para formatar suas notas. Aqui está tudo que você pode usar:

## Títulos

- \`# Título grande\`
- \`## Título médio\`
- \`### Título pequeno\`

## Texto

- \`**negrito**\` → **negrito**
- \`*itálico*\` → *itálico*
- \`***negrito e itálico***\` → ***negrito e itálico***
- \`~~riscado~~\` → ~~riscado~~
- \`\\\`código inline\\\`\` → \`código inline\`

## Listas

Lista com marcadores:
- \`- item 1\`
- \`- item 2\`

Lista numerada:
1. \`1. primeiro\`
2. \`2. segundo\`

## Outros

- \`---\` → Linha horizontal
- \`> texto\` → Citação (blockquote)
- \`[texto](url)\` → Link externo
- \`[[nome da nota]]\` → Link para outra nota

---

> Dica: alterne entre **Editar** e **Visualizar** para ver o resultado!

Veja também: [[Tags e Organização]]`,
    pinned: false,
  },
  {
    title: 'Tags e Organização',
    content: `# Tags e Organização 🏷️

Voltar para o [[Índice]]

---

## O que são Tags?

Tags são etiquetas coloridas que você adiciona às suas notas para categorizá-las. Diferente de pastas, uma nota pode ter **várias tags** ao mesmo tempo!

## Como usar

1. Abra uma nota no editor
2. Clique no seletor de tags abaixo do título
3. Escolha uma tag existente ou crie uma nova
4. Cada tag tem um **nome** e uma **cor** personalizável

## Boas práticas

- Use tags amplas como \`projeto\`, \`estudo\`, \`ideia\`, \`referência\`
- Evite criar tags muito específicas — links entre notas servem melhor para isso
- Use **cores diferentes** para distinguir categorias visualmente
- Tags aparecem na lista de notas, facilitando a identificação rápida

## Combinando Tags + Links

A combinação perfeita é:

- **Tags** para categorizar (ex: \`estudo\`, \`trabalho\`)
- **Links** \`[[nota]]\` para conectar ideias relacionadas
- **Fixar** as notas mais importantes (até 3!)

---

> Experimente: crie uma tag chamada "guia" e adicione a todas estas notas de boas-vindas!

Veja também: [[Como Usar o Graph Notes]] • [[Formatação Markdown]]`,
    pinned: false,
  },
];
