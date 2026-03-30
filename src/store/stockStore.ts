// Para marcar um item como esgotado, adicione-o aqui com o valor true.
// Para reativar, remova a linha ou mude para false.

export const SOLD_OUT: Record<string, boolean> = {
  // Miniaturas Divertida Mente
  "Miniatura da Alegria": true,

  // Miniaturas Pokémon
  // "Miniatura do Pikachu": true,
  "Miniatura do Mega Venusaur": true,

  // Pelúcias Pokémon
  // "Pelúcia do Lapras": true,
  "Pelúcia do Pikachu": true,

  // Pelúcias Lilo & Stitch
  "Pelúcia do Stitch Azul": true,
  "Pelúcia do Stitch Rosa": true,
};

export function isOutOfStock(item: string): boolean {
  return SOLD_OUT[item] === true;
}
