import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { cart, remItemFromCart } from "../store/cartStore";

export default function CartButton() {
  const items = useStore(cart);
  const totalItems = items.length;
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [bumping, setBumping] = useState(false);
  const prevCount = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevCount.current) {
      setBumping(true);
      setTimeout(() => setBumping(false), 850);
    }
    prevCount.current = totalItems;
  }, [totalItems]);

  const closeCart = () => setIsOpen(false);

  const totalValue = items.reduce((acc, item) => {
    const clean = item.price.replace(/[^\d,-]/g, "").replace(",", ".");
    return acc + (parseFloat(clean) || 0);
  }, 0);
  const formattedTotal = totalValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleCheckout = () => {
    const whatsapp = import.meta.env.PUBLIC_WHATSAPP_NUMBER;

    let orderText =
      "Olá, Emily Doces! 🐰 Gostaria de finalizar o meu pedido:\n\n";

    if (customerName.trim()) {
      orderText += `*Nome:* ${customerName.trim()}\n\n`;
    }

    let totalValue = 0;

    items.forEach((item, index) => {
      const cleanPrice = item.price.replace(/[^\d,-]/g, "").replace(",", ".");
      totalValue += parseFloat(cleanPrice) || 0;

      orderText += `*${index + 1}. ${item.type}*\n`;
      orderText += `${item.description.split(" | ").join("\n")}\n`;
      orderText += `Valor: ${item.price}\n\n`;
    });

    const formattedTotalValue = totalValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    orderText += `*TOTAL DO PEDIDO: ${formattedTotalValue}*\n\n`;
    orderText += `Aguardo a confirmação e as formas de pagamento!`;

    const message = encodeURIComponent(orderText);
    const url = `https://wa.me/${whatsapp}?text=${message}`;

    window.open(url, "_blank");
  };

  return (
    <>
      <style>{`
        @keyframes cartBump {
          0%   { transform: scale(1) rotate(0deg); }
          20%  { transform: scale(1.28) rotate(-8deg); }
          45%  { transform: scale(1.2) rotate(6deg); }
          70%  { transform: scale(1.1) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
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
          color: totalItems === 0 ? "rgba(248,244,230,0.35)" : "#f8f4e6",
          transition: "color 0.2s",
        }}
        aria-label="Abrir carrinho"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            animation: bumping ? "cartBump 0.85s ease-in-out" : "none",
            transformOrigin: "center",
          }}
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>

        {totalItems > 0 && (
          <span
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              backgroundColor: "#f8f4e6",
              color: "#2d1e17",
              fontSize: "0.75rem",
              fontWeight: "bold",
              borderRadius: "50%",
              width: "14px",
              height: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #2d1e17",
            }}
          >
            {totalItems}
          </span>
        )}
      </button>

      <div
        onClick={closeCart}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
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
          height: "100dvh",
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
          <h3 style={{ margin: 0, color: "#f8f4e6" }}>
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
          {totalItems === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#999",
                marginTop: "3rem",
                fontSize: "0.95rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ccc"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: "block", margin: "0 auto 1rem" }}
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Seu carrinho está vazio.
            </div>
          )}
          {items.map((item) => (
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
            padding: "1.25rem 1.5rem",
            borderTop: "2px solid #e2b05b",
            backgroundColor: "#2d1e17",
          }}
        >
          {totalItems > 0 && (
            <>
              <input
                type="text"
                placeholder="Seu nome (opcional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 1rem",
                  borderRadius: "50px",
                  border: "1px solid rgba(248,244,230,0.2)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "#f8f4e6",
                  fontSize: "0.9rem",
                  outline: "none",
                  marginBottom: "0.85rem",
                  boxSizing: "border-box" as const,
                  fontFamily: "inherit",
                }}
              />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                color: "#f8f4e6",
                fontSize: "0.95rem",
              }}
            >
              <span style={{ fontWeight: "600" }}>Total</span>
              <span style={{ fontWeight: "800", fontSize: "1.1rem", color: "#e2b05b" }}>
                {formattedTotal}
              </span>
            </div>
            </>
          )}
          <button
            onClick={handleCheckout}
            disabled={totalItems === 0}
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "#e2b05b",
              color: "#2d1e17",
              border: "none",
              borderRadius: "50px",
              fontWeight: "800",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              letterSpacing: "0.02em",
              boxShadow: "0 4px 16px rgba(45, 30, 23, 0.3)",
              transition: "filter 0.2s, transform 0.15s",
              opacity: totalItems === 0 ? 0.4 : 1,
              cursor: totalItems === 0 ? "not-allowed" : "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.08)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 32 32"
              fill="currentColor"
            >
              <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.66 4.8 1.8 6.82L2 30l7.38-1.76A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5c-2.18 0-4.24-.6-6.02-1.64l-.43-.26-4.38 1.04 1.08-4.26-.28-.45A11.47 11.47 0 0 1 4.5 16C4.5 9.61 9.61 4.5 16 4.5S27.5 9.61 27.5 16 22.39 27.5 16 27.5zm6.3-8.56c-.34-.17-2.02-.99-2.33-1.1-.31-.12-.54-.17-.77.17-.23.34-.88 1.1-1.08 1.33-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.12-.23.06-.43-.03-.6-.08-.17-.77-1.85-1.05-2.54-.27-.66-.55-.57-.77-.58h-.66c-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.85s1.22 3.3 1.4 3.53c.17.23 2.4 3.66 5.82 5.13.81.35 1.45.56 1.94.72.82.26 1.56.22 2.15.13.65-.1 2.02-.83 2.3-1.62.29-.8.29-1.48.2-1.62-.08-.15-.31-.23-.65-.4z"/>
            </svg>
            Finalizar no WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}
