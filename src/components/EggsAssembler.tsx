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

const ADDITIONALS_PRICES: Record<string, number> = {
  Morango: 10.0,
  Nutella: 10.0,
  "Kinder Bueno": 10.0,
  "Ferrero Rocher": 10.0,
  Uva: 6.0,
};

const ADDITIONAL_OPT = Object.keys(ADDITIONALS_PRICES);

export default function EggsAssembler() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [shells, setShells] = useState<string[]>([]);
  const [fillings, setFillings] = useState<string[]>([]);
  const [toppings, setToppings] = useState<string[]>([]);

  const [additionals, setAdditionals] = useState<string[]>([]);

  const [stepIndex, setStepIndex] = useState(0);
  const [shellSlot, setShellSlot] = useState(0);
  const [fillingSlot, setFillingSlot] = useState(0);
  const [toppingSlot, setToppingSlot] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [toastLeaving, setToastLeaving] = useState(false);

  const resetAll = () => {
    setSelectedType(null);
    setSelectedSubtype(null);
    setSelectedSize(null);
    setShells([]);
    setFillings([]);
    setToppings([]);
    setAdditionals([]);
    setStepIndex(0);
    setShellSlot(0);
    setFillingSlot(0);
    setToppingSlot(0);
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
      steps.push("additionals");
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
  };

  const handleSelectSubtype = (sub: string) => {
    if (sub !== selectedSubtype) {
      setSelectedSize(null);
      setShells([]);
      setFillings([]);
      setToppings([]);
    }
    setSelectedSubtype(sub);
  };

  const handleSelectSize = (size: string) => {
    if (size !== selectedSize) {
      setShells([]);
      setFillings([]);
      setToppings([]);
    }
    setSelectedSize(size);
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

  const extraPrice = additionals.reduce(
    (total, add) => total + (ADDITIONALS_PRICES[add] || 0),
    0,
  );

  currentPrice += extraPrice;

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
      additionals.length > 0
        ? `Adicionais Pagos: ${additionals.join(", ")}`
        : null,
    ]
      .filter(Boolean)
      .join(" | ");

    addItemToCart({
      type: productName,
      description: details,
      price: formattedCurrentPrice,
    });

    setToast("Ovo adicionado ao carrinho!");
    setToastLeaving(false);
    setTimeout(() => setToastLeaving(true), 2500);
    setTimeout(() => setToast(null), 3000);
    resetAll();
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        padding: "1.5rem",
        borderRadius: "24px",
        boxShadow: "0 4px 20px rgba(45, 30, 23, 0.08)",
        position: "relative",
      }}
    >
      {toast && (
        <>
          <style>{`
            @keyframes toastIn {
              from { opacity: 0; transform: translateX(-50%) translateY(2rem); }
              to   { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes toastOut {
              from { opacity: 1; transform: translateX(-50%) translateY(0); }
              to   { opacity: 0; transform: translateX(-50%) translateY(2rem); }
            }
          `}</style>
          <div
            style={{
              position: "fixed",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#2d1e17",
              color: "#f8f4e6",
              padding: "0.85rem 1.75rem",
              borderRadius: "50px",
              fontWeight: "700",
              fontSize: "0.95rem",
              boxShadow: "0 8px 32px rgba(45,30,23,0.4)",
              zIndex: 1000,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              border: "2px solid #e2b05b",
              animation: toastLeaving
                ? "toastOut 0.5s cubic-bezier(0.4, 0, 0.6, 1) forwards"
                : "toastIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            ✓ {toast}
          </div>
        </>
      )}
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
            {(stepIndex > 0 || (currentStepName === "shells" && shellSlot > 0) || (currentStepName === "fillings" && fillingSlot > 0) || (currentStepName === "toppings" && toppingSlot > 0)) && currentStepName !== "finish" && (
              <button
                onClick={() => {
                  if (currentStepName === "shells" && shellSlot > 0) {
                    setShellSlot(shellSlot - 1);
                  } else if (currentStepName === "fillings" && fillingSlot > 0) {
                    setFillingSlot(fillingSlot - 1);
                  } else if (currentStepName === "toppings" && toppingSlot > 0) {
                    setToppingSlot(toppingSlot - 1);
                  } else {
                    const prevStep = stepsArray[stepIndex - 1];
                    if (prevStep === "shells" && activeRules) setShellSlot(activeRules.cascas - 1);
                    if (prevStep === "fillings" && activeRules) setFillingSlot(activeRules.recheios - 1);
                    if (prevStep === "toppings" && activeRules) setToppingSlot(activeRules.acompanhamentos - 1);
                    setStepIndex(stepIndex - 1);
                  }
                }}
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
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#666",
                      margin: "4px 0 0",
                    }}
                  >
                    OBS.: A casca deste ovo já é de Brownie.
                  </p>
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
                style={selectedType === type ? btnStyleSelected : btnStyleLight}
              >
                {type}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStepIndex(stepIndex + 1)}
            disabled={!selectedType}
            style={{
              ...continueBtnStyle,
              opacity: selectedType ? 1 : 0.5,
              cursor: selectedType ? "pointer" : "not-allowed",
            }}
          >
            Continuar ➔
          </button>
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
                style={selectedSubtype === sub ? btnStyleSelected : btnStyleLight}
              >
                {sub}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStepIndex(stepIndex + 1)}
            disabled={!selectedSubtype}
            style={{
              ...continueBtnStyle,
              opacity: selectedSubtype ? 1 : 0.5,
              cursor: selectedSubtype ? "pointer" : "not-allowed",
            }}
          >
            Continuar ➔
          </button>
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
                  style={selectedSize === size ? btnStyleSelected : btnStyleLight}
                >
                  {size}{" "}
                  <span style={{ fontWeight: "normal", color: selectedSize === size ? "#2d1e17" : "#666" }}>
                    {priceString}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setStepIndex(stepIndex + 1)}
            disabled={!selectedSize}
            style={{
              ...continueBtnStyle,
              opacity: selectedSize ? 1 : 0.5,
              cursor: selectedSize ? "pointer" : "not-allowed",
            }}
          >
            Continuar ➔
          </button>
        </div>
      )}

      {currentStepName === "shells" && activeRules && (
        <div>
          <h3 style={titleStyle}>
            {activeRules.cascas > 1
              ? `Escolha a casca (${shellSlot + 1} de ${activeRules.cascas}):`
              : "Escolha a casca:"}
          </h3>
          <div style={gridStyle}>
            {currentShellOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  const next = [...shells];
                  next[shellSlot] = opt;
                  setShells(next);
                }}
                style={shells[shellSlot] === opt ? btnStyleSelected : btnStyleLight}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (shellSlot < activeRules.cascas - 1) {
                setShellSlot(shellSlot + 1);
              } else {
                setShellSlot(0);
                setStepIndex(stepIndex + 1);
              }
            }}
            disabled={!shells[shellSlot]}
            style={{
              ...continueBtnStyle,
              opacity: shells[shellSlot] ? 1 : 0.5,
              cursor: shells[shellSlot] ? "pointer" : "not-allowed",
            }}
          >
            {shellSlot < activeRules.cascas - 1 ? "Próxima Casca ➔" : "Continuar ➔"}
          </button>
        </div>
      )}

      {currentStepName === "fillings" && activeRules && (
        <div>
          <h3 style={titleStyle}>
            {activeRules.recheios > 1
              ? `Escolha o recheio (${fillingSlot + 1} de ${activeRules.recheios}):`
              : "Escolha o recheio:"}
          </h3>
          <div style={gridStyle}>
            {FILLING_OPT.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  const next = [...fillings];
                  next[fillingSlot] = opt;
                  setFillings(next);
                }}
                style={fillings[fillingSlot] === opt ? btnStyleSelected : btnStyleLight}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (fillingSlot < activeRules.recheios - 1) {
                setFillingSlot(fillingSlot + 1);
              } else {
                setFillingSlot(0);
                setStepIndex(stepIndex + 1);
              }
            }}
            disabled={!fillings[fillingSlot]}
            style={{
              ...continueBtnStyle,
              opacity: fillings[fillingSlot] ? 1 : 0.5,
              cursor: fillings[fillingSlot] ? "pointer" : "not-allowed",
            }}
          >
            {fillingSlot < activeRules.recheios - 1 ? "Próximo Recheio ➔" : "Continuar ➔"}
          </button>
        </div>
      )}

      {currentStepName === "toppings" && activeRules && (
        <div>
          <h3 style={titleStyle}>
            {activeRules.acompanhamentos > 1
              ? `Escolha o acompanhamento (${toppingSlot + 1} de ${activeRules.acompanhamentos}):`
              : "Escolha o acompanhamento:"}
          </h3>
          <div style={gridStyle}>
            {TOPPING_OPT.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  const next = [...toppings];
                  next[toppingSlot] = opt;
                  setToppings(next);
                }}
                style={toppings[toppingSlot] === opt ? btnStyleSelected : btnStyleLight}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (toppingSlot < activeRules.acompanhamentos - 1) {
                setToppingSlot(toppingSlot + 1);
              } else {
                setToppingSlot(0);
                setStepIndex(stepIndex + 1);
              }
            }}
            disabled={!toppings[toppingSlot]}
            style={{
              ...continueBtnStyle,
              opacity: toppings[toppingSlot] ? 1 : 0.5,
              cursor: toppings[toppingSlot] ? "pointer" : "not-allowed",
            }}
          >
            {toppingSlot < activeRules.acompanhamentos - 1 ? "Próximo Acompanhamento ➔" : "Continuar ➔"}
          </button>
        </div>
      )}

      {currentStepName === "additionals" && (
        <div>
          <h3 style={titleStyle}>Escolha adicionais:</h3>
          <p style={subtitleStyle}>
            OBS.: Esses ingredientes são opcionais pagos.
          </p>
          <div style={gridStyle}>
            {ADDITIONAL_OPT.map((opt) => {
              const isSelected = additionals.includes(opt);
              const priceStr = `+ R$ ${ADDITIONALS_PRICES[opt].toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (isSelected)
                      setAdditionals(additionals.filter((a) => a !== opt));
                    else setAdditionals([...additionals, opt]);
                  }}
                  style={isSelected ? btnStyleSelected : btnStyleLight}
                >
                  {opt}{" "}
                  <span
                    style={{
                      fontWeight: "normal",
                      color: isSelected ? "#2d1e17" : "#666",
                    }}
                  >
                    ({priceStr})
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setStepIndex(stepIndex + 1)}
            style={{ ...continueBtnStyle, opacity: 1, cursor: "pointer" }}
          >
            {additionals.length > 0
              ? "Finalizar Montagem ➔"
              : "Pular e Finalizar ➔"}
          </button>
        </div>
      )}

      {currentStepName === "finish" && (
        <div style={{ textAlign: "center" }}>
          <h3 style={{ color: "#2d1e17", margin: "0 0 0.25rem 0", fontSize: "1.4rem" }}>
            Ovo Montado!
          </h3>
          <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 1.5rem 0" }}>
            Confira os detalhes abaixo
          </p>

          <div style={{
            backgroundColor: "#fff",
            border: "1px solid #e8dfce",
            borderRadius: "12px",
            overflow: "hidden",
            marginBottom: "1.5rem",
            textAlign: "left",
          }}>
            {/* Nome e preço */}
            <div style={{
              backgroundColor: "#2d1e17",
              padding: "0.9rem 1.2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ color: "#f8f4e6", fontWeight: "bold", fontSize: "1rem" }}>
                {selectedSubtype || selectedType}
                {selectedSize ? ` (${selectedSize})` : ""}
              </span>
              <span style={{ color: "#e2b05b", fontWeight: "bold", fontSize: "1rem" }}>
                {formattedCurrentPrice}
              </span>
            </div>

            {/* Detalhes */}
            <div style={{ padding: "0.25rem 0" }}>
              {shells.length > 0 && (
                <div style={summaryRowStyle}>
                  <span style={summaryLabelStyle}>
                    {shells.length > 1 ? "Cascas" : "Casca"}
                  </span>
                  <span style={summaryValueStyle}>{shells.join(" · ")}</span>
                </div>
              )}
              {fillings.length > 0 && (
                <div style={summaryRowStyle}>
                  <span style={summaryLabelStyle}>
                    {fillings.length > 1 ? "Recheios" : "Recheio"}
                  </span>
                  <span style={summaryValueStyle}>{fillings.join(" · ")}</span>
                </div>
              )}
              {toppings.length > 0 && (
                <div style={summaryRowStyle}>
                  <span style={summaryLabelStyle}>
                    {toppings.length > 1 ? "Acompanhamentos" : "Acompanhamento"}
                  </span>
                  <span style={summaryValueStyle}>{toppings.join(" · ")}</span>
                </div>
              )}
              {additionals.length > 0 && (
                <div style={{ ...summaryRowStyle, borderBottom: "none" }}>
                  <span style={summaryLabelStyle}>Adicionais</span>
                  <span style={summaryValueStyle}>{additionals.join(" · ")}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              width: "100%",
              padding: "1rem 2rem",
              backgroundColor: "#e2b05b",
              color: "#2d1e17",
              border: "none",
              borderRadius: "50px",
              fontWeight: "800",
              fontSize: "1.05rem",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(45, 30, 23, 0.2)",
              transition: "filter 0.2s",
            }}
          >
            Adicionar ao Carrinho · {formattedCurrentPrice}
          </button>
        </div>
      )}
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "0.75rem",
};
const titleStyle = { color: "#2d1e17", marginTop: 0, marginBottom: "0.5rem" };
const subtitleStyle = {
  fontSize: "0.85rem",
  color: "#666",
  marginTop: 0,
  marginBottom: "1rem",
};

const btnStyleLight = {
  padding: "0.9rem 1.2rem 0.9rem 1rem",
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  border: "1px solid #e8dfce",
  borderLeft: "3px solid #e2b05b",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#2d1e17",
  textAlign: "left" as const,
  transition: "background-color 0.2s, border-color 0.2s",
  boxShadow: "0 2px 4px rgba(45, 30, 23, 0.04)",
};

const btnStyleSelected = {
  padding: "0.9rem 1.2rem 0.9rem 1rem",
  backgroundColor: "#e2b05b",
  border: "1px solid #c9922a",
  borderLeft: "3px solid #2d1e17",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#2d1e17",
  textAlign: "left" as const,
  transition: "background-color 0.2s, border-color 0.2s",
  boxShadow: "0 2px 6px rgba(45, 30, 23, 0.12)",
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
  borderRadius: "50px",
  fontWeight: "bold",
  fontSize: "1.1rem",
  marginTop: "1.5rem",
  transition: "opacity 0.2s",
};

const summaryRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  padding: "0.75rem 1.2rem",
  borderBottom: "1px solid #f0ebe0",
};

const summaryLabelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: "700",
  color: "#999",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  whiteSpace: "nowrap",
  paddingTop: "1px",
};

const summaryValueStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  color: "#2d1e17",
  fontWeight: "600",
  textAlign: "right",
};
