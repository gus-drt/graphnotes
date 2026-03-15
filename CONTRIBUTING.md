# Contribuindo para o Graph Notes

Agradecemos o seu interesse em contribuir para o **Graph Notes**! Toda ajuda é muito bem-vinda para tornar este projeto um referencial de "second brain" de código aberto.

Abaixo estão algumas diretrizes para ajudar a manter o processo de contribuição amigável e organizado.

## Como Contribuir

### 1. Encontrando Tarefas

- Verifique as [Issues](https://github.com/gus-drt/graphnotes/issues) abertas caso queira pegar uma tarefa já mapeada.
- Se encontrou um bug ou tem uma ideia para uma nova feature (ex: novos layouts de grafo, integrações), abra uma Issue primeiro para conversarmos sobre a implementação!

### 2. Ambiente de Desenvolvimento

1. Faça o **fork** do repositório.
2. Clone seu fork: `git clone https://github.com/seu-usuario/graphnotes.git`
3. Instale as dependências: `npm install`
4. Crie uma branch para a sua feature/correção: `git checkout -b feature/minha-feature` ou `git checkout -b fix/meu-bug-fix`.
5. Configure suas variáveis de ambiente copiando o arquivo `.env.example` para `.env` e preenchendo os dados do Supabase.

### 3. Padrões de Código

- O projeto utiliza **React + TypeScript**. Tente tipar corretamente suas variáveis e funções.
- Utilizamos **Tailwind CSS** para estilização.
- Mantenha a interface gráfica seguindo a linguagem visual atual (Glassmorphism e paleta de cores neutras/primárias).

### 4. Rodando os Testes (Importante! ✅)

Nós temos testes unitários cobrindo o comportamento Offline-First (IndexedDB), fila de sincronização (SyncQueue) e o controle de assinaturas.

**Antes de abrir um Pull Request (PR) ou realizar commits, certifique-se de que todos os testes estão passando:**

```bash
npm run test
```

Também certifique-se de que não há erros de tipagem no TypeScript ou de linting. Opcionalmente, rande um `npm run build` para checar.

### 5. Enviando seu Pull Request (PR)

1. Commite suas alterações com mensagens claras e descritivas (se possível, usando [Conventional Commits](https://www.conventionalcommits.org/)).
2. Faça o push para o seu branch no GitHub: `git push origin minha-feature`.
3. Abra um **Pull Request** para a branch `main` do repositório original.
4. Na descrição do PR, explique **o que** foi mudado e **por que** foi mudado. Referencie o ID da Issue (se houver), ex: `Resolve #12`.

## Precisando de Ajuda?

Fique à vontade para perguntar nas Issues. Estamos sempre abertos a ajudar novos mantenedores!

Muito obrigado por ajudar a construir um software livre e acessível! 🚀
