"use client";
import { useTetris } from "@/hooks/useTetris";
import { TETROMINOS, COLS } from "@/constants";
import { THEMES, ThemeKey } from "../themes";
import { useState, useEffect } from "react";
import { motion, px } from "framer-motion";

function AnimatedScore({ value }: { value: number }) {
  return (
    <motion.p
      key={value} // Penting: key berubah memicu re-render animasi
      initial={{ scale: 1.5, color: "#fbbf24" }}
      animate={{ scale: 1, color: "#facc15" }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      className="text-4xl font-mono text-yellow-400 tabular-nums"
    >
      {value}
    </motion.p>
  );
}

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("midnight");
  const theme = THEMES[currentTheme];
  const { grid, activePiece, nextPiece, move, rotate, hardDrop, gameOver, score, startGame, isPlaying, getGhostPos } = useTetris();

  const ghostY = getGhostPos();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keysToBlock = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];

      if (keysToBlock.includes(e.key)) {
        e.preventDefault();
      }

      if (e.key.toLowerCase() === "r") {
        startGame();
        return;
      }

      if (e.key.toLowerCase() === "r") {
        startGame();
        return;
      }
      if (!isPlaying || gameOver) return;
      if (e.key === "ArrowLeft") move(-1, 0);
      if (e.key === "ArrowRight") move(1, 0);
      if (e.key === "ArrowDown") move(0, 1);
      if (e.key === "ArrowUp") rotate();
      if (e.key === " ") {
        e.preventDefault();
        hardDrop();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move, rotate, hardDrop, isPlaying, gameOver, startGame]);

  return (
    <main className={`flex flex-col items-center justify-start min-h-screen ${theme.bg} transition-colors duration-500 p-2 md:p-4`}>

      {/* TEMA SWITCHER - Pojok Kanan Atas yang Rapi */}
      <div className="w-full max-w-[800px] flex justify-end mb-1">
        <div className="flex bg-black/30 backdrop-blur-xl p-1 rounded-xl border border-white/10">
          {(Object.keys(THEMES) as ThemeKey[]).map((t) => (
            <button
              key={t}
              onClick={() => setCurrentTheme(t)}
              className={`px-3 py-1 text-[9px] font-black rounded-lg transition-all ${currentTheme === t ? "bg-white text-black" : "text-white/40"}`}
            >
              {THEMES[t].name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* HEADER - Tetap di Tengah */}
      <header className="text-center mb-1 md:mb-4">
        <h1 className={`text-2xl md:text-6xl font-black tracking-tighter ${theme.text} italic leading-none`}>
          TETRIS
        </h1>
      </header>

      {/* GAME AREA - Menggunakan Grid 3 Kolom untuk Menjaga Board di Tengah */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px_1fr] gap-2 lg:gap-12 items-center justify-center w-full max-w-7xl">

        {/* KOLOM KIRI: Sidebar Info */}
        <aside className="flex flex-row lg:flex-col gap-2 w-full lg:w-[220px] justify-center order-2 lg:order-1 px-2">
          {/* Score Card */}
          <div className="flex-1 lg:flex-none bg-slate-900/40 backdrop-blur-md p-2 lg:p-5 rounded-xl border border-white/5 shadow-lg">
            <p className="text-[8px] lg:text-[10px] text-slate-500 uppercase font-black mb-1">Score</p>
            <div className="scale-75 lg:scale-100 origin-left">
              <AnimatedScore value={score} />
            </div>
          </div>

          {/* Next Piece Card */}
          <div className="flex-1 lg:flex-none bg-slate-900/40 backdrop-blur-md p-2 lg:p-5 rounded-xl border border-white/5 shadow-lg flex flex-col items-center">
            <p className="text-[8px] lg:text-[10px] text-slate-500 uppercase font-black mb-1">Next</p>
            <div className="flex justify-center items-center h-8 lg:h-20">
              <div className="grid scale-[0.5] lg:scale-100" style={{ gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)` }}>
                {nextPiece.shape.map((row, y) =>
                  row.map((val, x) => (
                    <div key={`${x}-${y}`} className={`w-5 h-5 rounded-sm m-[1px] ${val !== 0 ? nextPiece.color : "bg-transparent"}`} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Controls Card */}
          <div className="hidden lg:block p-5 rounded-3xl border border-white/5 bg-black/20">
            <div className={`flex flex-col gap-3 ${theme.infoText} text-[10px] font-bold uppercase`}>
              <div className="flex justify-between items-center opacity-70"><span>Rotate</span><span className="bg-white/10 px-2 py-1 rounded-lg text-white">↑</span></div>
              <div className="flex justify-between items-center opacity-70"><span>Move</span><span className="bg-white/10 px-2 py-1 rounded-lg text-white">← →</span></div>
              <div className="flex justify-between items-center opacity-70"><span>Drop</span><span className="bg-white/10 px-2 py-1 rounded-lg text-white text-[8px]">SPACE</span></div>
            </div>
          </div>

          {/* Play/Restart Button */}
          <button onClick={startGame} className="hidden lg:block w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl">
            {gameOver ? "Retry" : isPlaying ? "Restart" : "Play"}
          </button>
        </aside>

        {/* KOLOM TENGAH: Board Utama */}
        <section
          className={`relative grid border-[4px] lg:border-[8px] shadow-2xl rounded-xl overflow-hidden order-1 lg:order-2 justify-self-center ${theme.board} w-[210px] lg:w-[320px]`}
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            aspectRatio: "1 / 2",
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => {
              const { pos, shape, type } = activePiece;

              let isCurrent = false;
              if (y >= pos.y && y < pos.y + shape.length && x >= pos.x && x < pos.x + shape[0].length) {
                if (shape[y - pos.y][x - pos.x] !== 0) isCurrent = true;
              }
              let isGhost = false;
              if (y >= ghostY && y < ghostY + shape.length && x >= pos.x && x < pos.x + shape[0].length) {
                if (shape[y - ghostY][x - pos.x] !== 0) isGhost = true;
              }

              let colorClass = "bg-transparent";
              if (isCurrent) colorClass = TETROMINOS[type as keyof typeof TETROMINOS].color;
              else if (isGhost && isPlaying) colorClass = TETROMINOS[type as keyof typeof TETROMINOS].color;
              else if (cell !== "0") colorClass = TETROMINOS[cell as keyof typeof TETROMINOS].color;

              return (
                <motion.div
                  key={`${x}-${y}`}
                  className={`relative border-[0.1px] border-white/5 ${colorClass} ${isGhost && !isCurrent ? "opacity-10" : ""}`}
                  style={{ aspectRatio: "1 / 1" }}
                >
                  {(isCurrent || cell !== "0") && currentTheme === "neon" && (
                    <div className="absolute inset-0 blur-[4px] bg-inherit opacity-50" />
                  )}
                </motion.div>
              );
            })
          )}

          {/* Overlay Game Over */}
          {gameOver && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
              <h2 className="text-2xl font-black text-red-500 italic mb-4">GAME OVER</h2>
              <button onClick={startGame} className="px-6 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                TRY AGAIN
              </button>
            </div>
          )}
        </section>

        {/* VIRTUAL CONTROLLER - Hanya muncul di Mobile (lg:hidden) */}
        <div className="grid grid-cols-3 gap-1.5 mt-2 lg:hidden order-3 w-full max-w-[260px] pb-4">
          <div />
          <button onPointerDown={rotate} className="h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg active:bg-white/30">↑</button>
          <div />

          <button onPointerDown={() => move(-1, 0)} className="h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg active:bg-white/30">←</button>
          <button onPointerDown={() => move(0, 1)} className="h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg active:bg-white/30">↓</button>
          <button onPointerDown={() => move(1, 0)} className="h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg active:bg-white/30">→</button>

          <button onPointerDown={hardDrop} className="col-span-2 h-10 rounded-xl bg-blue-600/50 flex items-center justify-center font-black text-[9px] tracking-widest active:bg-blue-500 uppercase">Hard Drop</button>
          <button onClick={startGame} className="h-10 rounded-xl bg-slate-700 font-black text-[9px] uppercase">
            {isPlaying ? "Restart" : "Play"}
          </button>
        </div>

        <div className="hidden lg:block order-3 w-[220px]" />

        {/* KOLOM KANAN: Elemen Penyeimbang (Kosong agar Board tetap di tengah) */}
        <div className="hidden lg:block order-3 w-[220px]" />
      </div>

    </main>
  );
}