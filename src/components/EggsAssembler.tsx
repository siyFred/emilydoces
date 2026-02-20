import React, { useState } from "react";

import { addItemToCart } from "../store/cartStore.ts";

const EGG_TYPES = [
  "Ovo de Colher",
  "Ovo Simples",
  "Ovo Trufado",
  "Ovo de Pote",
  "Mini Ovos",
];

const SUBTYPES: Record<string, string[]> = {
  "Ovo de Colher": [
    "Ovo de Colher Simples",
    "Ovo de Colher Especial",
    "Ovo de Colher de Guloseimas",
    "Ovo de Colher de Brownie",
  ],
  "Ovo Trufado": ["Ovo Trufado de Uma Banda", "Ovo Trufado de Duas Bandas"],
};

const SIZES_BY_TYPE: Record<string, string[]> = {
  "Ovo de Colher Simples": ["250g", "350g"],
  "Ovo de Colher Especial": ["250g", "350g"],
  "Ovo de Colher de Guloseimas": ["250g", "350g"],
  "Ovo de Colher de Brownie": ["250g", "350g"],
  "Ovo Simples": ["250g", "350g"],
  "Ovo Trufado de Uma Banda": ["250g", "350g"],
  "Ovo Trufado de Duas Bandas": ["250g", "350g"],
  "Ovo de Pote": ["250g", "350g"],
  "Mini Ovos": ["Caixa com 2 unidades", "Caixa com 4 unidades"],
};

const PRICES: Record<string, Record<string, number>> = {
  "Ovo de Colher Simples": { "250g": 62.0, "350g": 72.0 },
  "Ovo de Colher Especial": { "250g": 68.0, "350g": 78.0 },
  "Ovo de Colher de Guloseimas": { "250g": 70.0, "350g": 80.0 },
  "Ovo de Colher de Brownie": { "250g": 78.0, "350g": 90.0 },
  "Ovo Simples": { "250g": 40.0, "350g": 50.0 },
  "Ovo Trufado de Uma Banda": { "250g": 37.0, "350g": 47.0 },
  "Ovo Trufado de Duas Bandas": { "250g": 68.0, "350g": 78.0 },
  "Ovo de Pote": { "250g": 85.0, "350g": 98.5 },
  "Mini Ovos": { "Caixa com 2 unidades": 20.0, "Caixa com 4 unidades": 40.0 },
};

const ASSEMBLER_RULES: Record<
  string,
  { cascas: number; recheios: number; acompanhamentos: number }
> = {
  "Ovo de Colher Simples": { cascas: 1, recheios: 1, acompanhamentos: 1 },
  "Ovo de Colher Especial": { cascas: 1, recheios: 2, acompanhamentos: 2 },
  "Ovo de Colher de Guloseimas": { cascas: 1, recheios: 2, acompanhamentos: 0 },
  "Ovo de Colher de Brownie": { cascas: 0, recheios: 2, acompanhamentos: 2 },
  "Ovo Simples": { cascas: 2, recheios: 0, acompanhamentos: 0 },
  "Ovo Trufado de Uma Banda": { cascas: 1, recheios: 1, acompanhamentos: 0 },
  "Ovo Trufado de Duas Bandas": { cascas: 2, recheios: 2, acompanhamentos: 0 },
  "Ovo de Pote": { cascas: 1, recheios: 2, acompanhamentos: 3 },
  "Caixa com 2 unidades": { cascas: 2, recheios: 2, acompanhamentos: 2 },
  "Caixa com 4 unidades": { cascas: 4, recheios: 4, acompanhamentos: 4 },
};

const EGGSHELL_OPT = [
  "Chocolate ao Leite",
  "Chocolate Branco",
  "Chocolate Meio Amargo",
  "Chocolate ao Leite com Oreo",
  "Chocolate Branco com Oreo",
  "Chocolate ao Leite com Disquete",
  "Chocolate Branco com Disquete",
  "Chocolate ao Leite com Amendoim",
  "Chocolate Meio Amargo com Amendoim",
];

const MINI_EGGSHELL_OPT = [
  "Chocolate ao Leite",
  "Chocolate Branco",
  "Chocolate Meio Amargo",
];

