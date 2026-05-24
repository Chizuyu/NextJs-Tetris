export const THEMES = {
  midnight: {
    name: "Midnight",
    bg: "bg-slate-950",
    board: "border-slate-700 bg-slate-900",
    text: "text-blue-500",
    accent: "bg-blue-600",
    gridBorder: "border-slate-800/30",
    infoText: "text-slate-500",
    keyText: "text-slate-300",
    infoBorder: "border-slate-800"
  },
  neon: {
    name: "Neon Party",
    bg: "bg-black",
    board: "border-pink-500 bg-zinc-900 shadow-[0_0_20px_rgba(236,72,153,0.3)]",
    text: "text-pink-500 shadow-pink-500",
    accent: "bg-pink-500",
    gridBorder: "border-pink-500/10",
    infoText: "text-pink-900",
    keyText: "text-pink-400",
    infoBorder: "border-pink-900"
  },
  retro: {
    name: "Gameboy",
    bg: "bg-stone-300",
    board: "border-stone-600 bg-stone-400",
    text: "text-stone-800",
    accent: "bg-stone-700",
    gridBorder: "border-stone-500/50",
    infoText: "text-stone-600",
    keyText: "text-stone-900",
    infoBorder: "border-stone-500"
  }
};

export type ThemeKey = keyof typeof THEMES;