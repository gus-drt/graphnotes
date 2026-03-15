

## Problema

Dois erros simultâneos:

1. **Build error nas Edge Functions**: As 3 funções (`check-subscription`, `customer-portal`, `create-checkout`) usam `import { createClient } from "npm:@supabase/supabase-js@2.57.2"` — o Deno no ambiente Lovable não resolve imports `npm:`. Precisa usar `https://esm.sh/@supabase/supabase-js@2`.

2. **"supabaseUrl is required"**: O site fica em branco porque o build falha por causa do erro acima, resultando em assets corrompidos/incompletos.

## Correção

Trocar o import em 3 arquivos:

- `supabase/functions/check-subscription/index.ts` linha 3
- `supabase/functions/customer-portal/index.ts` linha 3
- `supabase/functions/create-checkout/index.ts` linha 3

De:
```ts
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
```
Para:
```ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
```

Isso é consistente com o padrão já usado em `delete-account/index.ts`.

