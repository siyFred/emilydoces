import { atom } from "nanostores";

export type Item = {
  id: string;
  type: string;
  description: string;
  price: string;
};

export const cart = atom<Item[]>([]);
