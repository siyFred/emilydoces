import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import { cart, remItemFromCart } from "../store/cartStore";

export default function CartButton() {
  const itens = useStore(cart);
  const [isOpen, setIsOpen] = useState(false);
  const totalItems = itens.length;

  if (totalItems === 0) return null;

  const closeCart = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          position: "relative",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#e2b05b",
        }}
        aria-label="Abrir carrinho"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>

        <span
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            backgroundColor: "#e2b05b",
            color: "#2d1e17",
            fontSize: "0.75rem",
            fontWeight: "bold",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #2d1e17",
          }}
        >
          {totalItems}
        </span>
      </button>

      <div
        onClick={closeCart}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 998,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#f8f4e6",
          boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.5rem",
            borderBottom: "1px solid #e2b05b",
            backgroundColor: "#2d1e17",
          }}
        >
          <h3 style={{ margin: 0, color: "#e2b05b" }}>
            Seu Carrinho ({totalItems})
          </h3>
          <button
            onClick={closeCart}
            style={{
              background: "none",
              border: "none",
              color: "#e2b05b",
              cursor: "pointer",
              padding: "5px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {itens.map((item) => (
            <div
              key={item.id}
              style={{
                marginBottom: "1.5rem",
                borderBottom: "1px dashed #ccc",
                paddingBottom: "1rem",
              }}
            >
              <strong
                style={{
                  color: "#2d1e17",
                  fontSize: "1.1rem",
                  display: "block",
                }}
              >
                {item.type}
              </strong>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#666",
                  margin: "0.5rem 0",
                  lineHeight: "1.4",
                  whiteSpace: "pre-wrap",
                }}
              >
                {item.description.split(" | ").join("\n")}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "0.8rem",
                }}
              >
                <button
                  onClick={() => remItemFromCart(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#dc3545",
                    cursor: "pointer",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                  }}
                  aria-label="Remover item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Remover
                </button>
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#2d1e17",
                    fontWeight: "bold",
                  }}
                >
                  {item.price}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "1.5rem",
            borderTop: "1px solid #ccc",
            backgroundColor: "#fff",
          }}
        >
          <button
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "#2d1e17",
              color: "#e2b05b",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Finalizar no WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}
