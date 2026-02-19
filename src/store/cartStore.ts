import { atom } from "nanostores";

export type Item = {
  id: string;
  type: string;
  description: string;
  price: string;
};

export const cart = atom<Item[]>([]);

if (typeof window !== "undefined") {
  const savedCart = localStorage.getItem("cart_emily_doces");
  if (savedCart) {
    cart.set(JSON.parse(savedCart));
  }
  cart.listen((value) => {
    localStorage.setItem("cart_emily_doces", JSON.stringify(value));
  });
}

export function addItemToCart(item: Omit<Item, "id">) {
  const newItem = {
    ...item,
    id: crypto.randomUUID(),
  };
  cart.set([...cart.get(), newItem]);
}

export function remItemFromCart(id: string) {
  cart.set(cart.get().filter((item) => item.id !== id));
}
