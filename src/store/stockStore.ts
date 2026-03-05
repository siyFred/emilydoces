import { atom } from "nanostores";

// null = estoque não controlado (ilimitado), number = quantidade disponível
export type StockMap = Record<string, number | null>;

export const STOCK_ITEMS = {
  "Miniaturas Pokémon": [
    "Miniatura do Pikachu",
    "Miniatura do Mega Charizard X",
    "Miniatura do Mega Blastoise",
    "Miniatura do Mega Venusaur",
    "Miniatura do Charizard",
    "Miniatura do Mewtwo",
    "Miniatura do Scorbunny",
    "Miniatura do Dracovish",
    "Miniatura do Zarude",
    "Miniatura do Greninja",
    "Miniatura do Zeraora",
    "Miniatura do Drizzile",
  ],
  "Miniaturas Divertida Mente": [
    "Miniatura da Alegria",
    "Miniatura da Ansiedade",
    "Miniatura da Inveja",
    "Miniatura do Medo",
    "Miniatura do Nojinho",
    "Miniatura da Raiva",
    "Miniatura do Tédio",
    "Miniatura da Tristeza",
    "Miniatura da Vergonha",
  ],
  "Pelúcias Pokémon": [
    "Pelúcia do Pikachu",
    "Pelúcia do Lapras",
  ],
  "Pelúcias Lilo & Stitch": [
    "Pelúcia do Stitch Azul",
    "Pelúcia do Stitch Rosa",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Dicionário de itens esgotados por padrão.
// Altere aqui para marcar/desmarcar itens como esgotados.
// O painel admin ainda pode sobrescrever via localStorage.
// ─────────────────────────────────────────────────────────────────────────────
export const SOLD_OUT: Record<string, boolean> = {
  // Miniaturas Divertida Mente
  "Miniatura da Alegria": true,

  // Miniaturas Pokémon
  // "Miniatura do Pikachu": true,
  "Miniatura do Mega Venusaur": true,

  // Pelúcias Pokémon
  // "Pelúcia do Lapras": true,

  // Pelúcias Lilo & Stitch
  "Pelúcia do Stitch Rosa": true,
};

const ALL_ITEMS = Object.values(STOCK_ITEMS).flat();

const DEFAULT_STOCK: StockMap = Object.fromEntries(
  ALL_ITEMS.map((item) => [item, SOLD_OUT[item] ? 0 : null])
);

export const stockStore = atom<StockMap>(DEFAULT_STOCK);

if (typeof window !== "undefined") {
  const saved = localStorage.getItem("stock_emily_doces");
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as StockMap;
      // merge: keep defaults for any new items added later.
      // For items in SOLD_OUT, only override if the admin explicitly restocked
      // (value > 0). A saved null means "was available before" — ignore it so
      // the new SOLD_OUT entry takes effect.
      const merged: StockMap = { ...DEFAULT_STOCK };
      for (const key of Object.keys(parsed)) {
        if (SOLD_OUT[key] && (parsed[key] === null || parsed[key] === undefined)) {
          // keep the SOLD_OUT default (0)
        } else {
          merged[key] = parsed[key];
        }
      }
      stockStore.set(merged);
    } catch {
      stockStore.set(DEFAULT_STOCK);
    }
  }
  stockStore.listen((value) => {
    localStorage.setItem("stock_emily_doces", JSON.stringify(value));
  });
}

export function setItemStock(item: string, value: number | null) {
  stockStore.set({ ...stockStore.get(), [item]: value });
}

export function isOutOfStock(item: string): boolean {
  const stock = stockStore.get()[item];
  return stock !== null && stock !== undefined && stock <= 0;
}
