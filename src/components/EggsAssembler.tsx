import React, { useState } from "react";

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

const FILLING_OPT = ["Chocolate", "Leite Ninho", "Mais recheio"];

const TOPPING_OPT = [
  "Brigadeiro de Chocolate",
  "Brigadeiro de Leite Ninho",
  "KitKat",
];

export default function EggsAssembler() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [shells, setShells] = useState<string[]>([]);
  const [fillings, setFillings] = useState<string[]>([]);
  const [toppings, setToppings] = useState<string[]>([]);

  const resetAll = () => {
    setSelectedType(null);
    setSelectedSubtype(null);
    setSelectedSize(null);
    setShells([]);
    setFillings([]);
    setToppings([]);
  };

  const currentVariation =
    selectedSubtype ||
    (selectedType == "Mini Ovos" ? selectedSize : selectedType);
  const rules = currentVariation ? ASSEMBLER_RULES[currentVariation] : null;

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

  const needsSubtypes = selectedType && SUBTYPES[selectedType] !== undefined;
  const isReadyForSize = selectedType && (!needsSubtypes || selectedSubtype);
  const isReadyForShells =
    isReadyForSize && selectedSize && rules && rules.cascas > 0;
  const isReadyForFillings =
    isReadyForSize &&
    selectedSize &&
    rules &&
    (rules.cascas === 0 || shells.length === rules.cascas) &&
    rules.recheios > 0;
  const isReadyForToppings =
    isReadyForSize &&
    selectedSize &&
    rules &&
    (rules.cascas === 0 || shells.length === rules.cascas) &&
    (rules.recheios === 0 || fillings.length === rules.recheios) &&
    rules.acompanhamentos > 0;

  const isFinished =
    isReadyForSize &&
    selectedSize &&
    rules &&
    (rules.cascas === 0 || shells.length === rules.cascas) &&
    (rules.recheios === 0 || fillings.length === rules.recheios) &&
    (rules.acompanhamentos === 0 || toppings.length === rules.acompanhamentos);

  const currentShellOptions =
    selectedType === "Mini Ovos" ? MINI_EGGSHELL_OPT : EGGSHELL_OPT;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      {selectedType && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid #eee",
          }}
        >
          <div>
            <h3 style={{ color: "#2d1e17", margin: "0 0 0.5rem 0" }}>
              {selectedSubtype || selectedType}{" "}
              {selectedSize ? `(${selectedSize})` : ""}
            </h3>
            {currentVariation === "Ovo de Colher de Brownie" && (
              <p
                style={{
                  margin: 0,
                  color: "#e2b05b",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                A casca já é de Brownie!
              </p>
            )}
          </div>
          <button
            onClick={resetAll}
            style={{
              background: "none",
              border: "none",
              color: "#e2b05b",
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Recomeçar
          </button>
        </div>
      )}
      {/* Tipo de Ovo */}
      {!selectedType && (
        <div>
          <h3 style={{ color: "#2d1e17", marginTop: "0" }}>
            Escolha o tipo de ovo:
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {EGG_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={btnStyle}
              >
                🍫 {type}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Subtipo */}
      {needsSubtypes && !selectedSubtype && (
        <div>
          <h3 style={{ color: "2d1e17", marginTop: "0" }}>
            Escolha o estilo de ovo:
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {SUBTYPES[selectedType].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubtype(sub)}
                style={btnStyle}
              >
                🥄 {sub}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Tamanho */}
      {isReadyForSize && !selectedSize && (
        <div>
          <h3 style={{ color: "#2d1e17", marginTop: 0 }}>Escolha o tamanho:</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {SIZES_BY_TYPE[selectedSubtype || selectedType]?.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={btnStyleLight}
              >
                📏 {size}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Casca */}
      {isReadyForShells && shells.length < rules!.cascas && (
        <div>
          <h3 style={{ color: "#2d1e17", marginTop: 0 }}>
            Escolha {rules!.cascas} casca{rules!.cascas > 1 ? "s" : ""}.
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#666" }}>
            Selecionadas: {shells.length} de {rules!.cascas}
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {currentShellOptions.map((opt) => (
              <button
                key={opt}
                onClick={() =>
                  handleToggleItem(
                    opt,
                    shells,
                    setShells,
                    rules!.cascas,
                    "casca",
                  )
                }
                style={shells.includes(opt) ? btnStyleSelected : btnStyleLight}
              >
                🥚 {opt}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Recheio */}
      {isReadyForFillings && fillings.length < rules!.recheios && (
        <div>
          <h3 style={{ color: "#2d1e17", marginTop: 0 }}>
            Escolha {rules!.recheios} recheio{rules!.recheios > 1 ? "s" : ""}.
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#666" }}>
            Selecionados: {fillings.length} de {rules!.recheios}
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {FILLING_OPT.map((opt) => (
              <button
                key={opt}
                onClick={() =>
                  handleToggleItem(
                    opt,
                    fillings,
                    setFillings,
                    rules!.recheios,
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
        </div>
      )}
      {/* Acompanhamento */}
      {isReadyForToppings && toppings.length < rules!.acompanhamentos && (
        <div>
          <h3 style={{ color: "#2d1e17", marginTop: 0 }}>
            Escolha {rules!.acompanhamentos} acompanhamento
            {rules!.acompanhamentos > 1 ? "s" : ""}.
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#666" }}>
            Selecionados: {toppings.length} de {rules!.acompanhamentos}
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {TOPPING_OPT.map((opt) => (
              <button
                key={opt}
                onClick={() =>
                  handleToggleItem(
                    opt,
                    toppings,
                    setToppings,
                    rules!.acompanhamentos,
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
        </div>
      )}
      {isFinished && (
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
            Adicionar ao Carrinho
          </button>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  padding: "1rem",
  backgroundColor: "#f8f4e6",
  border: "1px solid #e2b05b",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#2d1e17",
  textAlign: "left" as const,
  fontSize: "1rem",
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
};
