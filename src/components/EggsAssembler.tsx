import React, { useState, useRef, useEffect } from "react";
import { useStore } from "@nanostores/react";

import { addItemToCart } from "../store/cartStore.ts";
import { EGG_TYPE_ICONS } from "./EggTypeIcons";
import { stockStore } from "../store/stockStore.ts";

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
  "Ovo Simples com Miniatura": ["250g", "350g"],
  "Ovo Simples com Pelúcia": ["250g", "350g"],
  "Ovo Trufado de Uma Banda": ["250g", "350g"],
  "Ovo Trufado de Duas Bandas": ["250g", "350g"],
  "Ovo de Pote": ["250g", "350g"],
  "Mini Ovos": ["Caixa com 2 unidades", "Caixa com 4 unidades"],
};

const PRICES: Record<string, Record<string, number>> = {
  "Ovo de Colher Simples": { "250g": 62.0, "350g": 75.0 },
  "Ovo de Colher Especial": { "250g": 68.0, "350g": 78.0 },
  "Ovo de Colher de Guloseimas": { "250g": 70.0, "350g": 82.0 },
  "Ovo de Colher de Brownie": { "250g": 78.0, "350g": 90.0 },
  "Ovo Simples": { "250g": 45.0, "350g": 55.0 },
  "Ovo Simples com Miniatura": { "250g": 60.0, "350g": 70.0 },
  "Ovo Simples com Pelúcia": { "250g": 75.0, "350g": 85.0 },
  "Ovo Trufado de Uma Banda": { "250g": 37.0, "350g": 47.0 },
  "Ovo Trufado de Duas Bandas": { "250g": 68.0, "350g": 78.0 },
  "Ovo de Pote": { "250g": 80.0, "350g": 95.5 },
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
  "Ovo Simples com Miniatura": { cascas: 2, recheios: 0, acompanhamentos: 0 },
  "Ovo Simples com Pelúcia": { cascas: 2, recheios: 0, acompanhamentos: 0 },
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
  "Prestígio",
  "Ovomaltine",
];

