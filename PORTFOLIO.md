---
title: "Emily Doces Commerce: configurador de ovos de Páscoa com checkout no WhatsApp"
description: "Experiência de compra guiada que transforma personalização de produtos artesanais em pedidos fechados com alta conversão."
stack: ["Astro", "React", "TypeScript", "Nanostores", "Vercel"]
images: ["assets/capa.png"]
featured-skills: ["Arquitetura Frontend em Ilhas", "Modelagem de Regras de Produto", "Observabilidade Web"]
---

## Visão geral

A Emily Doces é uma vitrine de e-commerce sazonal com foco em **personalização de ovos de Páscoa**.  
O produto foi desenhado para reduzir fricção na escolha de combinações (casca, recheio, adicionais, acessórios) e converter isso em pedido real via WhatsApp.

## Objetivo de negócio

- Transformar catálogo artesanal em fluxo digital de compra guiada.
- Minimizar erro de pedido com regras explícitas por tipo de produto.
- Aumentar conversão mobile com checkout direto no canal já usado pelo cliente (WhatsApp).

## Arquitetura

### 1) Renderização orientada a performance (Astro + ilhas React)

O site usa Astro para renderização estática e SEO, com hidratação somente onde há interação intensa:

- `src/pages/*.astro`: páginas e estrutura.
- `src/components/EggsAssembler.tsx`: motor de customização.
- `src/components/CartButton.tsx`: carrinho e finalização.

Isso reduz JS inicial sem sacrificar experiência dinâmica.

### 2) Estado global simples e previsível (Nanostores + localStorage)

O carrinho é persistido no navegador para manter continuidade de sessão:

```ts
export const cart = atom<Item[]>([]);
cart.listen((value) => {
  localStorage.setItem("cart_emily_doces", JSON.stringify(value));
});
```

Essa abordagem evita backend para sessão e é suficiente para o domínio do problema (pedido curto, baixa concorrência, alto uso mobile).

### 3) Motor de regras de produto no frontend

A montagem é guiada por tabelas de configuração (`PRICES`, `SIZES_BY_TYPE`, `ASSEMBLER_RULES`) em vez de lógica espalhada por condicionais.

```ts
const ASSEMBLER_RULES = {
  "Ovo de Colher Especial": { cascas: 1, recheios: 2, acompanhamentos: 2 },
  "Ovo Trufado de Duas Bandas": { cascas: 2, recheios: 2, acompanhamentos: 0 },
};
```

Esse desenho facilita manutenção comercial (novas variações e preços) com baixo risco de regressão funcional.

### 4) Controle de disponibilidade em tempo de execução

Itens esgotados são centralizados em `stockStore.ts` e refletidos na UI com bloqueio de ação:

- Previne seleção inválida no momento da configuração.
- Mantém catálogo “vivo” sem refatorar o fluxo principal.

### 5) Checkout sem atrito com deep link

O pedido final é estruturado em texto e enviado via `wa.me`, incluindo:

- itens e customizações;
- forma de pagamento;
- cálculo de sinal (50%) e saldo.

Essa decisão elimina complexidade de gateway no MVP e aproveita o canal já operacional do negócio.

## Qualidade de engenharia

- **SEO e metadados sociais** no layout base (`og:*`, `twitter:*`, canonical).
- **Sitemap automático** via `@astrojs/sitemap`.
- **Observabilidade de produto** com Vercel Analytics e Speed Insights.
- **Organização por responsabilidade** (layout, páginas, componentes, stores).

## Resultado técnico

Um frontend orientado a conversão, com arquitetura pragmática: estático onde possível, reativo onde necessário, e regras de negócio explícitas para sustentar evolução de catálogo sem reescrever a experiência de compra.