const FILLING_OPT = [
  "Chocolate",
  "Chocolate Branco",
  "Amendoim",
  "Leite Ninho",
  "Paçoca",
  "Oreo",
  "Beijinho",
  "Maracujá",
  "Limão",
];

const TOPPING_OPT = [
  "Brigadeiro de Chocolate",
  "Brigadeiro de Leite Ninho",
  "Beijinho",
  "KitKat",
  "Bis",
  "Paçoca",
  "Brownie",
  "Oreo",
  "Disquete",
  "Amendoim",
  "Jujuba",
];

const ADDITIONALS = [
  "Morango",
  "Nutella",
  "Kinder Bueno",
  "Uva",
  "Ferrero Rocher",
];

export default function EggsAssembler() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [shells, setShells] = useState<string[]>([]);
  const [fillings, setFillings] = useState<string[]>([]);
  const [toppings, setToppings] = useState<string[]>([]);

  const [stepIndex, setStepIndex] = useState(0);

  const resetAll = () => {
    setSelectedType(null);
    setSelectedSubtype(null);
    setSelectedSize(null);
    setShells([]);
    setFillings([]);
    setToppings([]);
    setStepIndex(0);
  };

  const getRequiredSteps = () => {
    const steps = ["type"];
    if (!selectedType) return steps;

    if (SUBTYPES[selectedType]) steps.push("subtype");

    const sizeKey = selectedSubtype || selectedType;
    if (SIZES_BY_TYPE[sizeKey]) steps.push("size");

    const currentVariation =
      selectedSubtype ||
      (selectedType === "Mini Ovos" ? selectedSize : selectedType);
    const rules = currentVariation ? ASSEMBLER_RULES[currentVariation] : null;

    if (rules) {
      if (rules.cascas > 0) steps.push("shells");
      if (rules.recheios > 0) steps.push("fillings");
      if (rules.acompanhamentos > 0) steps.push("toppings");
      steps.push("finish");
    }
    return steps;
  };

  const stepsArray = getRequiredSteps();
  const currentStepName = stepsArray[stepIndex] || "type";

  const activeVariation =
    selectedSubtype ||
    (selectedType === "Mini Ovos" ? selectedSize : selectedType);
  const activeRules = activeVariation ? ASSEMBLER_RULES[activeVariation] : null;

  const handleSelectType = (type: string) => {
    if (type !== selectedType) {
      setSelectedSubtype(null);
      setSelectedSize(null);
      setShells([]);
      setFillings([]);
      setToppings([]);
    }
    setSelectedType(type);
    setStepIndex(stepIndex + 1);
  };

  const handleSelectSubtype = (sub: string) => {
    if (sub !== selectedSubtype) {
      setSelectedSize(null);
      setShells([]);
      setFillings([]);
      setToppings([]);
    }
    setSelectedSubtype(sub);
    setStepIndex(stepIndex + 1);
  };

  const handleSelectSize = (size: string) => {
    if (size !== selectedSize) {
      setShells([]);
      setFillings([]);
      setToppings([]);
    }
    setSelectedSize(size);
    setStepIndex(stepIndex + 1);
  };

  const handleToggleItem = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    maxLimit: number,
    currStep: string,
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else if (list.length < maxLimit) {
      setList([...list, item]);
    } else {
      alert(
        `Você só pode escolher ${maxLimit} ${currStep}${maxLimit > 1 ? "s" : ""}.`,
      );
    }
  };

  const currentShellOptions =
    selectedType === "Mini Ovos" ? MINI_EGGSHELL_OPT : EGGSHELL_OPT;

  const currentKey = selectedSubtype || selectedType;
  let currentPrice = 0;

  if (
    currentKey &&
    selectedSize &&
    PRICES[currentKey] &&
    PRICES[currentKey][selectedSize]
  ) {
    currentPrice = PRICES[currentKey][selectedSize];
  }

  const formattedCurrentPrice = currentPrice.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleAddToCart = () => {
    const productName = `${selectedSubtype || selectedType} ${selectedSize ? `(${selectedSize})` : ""}`;

    const details = [
      shells.length > 0 ? `Cascas: ${shells.join(", ")}` : null,
      fillings.length > 0 ? `Recheios: ${fillings.join(", ")}` : null,
      toppings.length > 0 ? `Acompanhamentos: ${toppings.join(", ")}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    addItemToCart({
      type: productName,
      description: details,
      price: formattedCurrentPrice,
    });

    alert("🎉 Ovo adicionado ao carrinho com sucesso!");
    resetAll();
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {stepIndex > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            borderBottom: "1px solid #eee",
            paddingBottom: "1rem",
          }}
        >
          <div style={{ width: "80px" }}>
            {stepIndex > 0 && currentStepName !== "finish" && (
              <button
                onClick={() => setStepIndex(stepIndex - 1)}
                style={navBtnStyle}
              >
                ⬅ Voltar
              </button>
            )}
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            {selectedType && currentStepName !== "finish" && (
              <div>
                <h4 style={{ margin: 0, color: "#2d1e17", fontSize: "1.1rem" }}>
                  {selectedSubtype || selectedType}{" "}
                  {selectedSize ? `(${selectedSize})` : ""}
                </h4>
                {formattedCurrentPrice && (
                  <div
                    style={{
                      color: "#2d1e17",
                      fontWeight: "bold",
                      fontSize: "0.95rem",
                      marginTop: "4px",
                    }}
                  >
                    {formattedCurrentPrice}
                  </div>
                )}
                {activeVariation === "Ovo de Colher de Brownie" && (
                  <span
                    style={{
                      color: "#e2b05b",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    A casca já é de Brownie!
                  </span>
                )}
              </div>
            )}
          </div>

          <div style={{ width: "80px", textAlign: "right" }}>
            {stepIndex > 0 && currentStepName !== "finish" && (
              <button
                onClick={resetAll}
                style={{
                  ...navBtnStyle,
                  textDecoration: "underline",
                  color: "#e2b05b",
                }}
              >
                Recomeçar
              </button>
            )}
          </div>
        </div>
      )}

      {currentStepName === "type" && (
        <div>
          <h3 style={titleStyle}>Escolha o tipo de ovo:</h3>
          <div style={gridStyle}>
            {EGG_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleSelectType(type)}
                style={btnStyleLight}
              >
                🍫 {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStepName === "subtype" && (
        <div>
          <h3 style={titleStyle}>Escolha o estilo:</h3>
          <div style={gridStyle}>
            {SUBTYPES[selectedType!].map((sub) => (
              <button
                key={sub}
                onClick={() => handleSelectSubtype(sub)}
                style={btnStyleLight}
              >
                🥄 {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStepName === "size" && (
        <div>
          <h3 style={titleStyle}>Escolha o tamanho:</h3>
          <div style={gridStyle}>
            {SIZES_BY_TYPE[selectedSubtype || selectedType!]?.map((size) => {
              const priceForThisSize =
                PRICES[selectedSubtype || selectedType!]?.[size];
              const priceString = priceForThisSize
                ? ` - ${priceForThisSize.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`
                : "";

              return (
                <button
                  key={size}
                  onClick={() => handleSelectSize(size)}
                  style={btnStyleLight}
                >
                  📏 {size}{" "}
                  <span style={{ fontWeight: "normal", color: "#666" }}>
                    {priceString}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {currentStepName === "shells" && activeRules && (
        <div>
          <h3 style={titleStyle}>
            Escolha até {activeRules.cascas} casca
            {activeRules.cascas > 1 ? "s" : ""}:
          </h3>
          <p style={subtitleStyle}>
            Selecionadas: {shells.length} de {activeRules.cascas}
          </p>
          <div style={gridStyle}>
            {currentShellOptions.map((opt) => (
              <button
                key={opt}
                onClick={() =>
                  handleToggleItem(
                    opt,
                    shells,
                    setShells,
                    activeRules.cascas,
                    "casca",
                  )
                }
                style={shells.includes(opt) ? btnStyleSelected : btnStyleLight}
              >
                🥚 {opt}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStepIndex(stepIndex + 1)}
            disabled={shells.length === 0}
            style={{
              ...continueBtnStyle,
              opacity: shells.length > 0 ? 1 : 0.5,
              cursor: shells.length > 0 ? "pointer" : "not-allowed",
            }}
          >
            Continuar ➔
          </button>
        </div>
      )}

      {currentStepName === "fillings" && activeRules && (
        <div>
          <h3 style={titleStyle}>
            Escolha até {activeRules.recheios} recheio
            {activeRules.recheios > 1 ? "s" : ""}:
          </h3>
          <p style={subtitleStyle}>
            Selecionados: {fillings.length} de {activeRules.recheios}
          </p>
          <div style={gridStyle}>
            {FILLING_OPT.map((opt) => (
              <button
                key={opt}
                onClick={() =>
                  handleToggleItem(
                    opt,
                    fillings,
                    setFillings,
                    activeRules.recheios,
                    "recheio",
                  )
                }
                style={
                  fillings.includes(opt) ? btnStyleSelected : btnStyleLight
                }
              >
                🍯 {opt}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStepIndex(stepIndex + 1)}
            disabled={fillings.length === 0}
            style={{
              ...continueBtnStyle,
              opacity: fillings.length > 0 ? 1 : 0.5,
              cursor: fillings.length > 0 ? "pointer" : "not-allowed",
            }}
          >
            Continuar ➔
          </button>
        </div>
      )}

      {currentStepName === "toppings" && activeRules && (
        <div>
          <h3 style={titleStyle}>
            Escolha até {activeRules.acompanhamentos} acompanhamento
            {activeRules.acompanhamentos > 1 ? "s" : ""}:
          </h3>
          <p style={subtitleStyle}>
            Selecionados: {toppings.length} de {activeRules.acompanhamentos}
          </p>
          <div style={gridStyle}>
            {TOPPING_OPT.map((opt) => (
              <button
                key={opt}
                onClick={() =>
                  handleToggleItem(
                    opt,
                    toppings,
                    setToppings,
                    activeRules.acompanhamentos,
                    "acompanhamento",
                  )
                }
                style={
                  toppings.includes(opt) ? btnStyleSelected : btnStyleLight
                }
              >
                🍓 {opt}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStepIndex(stepIndex + 1)}
            disabled={toppings.length === 0}
            style={{
              ...continueBtnStyle,
              opacity: toppings.length > 0 ? 1 : 0.5,
              cursor: toppings.length > 0 ? "pointer" : "not-allowed",
            }}
          >
            Finalizar Montagem ➔
          </button>
        </div>
      )}

      {currentStepName === "finish" && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem 0",
            backgroundColor: "#f8f4e6",
            borderRadius: "8px",
            marginTop: "1rem",
          }}
        >
          <h3 style={{ color: "#2d1e17", margin: "0 0 1rem 0" }}>
            ✨ Ovo Montado com Sucesso! ✨
          </h3>
          <button
            onClick={handleAddToCart}
            style={{
              padding: "1rem 2rem",
              backgroundColor: "#e2b05b",
              color: "#2d1e17",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            Adicionar ao Carrinho • {formattedCurrentPrice}
          </button>
        </div>
      )}
    </div>
  );
}

const gridStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "0.5rem",
};
const titleStyle = { color: "#2d1e17", marginTop: 0, marginBottom: "0.5rem" };
const subtitleStyle = {
  fontSize: "0.85rem",
  color: "#666",
  marginTop: 0,
  marginBottom: "1rem",
};

const btnStyleLight = {
  padding: "1rem",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#333",
  textAlign: "left" as const,
  transition: "0.2s",
};
const btnStyleSelected = {
  padding: "1rem",
  backgroundColor: "#e2b05b",
  border: "2px solid #2d1e17",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#2d1e17",
  textAlign: "left" as const,
  transition: "0.2s",
};
const navBtnStyle = {
  background: "none",
  border: "none",
  color: "#666",
  cursor: "pointer",
  fontWeight: "bold",
  padding: 0,
};
const continueBtnStyle = {
  width: "100%",
  padding: "1rem",
  backgroundColor: "#e2b05b",
  color: "#2d1e17",
  border: "none",
  borderRadius: "5px",
  fontWeight: "bold",
  fontSize: "1.1rem",
  marginTop: "1.5rem",
  transition: "opacity 0.2s",
};
