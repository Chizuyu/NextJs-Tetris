"use client";
import { useTetris } from "@/hooks/useTetris";
import { TETROMINOS, COLS } from "@/constants";
import { THEMES, ThemeKey } from "../themes";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    <main className={`flex flex-col items-center justify-center min-h-screen ${theme.bg} transition-colors duration-500 p-4 relative overflow-hidden`}>

      {/* TEMA SWITCHER - Pojok Kanan Atas yang Rapi */}
      <div className="absolute top-8 right-8 flex bg-black/30 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl">
        {(Object.keys(THEMES) as ThemeKey[]).map((t) => (
          <button
            key={t}
            onClick={() => setCurrentTheme(t)}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all duration-300 ${currentTheme === t
              ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-100"
              : "text-white/40 hover:text-white/80 scale-95"
              }`}
          >
            {THEMES[t].name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* HEADER - Tetap di Tengah */}
      <header className="text-center mb-8">
        <h1 className={`text-6xl font-black tracking-tighter ${theme.text} italic drop-shadow-2xl`}>
          TETRIS
        </h1>
      </header>

      {/* GAME AREA - Menggunakan Grid 3 Kolom untuk Menjaga Board di Tengah */}
      <div className="flex flex-col lg:grid lg:grid-cols-[200px_320px_200px] gap-6 lg:gap-12 items-center lg:items-start justify-center w-full max-w-5xl">

        {/* KOLOM KIRI: Sidebar Info */}
        <aside className="flex flex-row lg:flex-col gap-4 lg:gap-5 w-full lg:w-auto justify-center lg:justify-start order-2 lg:order-1">
          {/* Score Card */}
          <div className="flex-1 lg:flex-none bg-slate-900/40 backdrop-blur-md p-3 lg:p-5 rounded-2xl lg:rounded-3xl border border-white/5 shadow-xl">
            <p className="text-[8px] lg:text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Score</p>
            <AnimatedScore value={score} />
          </div>

          {/* Next Piece Card */}
          <div className="flex-1 lg:flex-none bg-slate-900/40 backdrop-blur-md p-3 lg:p-5 rounded-2xl lg:rounded-3xl border border-white/5 shadow-xl text-center">
            <p className="text-[8px] lg:text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Next</p>
            <div className="flex justify-center items-center h-12 lg:h-20">
              <div className="grid" style={{ gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)` }}>
                {nextPiece.shape.map((row, y) =>
                  row.map((val, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`w-6 h-6 rounded-sm m-[1px] transition-colors duration-500 ${val !== 0 ? nextPiece.color : "bg-transparent"}`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Controls Card */}
          <div className={`p-5 rounded-3xl border ${theme.infoBorder} bg-black/20 backdrop-blur-sm`}>
            <div className={`flex flex-col gap-3 ${theme.infoText} text-[10px] font-bold uppercase`}>
              <div className="flex justify-between items-center opacity-70">
                <span>Rotate</span>
                <span className="bg-white/10 px-2 py-1 rounded-lg text-white">↑</span>
              </div>
              <div className="flex justify-between items-center opacity-70">
                <span>Move</span>
                <span className="bg-white/10 px-2 py-1 rounded-lg text-white">← →</span>
              </div>
              <div className="flex justify-between items-center opacity-70">
                <span>Drop</span>
                <span className="bg-white/10 px-2 py-1 rounded-lg text-white text-[8px]">SPACE</span>
              </div>
            </div>
          </div>

          {/* Play/Restart Button */}
          <button onClick={startGame} className="hidden lg:block w-full py-4 rounded-2xl bg-blue-600 ...">
            {gameOver ? "Retry" : "Play"}
          </button>
        </aside>

        {/* KOLOM TENGAH: Board Utama */}
        <section
          className={`relative grid border-[4px] lg:border-[8px] shadow-2xl transition-all rounded-xl overflow-hidden order-1 lg:order-2 ${theme.board}`}
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            width: "min(90vw, 300px)",
            height: "min(140vw, 600px)"
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
                  layout // MEMBUAT BARIS SLIDE KE BAWAH SAAT CLEAR
                  initial={false}
                  animate={{
                    // EFEK BOUNCE: Balok sedikit membesar saat terisi
                    scale: cell !== "0" || isCurrent ? 1 : 0.98,
                    opacity: isGhost && !isCurrent ? 0.1 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className={`relative border-[0.5px] border-white/5 ${colorClass}`}
                >
                  {/* EFEK GLOW UNTUK THEME NEON */}
                  {(isCurrent || cell !== "0") && currentTheme === "neon" && (
                    <div className="absolute inset-0 blur-[4px] bg-inherit opacity-50" />
                  )}
                </motion.div>
              );
            })
          )}

          {/* Overlay Game Over */}
          {gameOver && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
              <h2 className="text-4xl font-black text-red-500 italic mb-4">GAME OVER</h2>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
              >
                TRY AGAIN
              </button>
            </div>
          )}
        </section>

        {/* VIRTUAL CONTROLLER - Hanya muncul di Mobile (lg:hidden) */}
        <div className="grid grid-cols-3 gap-3 mt-6 lg:hidden order-3 w-full max-w-[300px]">
          <div />
          <button
            onPointerDown={rotate}
            className="h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl active:bg-white/30"
          >
            <span className="mb-1">↑</span>
          </button>
          <div />

          <button
            onPointerDown={() => move(-1, 0)}
            className="h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl active:bg-white/30"
          >
            ←
          </button>
          <button
            onPointerDown={() => move(0, 1)}
            className="h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl active:bg-white/30"
          >
            ↓
          </button>
          <button
            onPointerDown={() => move(1, 0)}
            className="h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl active:bg-white/30"
          >
            →
          </button>

          <button
            onPointerDown={hardDrop}
            className="col-span-3 h-14 rounded-2xl bg-blue-600/50 backdrop-blur-md flex items-center justify-center font-black text-xs tracking-[0.3em] active:bg-blue-500"
          >
            HARD DROP (SPACE)
          </button>

          <button
            onClick={startGame}
            className="col-span-3 h-14 rounded-2xl bg-slate-700 font-black text-xs tracking-[0.3em]"
          >
            {gameOver ? "RETRY" : isPlaying ? "RESTART" : "PLAY"}
          </button>
        </div>

        {/* KOLOM KANAN: Elemen Penyeimbang (Kosong agar Board tetap di tengah) */}
        <div className="w-full pointer-events-none hidden lg:block" aria-hidden="true" />
      </div>

    </main>
  );
}