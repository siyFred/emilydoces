import React from "react";
import { useStore } from "@nanostores/react";
import { cart } from "../store/cartStore";

export default function CartButton() {
  const itens = useStore(cart);

  if (itens.length === 0) return null;

  return (
    <button style={{
      padding: '0.5rem 1rem',
      backgroundColor: '#e2b05b',
      color: '#2d1e17',
      border: 'none',
      borderRadius: '5px',
      fontWeight: 'bold',
      cursor: 'pointer'
    }}>
      🛒 Carrinho ({itens.length})
    </button>
  );
}
