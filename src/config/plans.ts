export const PLANS = {
  free: {
    name: "Free",
    price_id: null,
    product_id: "prod_U1ITaq6uoII6qA",
    price: 0,
    description: "Para começar a organizar suas ideias",
    features: [
      "Até 50 notas",
      "Links bidirecionais",
      "Visualização em grafo",
      "Editor Markdown",
      "Tema claro/escuro",
    ],
  },
  pro: {
    name: "Pro",
    price_id: "price_1T3FtG0oTn5cxpDdR6xyNebF",
    product_id: "prod_U1IU07lGAPydEy",
    price: 19.9,
    description: "Sem limites para o seu segundo cérebro",
    features: [
      "Notas ilimitadas",
      "Links bidirecionais",
      "Visualização em grafo",
      "Editor Markdown",
      "Tema claro/escuro",
      "Suporte prioritário",
    ],
  },
  ai_plus: {
    name: "AI Plus",
    price_id: "price_1T3FtZ0oTn5cxpDdbKH7hiMf",
    product_id: "prod_U1IUKHlKIceiVy",
    price: 39.9,
    description: "O poder da IA no seu grafo de notas",
    features: [
      "Tudo do plano Pro",
      "Sugestões de conexões com IA",
      "Resumo automático de notas",
      "Busca semântica",
      "Geração de conteúdo",
    ],
    comingSoon: true,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanByProductId(productId: string | null): PlanKey {
  if (!productId) return "free";
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.product_id === productId) return key as PlanKey;
  }
  return "free";
}
