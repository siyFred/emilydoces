import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import { stockStore, STOCK_ITEMS, setItemStock } from "../store/stockStore.ts";

const CORRECT_PASSWORD = "Evoluir22";

const ITEM_IMAGES: Record<string, string> = {
  "Miniatura do Pikachu": "/miniaturas/pokemon/pikachu.png",
  "Miniatura do Mega Charizard X": "/miniaturas/pokemon/mega_charizard_x.png",
  "Miniatura do Mega Blastoise": "/miniaturas/pokemon/mega_blastoise.png",
  "Miniatura do Mega Venusaur": "/miniaturas/pokemon/mega_venusaur.png",
  "Miniatura do Charizard": "/miniaturas/pokemon/charizard.png",
  "Miniatura do Mewtwo": "/miniaturas/pokemon/mewtwo.png",
  "Miniatura do Scorbunny": "/miniaturas/pokemon/scorbunny.png",
  "Miniatura do Dracovish": "/miniaturas/pokemon/dracovish.png",
  "Miniatura do Zarude": "/miniaturas/pokemon/zarude.png",
  "Miniatura do Greninja": "/miniaturas/pokemon/greninja.png",
  "Miniatura do Zeraora": "/miniaturas/pokemon/zeraora.png",
  "Miniatura do Drizzile": "/miniaturas/pokemon/drizzile.png",
  "Miniatura da Alegria": "/miniaturas/divertida_mente/alegria.png",
  "Miniatura da Ansiedade": "/miniaturas/divertida_mente/ansiedade.png",
  "Miniatura da Inveja": "/miniaturas/divertida_mente/inveja.png",
  "Miniatura do Medo": "/miniaturas/divertida_mente/medo.png",
  "Miniatura do Nojinho": "/miniaturas/divertida_mente/nojinho.png",
  "Miniatura da Raiva": "/miniaturas/divertida_mente/raiva.png",
  "Miniatura do Tédio": "/miniaturas/divertida_mente/tedio.png",
  "Miniatura da Tristeza": "/miniaturas/divertida_mente/tristeza.png",
  "Miniatura da Vergonha": "/miniaturas/divertida_mente/vergonha.png",
  "Pelúcia do Pikachu": "/pelucias/pokemon/pikachu.png",
  "Pelúcia do Lapras": "/pelucias/pokemon/lapras.png",
  "Pelúcia do Stitch Azul": "/pelucias/stitch/stitch_azul.png",
  "Pelúcia do Stitch Rosa": "/pelucias/stitch/stitch_rosa.png",
};

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const stock = useStore(stockStore);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setLoggedIn(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (!loggedIn) {
    return (
      <div style={loginWrapStyle}>
        <div style={loginCardStyle}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span style={{ fontSize: "2.5rem" }}>🔒</span>
            <h2 style={{ color: "#2d1e17", margin: "0.5rem 0 0.25rem", fontSize: "1.4rem" }}>
              Área Administrativa
            </h2>
            <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>
              Emily Confeitaria
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              autoFocus
              style={{
                ...inputStyle,
                borderColor: error ? "#dc3545" : "#e8dfce",
                marginBottom: error ? "0.4rem" : "1.25rem",
              }}
            />
            {error && (
              <p style={{ color: "#dc3545", fontSize: "0.82rem", margin: "0 0 1rem", textAlign: "center" }}>
                Senha incorreta. Tente novamente.
              </p>
            )}
            <button type="submit" style={primaryBtnStyle}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalOutOfStock = Object.values(stock).filter((v) => v !== null && v <= 0).length;

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ color: "#2d1e17", margin: 0, fontSize: "1.5rem" }}>Gerenciar Estoque</h1>
          <p style={{ color: "#888", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
            {totalOutOfStock > 0
              ? `⚠️ ${totalOutOfStock} item(ns) esgotado(s)`
              : "✅ Todos os itens com estoque disponível"}
          </p>
        </div>
        <button
          onClick={() => setLoggedIn(false)}
          style={{ ...ghostBtnStyle }}
        >
          Sair
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "1.25rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#666" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#28a745", display: "inline-block" }} />
          Disponível
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#666" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#dc3545", display: "inline-block" }} />
          Esgotado
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#666" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ccc", display: "inline-block" }} />
          Ilimitado (não controlado)
        </div>
      </div>

      {/* Categories */}
      {Object.entries(STOCK_ITEMS).map(([category, items]) => (
        <div key={category} style={{ marginBottom: "2.5rem" }}>
          <h2 style={categoryTitleStyle}>{category}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {items.map((item) => (
              <StockCard
                key={item}
                item={item}
                imageSrc={ITEM_IMAGES[item]}
                stock={stock[item] ?? null}
                onChange={(val) => setItemStock(item, val)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StockCard({
  item,
  imageSrc,
  stock,
  onChange,
}: {
  item: string;
  imageSrc: string;
  stock: number | null;
  onChange: (val: number | null) => void;
}) {
  const isUnlimited = stock === null;
  const isOut = !isUnlimited && stock <= 0;

  const statusColor = isUnlimited ? "#ccc" : isOut ? "#dc3545" : "#28a745";
  const statusLabel = isUnlimited ? "Ilimitado" : isOut ? "Esgotado" : `${stock} un.`;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: `2px solid ${isOut ? "#f5c6cb" : "#f0ebe0"}`,
        borderRadius: "14px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.6rem",
        boxShadow: "0 2px 8px rgba(45,30,23,0.06)",
        opacity: isOut ? 0.75 : 1,
        transition: "opacity 0.2s",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative" }}>
        <img
          src={imageSrc}
          alt={item}
          style={{ width: "72px", height: "72px", objectFit: "contain", filter: isOut ? "grayscale(0.7)" : "none", transition: "filter 0.2s" }}
        />
        {isOut && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.6)", borderRadius: "8px",
            fontSize: "0.65rem", fontWeight: "800", color: "#dc3545", letterSpacing: "0.05em",
          }}>
            ESGOTADO
          </div>
        )}
      </div>

      {/* Name */}
      <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#2d1e17", textAlign: "center", lineHeight: 1.3 }}>
        {item}
      </span>

      {/* Status pill */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: statusColor, display: "inline-block", flexShrink: 0 }} />
        <span style={{ fontSize: "0.75rem", color: "#555", fontWeight: "600" }}>{statusLabel}</span>
      </div>

      {/* Controls */}
      {!isUnlimited && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <button
            onClick={() => onChange(Math.max(0, (stock ?? 0) - 1))}
            style={counterBtnStyle}
            disabled={(stock ?? 0) <= 0}
          >
            −
          </button>
          <input
            type="number"
            min={0}
            value={stock ?? 0}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              onChange(isNaN(v) || v < 0 ? 0 : v);
            }}
            style={{
              width: "48px",
              textAlign: "center",
              border: "1px solid #e8dfce",
              borderRadius: "8px",
              padding: "0.3rem 0.25rem",
              fontSize: "0.9rem",
              fontWeight: "700",
              color: "#2d1e17",
              fontFamily: "inherit",
              outline: "none",
            }}
          />
          <button
            onClick={() => onChange((stock ?? 0) + 1)}
            style={counterBtnStyle}
          >
            +
          </button>
        </div>
      )}

      {/* Toggle unlimited */}
      <button
        onClick={() => onChange(isUnlimited ? 10 : null)}
        style={{
          background: "none",
          border: `1px solid ${isUnlimited ? "#e2b05b" : "#e8dfce"}`,
          borderRadius: "20px",
          padding: "0.2rem 0.75rem",
          fontSize: "0.72rem",
          fontWeight: "700",
          color: isUnlimited ? "#b8895a" : "#999",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.15s",
        }}
      >
        {isUnlimited ? "✓ Ilimitado" : "Definir ilimitado"}
      </button>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const loginWrapStyle: React.CSSProperties = {
  minHeight: "80vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
};

const loginCardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "20px",
  padding: "2.5rem 2rem",
  width: "100%",
  maxWidth: "360px",
  boxShadow: "0 8px 32px rgba(45,30,23,0.1)",
  border: "1px solid #f0ebe0",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "50px",
  border: "1px solid #e8dfce",
  fontSize: "1rem",
  color: "#2d1e17",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  backgroundColor: "#faf8f4",
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.85rem",
  backgroundColor: "#e2b05b",
  color: "#2d1e17",
  border: "none",
  borderRadius: "50px",
  fontWeight: "800",
  fontSize: "1rem",
  cursor: "pointer",
  fontFamily: "inherit",
};

const ghostBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #e8dfce",
  borderRadius: "20px",
  padding: "0.4rem 1rem",
  fontSize: "0.82rem",
  fontWeight: "700",
  color: "#666",
  cursor: "pointer",
  fontFamily: "inherit",
};

const categoryTitleStyle: React.CSSProperties = {
  color: "#2d1e17",
  fontSize: "1rem",
  fontWeight: "800",
  margin: "0 0 0.75rem",
  paddingBottom: "0.5rem",
  borderBottom: "2px solid #e2b05b",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const counterBtnStyle: React.CSSProperties = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  border: "1px solid #e8dfce",
  backgroundColor: "#f8f4e6",
  color: "#2d1e17",
  fontWeight: "800",
  fontSize: "1rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "inherit",
  lineHeight: 1,
};
