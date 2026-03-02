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

const ALL_ITEMS = Object.values(STOCK_ITEMS).flat();

const DEFAULT_STOCK: StockMap = Object.fromEntries(
  ALL_ITEMS.map((item) => [item, null])
);

export const stockStore = atom<StockMap>(DEFAULT_STOCK);

if (typeof window !== "undefined") {
  const saved = localStorage.getItem("stock_emily_doces");
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as StockMap;
      // merge: keep defaults for any new items added later
      stockStore.set({ ...DEFAULT_STOCK, ...parsed });
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