const TOPPING_OPT = [
  "Brigadeiro de Chocolate",
  "Brigadeiro de Leite Ninho",
  "Brigadeiro de Amendoim",
  "Coelhinho de Chocolate",
  "Beijinho",
  "KitKat",
  "Bis Chocolate",
  "Bis Branco",
  "Bis Limão",
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

const SIMPLE_STYLES = [
  "Ovo Simples",
  "Ovo Simples com Miniatura",
  "Ovo Simples com Pelúcia",
];

const MINIATURA_OPTIONS = [
  "Miniatura do Pikachu",
  "Miniatura do Mega Charizard X",
  "Miniatura do Mega Blastoise",
  "Miniatura do Mega Venusaur",
  "Miniatura do Charizard",
  "Miniatura do Mewtwo",
  "Miniatura do Scorbunny",
  "Miniatura do Dracovish",
  "Miniatura do Zarude",
  "Miniatura do Greninja",
  "Miniatura do Zeraora",
  "Miniatura do Drizzile",
];

const MINIATURA_DM_OPTIONS = [
  "Miniatura da Alegria",
  "Miniatura da Ansiedade",
  "Miniatura da Inveja",
  "Miniatura do Medo",
  "Miniatura do Nojinho",
  "Miniatura da Raiva",
  "Miniatura do Tédio",
  "Miniatura da Tristeza",
  "Miniatura da Vergonha",
];

const PELUCIA_POKEMON_OPTIONS = [
  "Pelúcia do Pikachu",
  "Pelúcia do Lapras",
];

const PELUCIA_STITCH_OPTIONS = [
  "Pelúcia do Stitch Azul",
  "Pelúcia do Stitch Rosa",
];

const PELUCIA_OPTIONS = [...PELUCIA_POKEMON_OPTIONS, ...PELUCIA_STITCH_OPTIONS];

const ACCESSORY_IMAGE: Record<string, string> = {
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
  "Pelúcia do Pikachu": "/pelucias/pokemon/pikachu.png",
  "Pelúcia do Lapras": "/pelucias/pokemon/lapras.png",
  "Pelúcia do Stitch Azul": "/pelucias/stitch/stitch_azul.png",
  "Pelúcia do Stitch Rosa": "/pelucias/stitch/stitch_rosa.png",
  "Miniatura da Alegria": "/miniaturas/divertida_mente/alegria.png",
  "Miniatura da Ansiedade": "/miniaturas/divertida_mente/ansiedade.png",
  "Miniatura da Inveja": "/miniaturas/divertida_mente/inveja.png",
  "Miniatura do Medo": "/miniaturas/divertida_mente/medo.png",
  "Miniatura do Nojinho": "/miniaturas/divertida_mente/nojinho.png",
  "Miniatura da Raiva": "/miniaturas/divertida_mente/raiva.png",
  "Miniatura do Tédio": "/miniaturas/divertida_mente/tedio.png",
  "Miniatura da Tristeza": "/miniaturas/divertida_mente/tristeza.png",
  "Miniatura da Vergonha": "/miniaturas/divertida_mente/vergonha.png",
};

export default function EggsAssembler() {
  const stock = useStore(stockStore);
  const isOutOfStock = (item: string) => {
    const s = stock[item];
    return s !== null && s !== undefined && s <= 0;
  };

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);
  const [selectedSimpleStyle, setSelectedSimpleStyle] = useState<string | null>(null);
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(null);
  const [selectedAccessoryCategory, setSelectedAccessoryCategory] = useState<string | null>(null);
  const [accessoryEditMode, setAccessoryEditMode] = useState<"category" | "item" | null>(null);
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
  const [obsNote, setObsNote] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContentHeight(el.scrollHeight);
    });
    ro.observe(el);
    setContentHeight(el.scrollHeight);
    return () => ro.disconnect();
  }, []);

  const resetAll = () => {
    setSelectedType(null);
    setSelectedSubtype(null);
    setSelectedSimpleStyle(null);
    setSelectedAccessory(null);
    setSelectedAccessoryCategory(null);
    setAccessoryEditMode(null);
    setSelectedSize(null);
    setShells([]);
    setFillings([]);
    setToppings([]);
    setAdditionals([]);
    setStepIndex(0);
    setShellSlot(0);
    setFillingSlot(0);
    setToppingSlot(0);
    setObsNote("");
  };

  const getRequiredSteps = () => {
    const steps = ["type"];
    if (!selectedType) return steps;

    if (selectedType === "Ovo Simples") {
      steps.push("simplestyle");
      if (selectedSimpleStyle && selectedSimpleStyle !== "Ovo Simples") {
        steps.push("accessory_category");
        if (selectedAccessoryCategory) {
          steps.push("accessory");
        }
      }
    }

    if (SUBTYPES[selectedType]) steps.push("subtype");

    const sizeKey = selectedSubtype || (selectedType === "Ovo Simples" && selectedSimpleStyle ? selectedSimpleStyle : selectedType);
    if (SIZES_BY_TYPE[sizeKey]) steps.push("size");

    const currentVariation =
      selectedSubtype ||
      (selectedType === "Mini Ovos" ? selectedSize :
      selectedType === "Ovo Simples" && selectedSimpleStyle ? selectedSimpleStyle : selectedType);
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
    (selectedType === "Mini Ovos" ? selectedSize :
    selectedType === "Ovo Simples" && selectedSimpleStyle ? selectedSimpleStyle : selectedType);
  const activeRules = activeVariation ? ASSEMBLER_RULES[activeVariation] : null;

  const handleSelectType = (type: string) => {
    if (type !== selectedType) {
      setSelectedSubtype(null);
      setSelectedSimpleStyle(null);
      setSelectedAccessory(null);
      setSelectedAccessoryCategory(null);
      setAccessoryEditMode(null);
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

  const currentKey = selectedSubtype || (selectedType === "Ovo Simples" && selectedSimpleStyle ? selectedSimpleStyle : selectedType);
  let currentPrice = 0;

  if (
    currentKey &&
    selectedSize &&
    PRICES[currentKey] &&
    PRICES[currentKey][selectedSize]
  ) {
    currentPrice = PRICES[currentKey][selectedSize];
  }

  const extraPrice = additionals.reduce((total, add) => {
    if (selectedType === "Mini Ovos") {
      return total + 4.0;
    }
    return total + (ADDITIONALS_PRICES[add] || 0);
  }, 0);

  const getAccessoryPrice = (acc: string | null): number => {
    if (!acc) return 0;
    const isMiniatura = MINIATURA_OPTIONS.includes(acc) || MINIATURA_DM_OPTIONS.includes(acc);
    if (selectedSimpleStyle === "Ovo Simples com Miniatura") return isMiniatura ? 0 : 20;
    if (selectedSimpleStyle === "Ovo Simples com Pel\u00facia") return isMiniatura ? -20 : 0;
    if (selectedType === "Ovo Simples") return isMiniatura ? 15 : 35;
    return isMiniatura ? 22 : 50;
  };

  currentPrice += extraPrice;
  currentPrice += getAccessoryPrice(selectedAccessory);

  const formattedCurrentPrice = currentPrice.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleAddToCart = () => {
    const productName = `${selectedSubtype || (selectedType === "Ovo Simples" ? selectedSimpleStyle : null) || selectedType} ${selectedSize ? `(${selectedSize})` : ""}`;

    const details = [
      selectedAccessory ? `Acessório: ${selectedAccessory}` : null,
      shells.length > 0 ? `Cascas: ${shells.join(", ")}` : null,
      fillings.length > 0 ? `Recheios: ${fillings.join(", ")}` : null,
      toppings.length > 0 ? `Acompanhamentos: ${toppings.join(", ")}` : null,
      additionals.length > 0
        ? `Adicionais Pagos: ${additionals.join(", ")}`
        : null,
      obsNote.trim() ? `Obs.: ${obsNote.trim()}` : null,
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
    setTimeout(() => setToastLeaving(true), 3500);
    setTimeout(() => setToast(null), 4000);
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
      {currentStepName !== "finish" && (
        <div
          style={{
            overflow: "hidden",
            maxHeight: stepIndex > 0 ? "4rem" : "0",
            opacity: stepIndex > 0 ? 1 : 0,
            marginBottom: stepIndex > 0 ? "0.75rem" : "0",
            transition: "max-height 0.35s ease, opacity 0.3s ease, margin-bottom 0.35s ease",
          }}
        >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #eee",
            paddingBottom: "0.75rem",
          }}
        >
          <div style={{ width: "80px" }}>
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
          </div>

          <div style={{ width: "80px", textAlign: "right" }}>
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
          </div>
        </div>
        </div>
      )}

      {currentStepName !== "finish" && (
        <div
          style={{
            overflow: "hidden",
            maxHeight: selectedType ? "3rem" : "0",
            opacity: selectedType ? 1 : 0,
            marginBottom: selectedType ? "1.5rem" : "0",
            transition: "max-height 0.35s ease, opacity 0.3s ease, margin-bottom 0.35s ease",
          }}
        >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
            backgroundColor: "#2d1e17",
            borderRadius: "50px",
            padding: "0.45rem 1rem",
            minHeight: "2rem",
          }}
        >
          <span
            style={{
              color: "#f8f4e6",
              fontSize: "0.82rem",
              fontWeight: "600",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {selectedSubtype || (selectedType === "Ovo Simples" ? selectedSimpleStyle : null) || selectedType}
            {selectedSize ? ` · ${selectedSize}` : ""}
            {selectedAccessory ? ` · ${selectedAccessory}` : ""}
          </span>
          {currentPrice > 0 && (
            <span
              style={{
                color: "#e2b05b",
                fontSize: "0.85rem",
                fontWeight: "800",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {formattedCurrentPrice}
            </span>
          )}
          {activeVariation === "Ovo de Colher de Brownie" && (
            <span
              style={{
                color: "#e2b05b",
                fontSize: "0.75rem",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              casca: brownie
            </span>
          )}
        </div>
        </div>
      )}

      <div
          style={{
            height: contentHeight !== undefined ? contentHeight : "auto",
            transition: "height 0.35s ease",
            overflow: "hidden",
          }}
        >
        <div ref={contentRef}>
        {currentStepName === "type" && (
        <div>
          <h3 style={titleStyle}>Escolha o tipo de ovo:</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {EGG_TYPES.slice(0, 4).map((type) => (
              <button
                key={type}
                onClick={() => handleSelectType(type)}
                style={selectedType === type ? typeCardSelectedStyle : typeCardStyle}
              >
                <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
                  {EGG_TYPE_ICONS[type]}
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", lineHeight: 1.3 }}>{type}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
            <button
              onClick={() => handleSelectType("Mini Ovos")}
              style={{
                ...(selectedType === "Mini Ovos" ? typeCardSelectedStyle : typeCardStyle),
                width: "100%",
              }}
            >
              <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
                {EGG_TYPE_ICONS["Mini Ovos"]}
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", lineHeight: 1.3 }}>Mini Ovos</span>
            </button>
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

      {currentStepName === "simplestyle" && (
        <div>
          <h3 style={titleStyle}>Escolha a versão:</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {/* Ovo Simples — ícone padrão */}
            <button
              onClick={() => { if ("Ovo Simples" !== selectedSimpleStyle) { setSelectedAccessory(null); setSelectedAccessoryCategory(null); } setSelectedSimpleStyle("Ovo Simples"); }}
              style={selectedSimpleStyle === "Ovo Simples" ? typeCardSelectedStyle : typeCardStyle}
            >
              <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
                {EGG_TYPE_ICONS["Ovo Simples"]}
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", lineHeight: 1.3 }}>Ovo Simples</span>
            </button>

            {/* Ovo Simples com Miniatura — ovo + "+" */}
            <button
              onClick={() => { if ("Ovo Simples com Miniatura" !== selectedSimpleStyle) { setSelectedAccessory(null); setSelectedAccessoryCategory(null); } setSelectedSimpleStyle("Ovo Simples com Miniatura"); }}
              style={selectedSimpleStyle === "Ovo Simples com Miniatura" ? typeCardSelectedStyle : typeCardStyle}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                <div style={{ position: "relative", width: "54px", height: "54px", flexShrink: 0 }}>
                  {EGG_TYPE_ICONS["Ovo Simples"]}
                </div>
                <span style={{ fontSize: "1.3rem", fontWeight: "700", color: "#b8895a", lineHeight: 1 }}>+</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 48 48" style={{ marginTop: "10px" }}>
                  <path fill="#fbd12c" d="M 13 20 L 5 5 A 2 2 0 0 1 8 4 L 21 15 Z" />
                  <path fill="#212121" d="M 8.5 11 L 5 5 A 2 2 0 0 1 8 4 L 12.5 8 Z" />
                  <path fill="#fbd12c" d="M 35 20 L 43 5 A 2 2 0 0 0 40 4 L 27 15 Z" />
                  <path fill="#212121" d="M 39.5 11 L 43 5 A 2 2 0 0 0 40 4 L 35.5 8 Z" />
                  <ellipse cx="24" cy="27" rx="15" ry="14" fill="#fbd12c"/>
                  <circle cx="11.5" cy="30" r="3.5" fill="#ee2222"/>
                  <circle cx="36.5" cy="30" r="3.5" fill="#ee2222"/>
                  <ellipse cx="17" cy="24" rx="2.5" ry="3.5" fill="#212121"/>
                  <circle cx="17.5" cy="22.5" r="1.2" fill="#fff"/>
                  <ellipse cx="31" cy="24" rx="2.5" ry="3.5" fill="#212121"/>
                  <circle cx="30.5" cy="22.5" r="1.2" fill="#fff"/>
                  <polygon points="24,28.5 23.2,29.5 24.8,29.5" fill="#212121"/>
                  <path fill="none" stroke="#212121" strokeWidth="1.2" strokeLinecap="round" d="M 20 31.5 C 20 31.5, 22 33, 24 31.5 C 24 31.5, 26 33, 28 31.5" />
                </svg>
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", lineHeight: 1.3 }}>Ovo Simples com Miniatura</span>
            </button>
          </div>

          {/* Ovo Simples com Pelúcia — largura total: ovo + "+" + SVG Stitch */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
            <button
              onClick={() => { if ("Ovo Simples com Pelúcia" !== selectedSimpleStyle) { setSelectedAccessory(null); setSelectedAccessoryCategory(null); } setSelectedSimpleStyle("Ovo Simples com Pelúcia"); }}
              style={{ ...(selectedSimpleStyle === "Ovo Simples com Pelúcia" ? typeCardSelectedStyle : typeCardStyle), width: "100%" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                <div style={{ position: "relative", width: "54px", height: "54px", flexShrink: 0 }}>
                  {EGG_TYPE_ICONS["Ovo Simples"]}
                </div>
                <span style={{ fontSize: "1.3rem", fontWeight: "700", color: "#b8895a", lineHeight: 1 }}>+</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 48 48" style={{ marginTop: "13px" }}>
                  <path fill="#3a8ad3" d="M23.97,37c3.002-0.007,8.026-0.125,11.466-4.052c2.269-2.59,2.42-9.412-1.911-13.554c-1.855-1.773-3.44-3.603-9.555-3.765c-4.331-0.114-7.7,2.028-9.555,3.801c-4.331,4.141-4.037,10.849-1.911,13.554C15.562,36.875,20.971,37.007,23.97,37z"/>
                  <path fill="#3a8ad3" d="M35.865,31.75c0,0-0.25-10.75,2.625-12.5L40.25,26l1.625,1.625C41.875,27.625,40.615,30.875,35.865,31.75z"/>
                  <path fill="#fe9acc" d="M41.74,25.75c0,0-0.625,0.125-0.375,0.75c0.111,0.278,0.296,0.654,0.468,0.987c-2.344,2.028-4.718,2.763-4.718,2.763s2.125-6.25,1.375-11S37.86,6.955,40.615,6.125c1.245-0.375,6,1.875,5.75,11.625c-0.09,3.513-1.321,6.106-2.853,8H41.74z"/>
                  <path fill="#3a8ad3" d="M12.37,31.75c0,0,0.25-10.75-2.625-12.5L8,24.75L6.375,27.5C6.375,27.5,7.62,30.875,12.37,31.75z"/>
                  <path fill="#82cdec" d="M19.875,27.875c0-1.488,0.08-2.975,0-4.463c-0.082-1.51-0.5-3.412-2.122-3.729c-1.017-0.199-1.898-0.038-2.753,0.567c-1.778,1.259-2.404,3.795-2.523,5.817c-0.375,6.375,3.898,6.433,3.898,6.433S19.875,32.762,19.875,27.875z"/>
                  <path fill="#1853b2" d="M26.659,25.084c0,0-1.247-0.496-2.659-0.459c-1.412-0.015-2.659,0.5-2.659,0.5s0.206-0.258,0.654-0.55c0.441-0.292,1.16-0.593,1.996-0.597c0.836-0.011,1.559,0.282,2.005,0.566C26.449,24.83,26.659,25.084,26.659,25.084z"/>
                  <ellipse cx="24" cy="29.438" fill="#212121" rx="3.625" ry="3.567"/>
                  <ellipse cx="16.382" cy="27.75" fill="#212121" rx="2.813" ry="3.75"/>
                  <circle cx="16.819" cy="26" r="1" fill="#fff"/>
                  <path fill="#fe9acc" d="M6.495,25.75c0,0,0.625,0.125,0.375,0.75c-0.111,0.278-0.296,0.654-0.468,0.987c2.344,2.028,4.718,2.763,4.718,2.763s-2.125-6.25-1.375-11S10.375,6.955,7.62,6.125C6.375,5.75,1.62,8,1.87,17.75c0.09,3.513,1.321,6.106,2.853,8H6.495z"/>
                  <path fill="#212121" d="M33.25,33.118c0,0,0.125,0.257-0.625,0.757c-0.5,0.375-4.563,1.743-8.563,1.618c-5.375,0-7.683-1.377-8.036-1.535c-0.341-0.155-0.588-0.365-0.756-0.554c-0.336-0.386-0.396-0.662-0.396-0.662s0.242,0.23,0.625,0.507c0.19,0.136,0.562,0.303,0.875,0.375C16.675,33.695,21.4,34.5,24,34.5c2.638,0.02,7.822-0.645,8.25-0.875C33,33.375,33.25,33.118,33.25,33.118z"/>
                  <path fill="#1853b2" d="M18.625,19.014c-0.017,0.047-0.724-0.59-1.5-0.639c-0.831-0.053-1.75,0.264-1.75,0.264s0.132-0.175,0.41-0.391c0.271-0.213,0.726-0.478,1.33-0.455c0.616,0.026,1.066,0.43,1.245,0.72C18.555,18.81,18.625,19.014,18.625,19.014z"/>
                  <path fill="#1853b2" d="M29.625,19.084c0.011,0.005,0.003-0.234,0.192-0.582c0.172-0.34,0.72-0.764,1.373-0.708c0.639,0.047,1.092,0.394,1.343,0.667c0.256,0.281,0.342,0.498,0.342,0.498s-0.901-0.675-1.625-0.584c-0.433-0.032-0.902,0.173-1.184,0.354c-0.131,0.095-0.249,0.179-0.319,0.25C29.67,19.045,29.625,19.084,29.625,19.084z"/>
                  <rect width="1" height="2.25" x="23.5" y="32.625" fill="#212121"/>
                  <path fill="#82cdec" d="M28.204,27.873c0-1.488-0.08-2.975,0-4.463c0.082-1.51,0.5-3.412,2.122-3.729c1.017-0.199,1.898-0.038,2.753,0.567c1.778,1.259,2.404,3.795,2.523,5.817c0.375,6.375-3.898,6.433-3.898,6.433S28.204,32.76,28.204,27.873z"/>
                  <ellipse cx="31.697" cy="27.747" fill="#212121" rx="2.813" ry="3.75"/>
                  <circle cx="31.259" cy="25.997" r="1" fill="#fff"/>
                </svg>
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", lineHeight: 1.3 }}>Ovo Simples com Pelúcia</span>
            </button>
          </div>

          <button
            onClick={() => setStepIndex(stepIndex + 1)}
            disabled={!selectedSimpleStyle}
            style={{ ...continueBtnStyle, opacity: selectedSimpleStyle ? 1 : 0.5, cursor: selectedSimpleStyle ? "pointer" : "not-allowed" }}
          >
            Continuar ➔
          </button>
        </div>
      )}

      {currentStepName === "accessory_category" && (
        <div>
          <h3 style={titleStyle}>
            {selectedSimpleStyle === "Ovo Simples com Miniatura" ? "Escolha a coleção de miniaturas:" : "Escolha a coleção de pelúcias:"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {selectedSimpleStyle === "Ovo Simples com Miniatura" ? (
              <>
                <button
                  onClick={() => { setSelectedAccessory(null); setSelectedAccessoryCategory("miniatura-pokemon"); }}
                  style={selectedAccessoryCategory === "miniatura-pokemon" ? typeCardSelectedStyle : typeCardStyle}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 48 48" style={{ marginTop: "10px" }}>
                    <path fill="#fbd12c" d="M 13 20 L 5 5 A 2 2 0 0 1 8 4 L 21 15 Z" />
                    <path fill="#212121" d="M 8.5 11 L 5 5 A 2 2 0 0 1 8 4 L 12.5 8 Z" />
                    <path fill="#fbd12c" d="M 35 20 L 43 5 A 2 2 0 0 0 40 4 L 27 15 Z" />
                    <path fill="#212121" d="M 39.5 11 L 43 5 A 2 2 0 0 0 40 4 L 35.5 8 Z" />
                    <ellipse cx="24" cy="27" rx="15" ry="14" fill="#fbd12c"/>
                    <circle cx="11.5" cy="30" r="3.5" fill="#ee2222"/>
                    <circle cx="36.5" cy="30" r="3.5" fill="#ee2222"/>
                    <ellipse cx="17" cy="24" rx="2.5" ry="3.5" fill="#212121"/>
                    <circle cx="17.5" cy="22.5" r="1.2" fill="#fff"/>
                    <ellipse cx="31" cy="24" rx="2.5" ry="3.5" fill="#212121"/>
                    <circle cx="30.5" cy="22.5" r="1.2" fill="#fff"/>
                    <polygon points="24,28.5 23.2,29.5 24.8,29.5" fill="#212121"/>
                    <path fill="none" stroke="#212121" strokeWidth="1.2" strokeLinecap="round" d="M 20 31.5 C 20 31.5, 22 33, 24 31.5 C 24 31.5, 26 33, 28 31.5" />
                  </svg>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", lineHeight: 1.3 }}>Miniaturas de Pokémon</span>
                </button>
                <button
                  onClick={() => { setSelectedAccessory(null); setSelectedAccessoryCategory("miniatura-divertida"); }}
                  style={{ ...typeCardStyle, ...(selectedAccessoryCategory === "miniatura-divertida" ? { backgroundColor: "#fff9f0", border: "2px solid #e2b05b" } : {}) }}
                >
                  <img src="/miniaturas/divertida_mente/alegria.png" alt="Divertida Mente" style={{ width: "72px", height: "72px", objectFit: "contain" }} />
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", lineHeight: 1.3 }}>Miniaturas de Divertida Mente</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setSelectedAccessory(null); setSelectedAccessoryCategory("pelucia-pokemon"); }}
                  style={selectedAccessoryCategory === "pelucia-pokemon" ? typeCardSelectedStyle : typeCardStyle}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 48 48" style={{ marginTop: "10px" }}>
                    <path fill="#fbd12c" d="M 13 20 L 5 5 A 2 2 0 0 1 8 4 L 21 15 Z" />
                    <path fill="#212121" d="M 8.5 11 L 5 5 A 2 2 0 0 1 8 4 L 12.5 8 Z" />
                    <path fill="#fbd12c" d="M 35 20 L 43 5 A 2 2 0 0 0 40 4 L 27 15 Z" />
                    <path fill="#212121" d="M 39.5 11 L 43 5 A 2 2 0 0 0 40 4 L 35.5 8 Z" />
                    <ellipse cx="24" cy="27" rx="15" ry="14" fill="#fbd12c"/>
                    <circle cx="11.5" cy="30" r="3.5" fill="#ee2222"/>
                    <circle cx="36.5" cy="30" r="3.5" fill="#ee2222"/>
                    <ellipse cx="17" cy="24" rx="2.5" ry="3.5" fill="#212121"/>
                    <circle cx="17.5" cy="22.5" r="1.2" fill="#fff"/>
                    <ellipse cx="31" cy="24" rx="2.5" ry="3.5" fill="#212121"/>
                    <circle cx="30.5" cy="22.5" r="1.2" fill="#fff"/>
                    <polygon points="24,28.5 23.2,29.5 24.8,29.5" fill="#212121"/>
                    <path fill="none" stroke="#212121" strokeWidth="1.2" strokeLinecap="round" d="M 20 31.5 C 20 31.5, 22 33, 24 31.5 C 24 31.5, 26 33, 28 31.5" />
                  </svg>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", lineHeight: 1.3 }}>Pelúcias de Pokémon</span>
                </button>
                <button
                  onClick={() => { setSelectedAccessory(null); setSelectedAccessoryCategory("pelucia-stitch"); }}
                  style={selectedAccessoryCategory === "pelucia-stitch" ? typeCardSelectedStyle : typeCardStyle}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 48 48" style={{ marginTop: "13px" }}>
                    <path fill="#3a8ad3" d="M23.97,37c3.002-0.007,8.026-0.125,11.466-4.052c2.269-2.59,2.42-9.412-1.911-13.554c-1.855-1.773-3.44-3.603-9.555-3.765c-4.331-0.114-7.7,2.028-9.555,3.801c-4.331,4.141-4.037,10.849-1.911,13.554C15.562,36.875,20.971,37.007,23.97,37z"/>
                    <path fill="#3a8ad3" d="M35.865,31.75c0,0-0.25-10.75,2.625-12.5L40.25,26l1.625,1.625C41.875,27.625,40.615,30.875,35.865,31.75z"/>
                    <path fill="#fe9acc" d="M41.74,25.75c0,0-0.625,0.125-0.375,0.75c0.111,0.278,0.296,0.654,0.468,0.987c-2.344,2.028-4.718,2.763-4.718,2.763s2.125-6.25,1.375-11S37.86,6.955,40.615,6.125c1.245-0.375,6,1.875,5.75,11.625c-0.09,3.513-1.321,6.106-2.853,8H41.74z"/>
                    <path fill="#3a8ad3" d="M12.37,31.75c0,0,0.25-10.75-2.625-12.5L8,24.75L6.375,27.5C6.375,27.5,7.62,30.875,12.37,31.75z"/>
                    <path fill="#82cdec" d="M19.875,27.875c0-1.488,0.08-2.975,0-4.463c-0.082-1.51-0.5-3.412-2.122-3.729c-1.017-0.199-1.898-0.038-2.753,0.567c-1.778,1.259-2.404,3.795-2.523,5.817c-0.375,6.375,3.898,6.433,3.898,6.433S19.875,32.762,19.875,27.875z"/>
                    <path fill="#1853b2" d="M26.659,25.084c0,0-1.247-0.496-2.659-0.459c-1.412-0.015-2.659,0.5-2.659,0.5s0.206-0.258,0.654-0.55c0.441-0.292,1.16-0.593,1.996-0.597c0.836-0.011,1.559,0.282,2.005,0.566C26.449,24.83,26.659,25.084,26.659,25.084z"/>
                    <ellipse cx="24" cy="29.438" fill="#212121" rx="3.625" ry="3.567"/>
                    <ellipse cx="16.382" cy="27.75" fill="#212121" rx="2.813" ry="3.75"/>
                    <circle cx="16.819" cy="26" r="1" fill="#fff"/>
                    <path fill="#fe9acc" d="M6.495,25.75c0,0,0.625,0.125,0.375,0.75c-0.111,0.278-0.296,0.654-0.468,0.987c2.344,2.028,4.718,2.763,4.718,2.763s-2.125-6.25-1.375-11S10.375,6.955,7.62,6.125C6.375,5.75,1.62,8,1.87,17.75c0.09,3.513,1.321,6.106,2.853,8H6.495z"/>
                    <path fill="#212121" d="M33.25,33.118c0,0,0.125,0.257-0.625,0.757c-0.5,0.375-4.563,1.743-8.563,1.618c-5.375,0-7.683-1.377-8.036-1.535c-0.341-0.155-0.588-0.365-0.756-0.554c-0.336-0.386-0.396-0.662-0.396-0.662s0.242,0.23,0.625,0.507c0.19,0.136,0.562,0.303,0.875,0.375C16.675,33.695,21.4,34.5,24,34.5c2.638,0.02,7.822-0.645,8.25-0.875C33,33.375,33.25,33.118,33.25,33.118z"/>
                    <path fill="#1853b2" d="M18.625,19.014c-0.017,0.047-0.724-0.59-1.5-0.639c-0.831-0.053-1.75,0.264-1.75,0.264s0.132-0.175,0.41-0.391c0.271-0.213,0.726-0.478,1.33-0.455c0.616,0.026,1.066,0.43,1.245,0.72C18.555,18.81,18.625,19.014,18.625,19.014z"/>
                    <path fill="#1853b2" d="M29.625,19.084c0.011,0.005,0.003-0.234,0.192-0.582c0.172-0.34,0.72-0.764,1.373-0.708c0.639,0.047,1.092,0.394,1.343,0.667c0.256,0.281,0.342,0.498,0.342,0.498s-0.901-0.675-1.625-0.584c-0.433-0.032-0.902,0.173-1.184,0.354c-0.131,0.095-0.249,0.179-0.319,0.25C29.67,19.045,29.625,19.084,29.625,19.084z"/>
                    <rect width="1" height="2.25" x="23.5" y="32.625" fill="#212121"/>
                    <path fill="#82cdec" d="M28.204,27.873c0-1.488-0.08-2.975,0-4.463c0.082-1.51,0.5-3.412,2.122-3.729c1.017-0.199,1.898-0.038,2.753,0.567c1.778,1.259,2.404,3.795,2.523,5.817c0.375,6.375-3.898,6.433-3.898,6.433S28.204,32.76,28.204,27.873z"/>
                    <ellipse cx="31.697" cy="27.747" fill="#212121" rx="2.813" ry="3.75"/>
                    <circle cx="31.259" cy="25.997" r="1" fill="#fff"/>
                  </svg>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", lineHeight: 1.3 }}>Pelúcias de Lilo & Stitch</span>
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => setStepIndex(stepIndex + 1)}
            disabled={!selectedAccessoryCategory}
            style={{ ...continueBtnStyle, opacity: selectedAccessoryCategory ? 1 : 0.5, cursor: selectedAccessoryCategory ? "pointer" : "not-allowed" }}
          >
            Continuar ➔
          </button>
        </div>
      )}

      {currentStepName === "accessory" && (
        <div>
          <h3 style={titleStyle}>
            {selectedAccessoryCategory === "miniatura-pokemon" || selectedAccessoryCategory === "miniatura-divertida" ? "Escolha a miniatura:" : "Escolha a pelúcia:"}
          </h3>
          {selectedAccessoryCategory !== "miniatura-pokemon" && selectedAccessoryCategory !== "miniatura-divertida" && (
            <p style={subtitleStyle}>OBS.: Todas as pelúcias têm aproximadamente 20cm.</p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {(selectedAccessoryCategory === "miniatura-pokemon"
              ? MINIATURA_OPTIONS
              : selectedAccessoryCategory === "miniatura-divertida"
                ? MINIATURA_DM_OPTIONS
                : selectedAccessoryCategory === "pelucia-stitch"
                  ? PELUCIA_STITCH_OPTIONS
                  : PELUCIA_POKEMON_OPTIONS
            ).map((opt) => {
              const outOfStock = isOutOfStock(opt);
              return (
                <button
                  key={opt}
                  onClick={() => !outOfStock && setSelectedAccessory(opt)}
                  disabled={outOfStock}
                  style={{
                    ...(selectedAccessory === opt ? typeCardSelectedStyle : typeCardStyle),
                    opacity: 1,
                    cursor: outOfStock ? "not-allowed" : "pointer",
                    position: "relative",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={ACCESSORY_IMAGE[opt]}
                      alt={opt}
                      style={{ width: "80px", height: "80px", flexShrink: 0, objectFit: "contain", opacity: outOfStock ? 0.45 : 1, filter: outOfStock ? "grayscale(1)" : "none" }}
                    />
                    {outOfStock && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", fontSize: "0.6rem", fontWeight: "900", color: "#dc3545", letterSpacing: "0.08em", textShadow: "0 0 4px rgba(255,255,255,0.8)" }}>ESGOTADO</div>
                    )}
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", lineHeight: 1.3 }}>{opt}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setStepIndex(stepIndex + 1)}
            disabled={!selectedAccessory}
            style={{ ...continueBtnStyle, opacity: selectedAccessory ? 1 : 0.5, cursor: selectedAccessory ? "pointer" : "not-allowed" }}
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
          {selectedSubtype === "Ovo de Colher de Guloseimas" && (
            <p style={{ margin: "0.75rem 0 0.25rem", fontSize: "0.82rem", color: "#7a5c3a", backgroundColor: "#fff9ee", border: "1px solid #e2b05b", borderRadius: "8px", padding: "0.55rem 0.75rem", lineHeight: 1.5 }}>
              <strong>OBS.:</strong> Os acompanhamentos deste ovo são os seguintes guloseimas: Balas Fini variadas; Disquete; Jujuba; Marshmallow; Tortuguita.
            </p>
          )}
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
          {selectedSubtype === "Ovo de Colher de Guloseimas" && (
            <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "#7a5c3a", backgroundColor: "#fff9ee", border: "1px solid #e2b05b", borderRadius: "8px", padding: "0.55rem 0.75rem", lineHeight: 1.5 }}>
              <strong>OBS.:</strong> Os acompanhamentos deste ovo são os seguintes guloseimas: Balas Fini variadas; Disquete; Jujuba; Marshmallow; Tortuguita.
            </p>
          )}
          <div style={gridStyle}>
            {currentKey && SIZES_BY_TYPE[currentKey]?.map((size) => {
              const priceForThisSize =
                currentKey && PRICES[currentKey]?.[size];
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
          {selectedSubtype === "Ovo de Colher de Guloseimas" && (
            <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "#7a5c3a", backgroundColor: "#fff9ee", border: "1px solid #e2b05b", borderRadius: "8px", padding: "0.55rem 0.75rem", lineHeight: 1.5 }}>
              <strong>OBS.:</strong> Os acompanhamentos deste ovo são os seguintes guloseimas: Balas Fini variadas; Disquete; Jujuba; Marshmallow; Tortuguita.
            </p>
          )}
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
          {selectedSubtype === "Ovo de Colher de Guloseimas" && (
            <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "#7a5c3a", backgroundColor: "#fff9ee", border: "1px solid #e2b05b", borderRadius: "8px", padding: "0.55rem 0.75rem", lineHeight: 1.5 }}>
              <strong>OBS.:</strong> Os acompanhamentos deste ovo são as seguintes guloseimas: Balas Fini variadas; Disquete; Jujuba; Marshmallow; Tortuguita.
            </p>
          )}
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
              const addPrice = selectedType === "Mini Ovos" ? 4.0 : (ADDITIONALS_PRICES[opt] || 0);
              const priceStr = `+ R$ ${addPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
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
                {selectedSubtype || (selectedType === "Ovo Simples" ? selectedSimpleStyle : null) || selectedType}
                {selectedSize ? ` (${selectedSize})` : ""}
              </span>
              <span style={{ color: "#e2b05b", fontWeight: "bold", fontSize: "1rem" }}>
                {formattedCurrentPrice}
              </span>
            </div>

            {/* Detalhes */}
            <div style={{ padding: "0.25rem 0" }}>
            {/* Acessório widget */}
            {accessoryEditMode === "category" ? (
              <div style={{ padding: "0.5rem 1.2rem 1rem", borderBottom: "1px solid #f0ebe0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                  <span style={summaryLabelStyle}>Escolha a coleção</span>
                  <button onClick={() => setAccessoryEditMode(null)} style={{ background: "none", border: "none", color: "#999", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600" }}>✕ Cancelar</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {(selectedSimpleStyle === "Ovo Simples com Miniatura"
                    ? [{ label: "Miniaturas de Pokémon", cat: "miniatura-pokemon", icon: "pikachu", disabled: false }, { label: "Miniaturas Divertida Mente", cat: "miniatura-divertida", icon: "dm", disabled: false }]
                    : selectedSimpleStyle === "Ovo Simples com Pelúcia"
                      ? [{ label: "Pelúcias Pokémon", cat: "pelucia-pokemon", icon: "pikachu", disabled: false }, { label: "Pelúcias Lilo & Stitch", cat: "pelucia-stitch", icon: "stitch", disabled: false }]
                      : [{ label: "Miniaturas Pokémon", cat: "miniatura-pokemon", icon: "pikachu", disabled: false }, { label: "Pelúcias Pokémon", cat: "pelucia-pokemon", icon: "pikachu", disabled: false }, { label: "Pelúcias Lilo & Stitch", cat: "pelucia-stitch", icon: "stitch", disabled: false }, { label: "Miniaturas Divertida Mente", cat: "miniatura-divertida", icon: "dm", disabled: false }]
                  ).map((opt) => (
                    <button
                      key={opt.cat || opt.label}
                      disabled={opt.disabled}
                      onClick={() => { if (!opt.disabled && opt.cat) { setSelectedAccessory(null); setSelectedAccessoryCategory(opt.cat); setAccessoryEditMode("item"); } }}
                      style={{ ...typeCardStyle, minHeight: "auto", padding: "0.5rem 0.4rem", opacity: opt.disabled ? 0.45 : 1, cursor: opt.disabled ? "not-allowed" : "pointer", ...(selectedAccessoryCategory === opt.cat && opt.cat ? { backgroundColor: "#fff9f0", border: "2px solid #e2b05b" } : {}) }}
                    >
                      {opt.icon === "dm" && <img src="/miniaturas/divertida_mente/alegria.png" alt="Divertida Mente" style={{ width: "36px", height: "36px", objectFit: "contain" }} />}
                      {opt.icon === "pikachu" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48">
                          <path fill="#fbd12c" d="M 13 20 L 5 5 A 2 2 0 0 1 8 4 L 21 15 Z" /><path fill="#212121" d="M 8.5 11 L 5 5 A 2 2 0 0 1 8 4 L 12.5 8 Z" />
                          <path fill="#fbd12c" d="M 35 20 L 43 5 A 2 2 0 0 0 40 4 L 27 15 Z" /><path fill="#212121" d="M 39.5 11 L 43 5 A 2 2 0 0 0 40 4 L 35.5 8 Z" />
                          <ellipse cx="24" cy="27" rx="15" ry="14" fill="#fbd12c"/>
                          <circle cx="11.5" cy="30" r="3.5" fill="#ee2222"/><circle cx="36.5" cy="30" r="3.5" fill="#ee2222"/>
                          <ellipse cx="17" cy="24" rx="2.5" ry="3.5" fill="#212121"/><circle cx="17.5" cy="22.5" r="1.2" fill="#fff"/>
                          <ellipse cx="31" cy="24" rx="2.5" ry="3.5" fill="#212121"/><circle cx="30.5" cy="22.5" r="1.2" fill="#fff"/>
                          <polygon points="24,28.5 23.2,29.5 24.8,29.5" fill="#212121"/>
                          <path fill="none" stroke="#212121" strokeWidth="1.2" strokeLinecap="round" d="M 20 31.5 C 20 31.5, 22 33, 24 31.5 C 24 31.5, 26 33, 28 31.5" />
                        </svg>
                      )}
                      {opt.icon === "stitch" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48">
                          <path fill="#3a8ad3" d="M23.97,37c3.002-0.007,8.026-0.125,11.466-4.052c2.269-2.59,2.42-9.412-1.911-13.554c-1.855-1.773-3.44-3.603-9.555-3.765c-4.331-0.114-7.7,2.028-9.555,3.801c-4.331,4.141-4.037,10.849-1.911,13.554C15.562,36.875,20.971,37.007,23.97,37z"/>
                          <path fill="#3a8ad3" d="M35.865,31.75c0,0-0.25-10.75,2.625-12.5L40.25,26l1.625,1.625C41.875,27.625,40.615,30.875,35.865,31.75z"/>
                          <path fill="#fe9acc" d="M41.74,25.75c0,0-0.625,0.125-0.375,0.75c0.111,0.278,0.296,0.654,0.468,0.987c-2.344,2.028-4.718,2.763-4.718,2.763s2.125-6.25,1.375-11S37.86,6.955,40.615,6.125c1.245-0.375,6,1.875,5.75,11.625c-0.09,3.513-1.321,6.106-2.853,8H41.74z"/>
                          <path fill="#3a8ad3" d="M12.37,31.75c0,0,0.25-10.75-2.625-12.5L8,24.75L6.375,27.5C6.375,27.5,7.62,30.875,12.37,31.75z"/>
                          <path fill="#fe9acc" d="M6.495,25.75c0,0,0.625,0.125,0.375,0.75c-0.111,0.278-0.296,0.654-0.468,0.987c2.344,2.028,4.718,2.763,4.718,2.763s-2.125-6.25-1.375-11S10.375,6.955,7.62,6.125C6.375,5.75,1.62,8,1.87,17.75c0.09,3.513,1.321,6.106,2.853,8H6.495z"/>
                          <path fill="#82cdec" d="M19.875,27.875c0-1.488,0.08-2.975,0-4.463c-0.082-1.51-0.5-3.412-2.122-3.729c-1.017-0.199-1.898-0.038-2.753,0.567c-1.778,1.259-2.404,3.795-2.523,5.817c-0.375,6.375,3.898,6.433,3.898,6.433S19.875,32.762,19.875,27.875z"/>
                          <path fill="#82cdec" d="M28.204,27.873c0-1.488-0.08-2.975,0-4.463c0.082-1.51,0.5-3.412,2.122-3.729c1.017-0.199,1.898-0.038,2.753,0.567c1.778,1.259,2.404,3.795,2.523,5.817c0.375,6.375-3.898,6.433-3.898,6.433S28.204,32.76,28.204,27.873z"/>
                          <path fill="#1853b2" d="M26.659,25.084c0,0-1.247-0.496-2.659-0.459c-1.412-0.015-2.659,0.5-2.659,0.5s0.206-0.258,0.654-0.55c0.441-0.292,1.16-0.593,1.996-0.597c0.836-0.011,1.559,0.282,2.005,0.566C26.449,24.83,26.659,25.084,26.659,25.084z"/>
                          <ellipse cx="24" cy="29.438" fill="#212121" rx="3.625" ry="3.567"/>
                          <ellipse cx="16.382" cy="27.75" fill="#212121" rx="2.813" ry="3.75"/><circle cx="16.819" cy="26" r="1" fill="#fff"/>
                          <path fill="#212121" d="M33.25,33.118c0,0,0.125,0.257-0.625,0.757c-0.5,0.375-4.563,1.743-8.563,1.618c-5.375,0-7.683-1.377-8.036-1.535c-0.341-0.155-0.588-0.365-0.756-0.554c-0.336-0.386-0.396-0.662-0.396-0.662s0.242,0.23,0.625,0.507c0.19,0.136,0.562,0.303,0.875,0.375C16.675,33.695,21.4,34.5,24,34.5c2.638,0.02,7.822-0.645,8.25-0.875C33,33.375,33.25,33.118,33.25,33.118z"/>
                          <path fill="#1853b2" d="M18.625,19.014c-0.017,0.047-0.724-0.59-1.5-0.639c-0.831-0.053-1.75,0.264-1.75,0.264s0.132-0.175,0.41-0.391c0.271-0.213,0.726-0.478,1.33-0.455c0.616,0.026,1.066,0.43,1.245,0.72C18.555,18.81,18.625,19.014,18.625,19.014z"/>
                          <path fill="#1853b2" d="M29.625,19.084c0.011,0.005,0.003-0.234,0.192-0.582c0.172-0.34,0.72-0.764,1.373-0.708c0.639,0.047,1.092,0.394,1.343,0.667c0.256,0.281,0.342,0.498,0.342,0.498s-0.901-0.675-1.625-0.584c-0.433-0.032-0.902,0.173-1.184,0.354c-0.131,0.095-0.249,0.179-0.319,0.25C29.67,19.045,29.625,19.084,29.625,19.084z"/>
                          <rect width="1" height="2.25" x="23.5" y="32.625" fill="#212121"/>
                          <ellipse cx="31.697" cy="27.747" fill="#212121" rx="2.813" ry="3.75"/><circle cx="31.259" cy="25.997" r="1" fill="#fff"/>
                        </svg>
                      )}
                      <span style={{ fontSize: "0.72rem", fontWeight: "700", lineHeight: 1.2, textAlign: "center" }}>{opt.label}</span>
                      {opt.disabled && <span style={{ fontSize: "0.65rem", color: "#b8895a", fontWeight: "600" }}>Em breve</span>}
                    </button>
                  ))}
                </div>
              </div>
            ) : accessoryEditMode === "item" ? (
              <div style={{ padding: "0.5rem 1.2rem 1rem", borderBottom: "1px solid #f0ebe0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                  <button onClick={() => setAccessoryEditMode("category")} style={{ background: "none", border: "none", color: "#666", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600" }}>← Voltar</button>
                  <button onClick={() => setAccessoryEditMode(null)} style={{ background: "none", border: "none", color: "#999", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600" }}>✕ Cancelar</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {(selectedAccessoryCategory === "miniatura-pokemon"
                    ? MINIATURA_OPTIONS
                    : selectedAccessoryCategory === "miniatura-divertida"
                      ? MINIATURA_DM_OPTIONS
                      : selectedAccessoryCategory === "pelucia-stitch"
                        ? PELUCIA_STITCH_OPTIONS
                        : PELUCIA_POKEMON_OPTIONS
                  ).map((opt) => {
                    const p = getAccessoryPrice(opt);
                    const pStr = p === 0 ? "Incluso" : p > 0
                      ? `+${p.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`
                      : p.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                    const outOfStock = isOutOfStock(opt);
                    return (
                      <button
                        key={opt}
                        disabled={outOfStock}
                        onClick={() => { if (!outOfStock) { setSelectedAccessory(opt); setAccessoryEditMode(null); } }}
                        style={{ ...typeCardStyle, minHeight: "auto", padding: "0.5rem", opacity: 1, cursor: outOfStock ? "not-allowed" : "pointer", ...(selectedAccessory === opt ? { backgroundColor: "#fff9f0", border: "2px solid #e2b05b" } : {}) }}
                      >
                        <div style={{ position: "relative" }}>
                          <img src={ACCESSORY_IMAGE[opt]} alt={opt} style={{ width: "56px", height: "56px", objectFit: "contain", opacity: outOfStock ? 0.45 : 1, filter: outOfStock ? "grayscale(1)" : "none" }} />
                          {outOfStock && (
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", fontSize: "0.55rem", fontWeight: "900", color: "#dc3545", letterSpacing: "0.08em", textShadow: "0 0 4px rgba(255,255,255,0.8)" }}>ESGOTADO</div>
                          )}
                        </div>
                        <span style={{ fontSize: "0.72rem", fontWeight: "700", lineHeight: 1.2, textAlign: "center" }}>{opt}</span>
                        <span style={{ fontSize: "0.7rem", fontWeight: "700", color: outOfStock ? "#dc3545" : p < 0 ? "#4caf50" : p === 0 ? "#aaa" : "#e2b05b" }}>{outOfStock ? "Esgotado" : pStr}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ ...summaryRowStyle }}>
                <span style={summaryLabelStyle}>Acessório</span>
                {selectedAccessory ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <img src={ACCESSORY_IMAGE[selectedAccessory]} alt={selectedAccessory} style={{ width: "42px", height: "42px", objectFit: "contain" }} />
                      <span style={summaryValueStyle}>{selectedAccessory}</span>
                    </div>
                    {(() => { const p = getAccessoryPrice(selectedAccessory); const s = p === 0 ? "Incluso" : p > 0 ? `+${p.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}` : p.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); return <span style={{ fontSize: "0.75rem", color: p < 0 ? "#4caf50" : p === 0 ? "#aaa" : "#e2b05b", fontWeight: "700" }}>{s}</span>; })()}
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => setAccessoryEditMode("category")} style={{ background: "none", border: "1px solid #e8dfce", borderRadius: "6px", padding: "0.2rem 0.6rem", fontSize: "0.75rem", color: "#2d1e17", cursor: "pointer", fontWeight: "600" }}>✏ Trocar</button>
                      {selectedSimpleStyle !== "Ovo Simples com Miniatura" && selectedSimpleStyle !== "Ovo Simples com Pelúcia" && (
                        <button onClick={() => { setSelectedAccessory(null); setSelectedAccessoryCategory(null); }} style={{ background: "none", border: "1px solid #e8dfce", borderRadius: "6px", padding: "0.2rem 0.6rem", fontSize: "0.75rem", color: "#cc3333", cursor: "pointer", fontWeight: "600" }}>✕ Remover</button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ ...summaryValueStyle, color: "#bbb" }}>Nenhum</span>
                    <button onClick={() => setAccessoryEditMode("category")} style={{ background: "none", border: "1px solid #e2b05b", borderRadius: "6px", padding: "0.2rem 0.75rem", fontSize: "0.75rem", color: "#b8895a", cursor: "pointer", fontWeight: "700" }}>+ Adicionar</button>
                  </div>
                )}
              </div>
            )}
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

          <textarea
            value={obsNote}
            onChange={(e) => setObsNote(e.target.value)}
            placeholder="Alguma observação sobre este ovo? (opcional)"
            rows={2}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "1px solid #e8dfce",
              fontSize: "0.9rem",
              color: "#2d1e17",
              backgroundColor: "rgba(255,255,255,0.8)",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              marginBottom: "1rem",
              boxSizing: "border-box",
            }}
          />

          {selectedSubtype === "Ovo de Colher de Guloseimas" && (
            <p style={{ margin: "0 0 1rem", fontSize: "0.82rem", color: "#7a5c3a", backgroundColor: "#fff9ee", border: "1px solid #e2b05b", borderRadius: "8px", padding: "0.55rem 0.75rem", lineHeight: 1.5 }}>
              <strong>OBS.:</strong> Os acompanhamentos deste ovo são as seguintes guloseimas: Balas Fini variadas; Disquete; Jujuba; Marshmallow; Tortuguita.
            </p>
          )}

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
        </div>
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "0.75rem",
};
const titleStyle = { color: "#2d1e17", marginTop: 0, marginBottom: "1.5rem" };
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

const typeCardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
  padding: "0.9rem 0.75rem 0.85rem",
  backgroundColor: "rgba(255,255,255,0.75)",
  border: "1.5px solid #e8dfce",
  borderRadius: "14px",
  cursor: "pointer",
  color: "#2d1e17",
  textAlign: "center",
  transition: "border-color 0.2s, background-color 0.2s, box-shadow 0.2s, transform 0.15s",
  boxShadow: "0 2px 6px rgba(45,30,23,0.07)",
  minHeight: "130px",
};

const typeCardSelectedStyle: React.CSSProperties = {
  ...typeCardStyle,
  backgroundColor: "#fff9f0",
  border: "2px solid #e2b05b",
  boxShadow: "0 4px 16px rgba(226,176,91,0.28)",
  transform: "translateY(-2px)",
};
