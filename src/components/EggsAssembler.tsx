import React, { useState } from "react";

const EGG_TYPES = [
  "Ovo de Colher",
  "Ovo Simples",
  "Ovo Trufado",
  "Ovo de Pote",
  "Mini Ovos",
];

export default function EggsAssembler() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {!selectedType ? (
        <div>
          <h3 style={{ color: "#2d1e17", marginTop: 0 }}>
            1. Escolha o tipo de ovo
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {EGG_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: "1rem",
                  backgroundColor: "#f8f4e6",
                  border: "1px solid #e2b05b",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#2d1e17",
                  textAlign: "left",
                  fontSize: "1rem",
                }}
              >
                🍫 {type}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid #eee",
            }}
          >
            <h3 style={{ color: "#2d1e17", margin: 0 }}>
              Montando: {selectedType}
            </h3>
            <button
              onClick={() => setSelectedType(null)}
              style={{
                background: "none",
                border: "none",
                color: "#e2b05b",
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Trocar tipo
            </button>
          </div>
          <p style={{ color: "#555" }}>
            Em breve: opções de tamanho, casca e recheio específicas para
            <strong> {selectedType}</strong>...
          </p>
        </div>
      )}
    </div>
  );
}
