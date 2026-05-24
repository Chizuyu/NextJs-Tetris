export const COLS = 10;
export const ROWS = 20;

export const TETROMINOS = {
  "0" : { shape: [[0]], color: "bg-transparent" }, // Kosong
  I: { shape: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]], color: "bg-cyan-400" },
  J: { shape: [[0, 1, 0], [0, 1, 0], [1, 1, 0]], color: "bg-blue-500" },
  L: { shape: [[0, 1, 0], [0, 1, 0], [0, 1, 1]], color: "bg-orange-500" },
  O: { shape: [[1, 1], [1, 1]], color: "bg-yellow-400" },
  S: { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: "bg-green-500" },
  T: { shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], color: "bg-purple-500" },
  Z: { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: "bg-red-500" },
};

export type TETROMINO_KEYS = keyof typeof TETROMINOS;

let bag: string[] = [];

export const getRandomTetromino = () => {
  const shapes = ["I", "J", "L", "O", "S", "T", "Z"];
  
  if (bag.length === 0) {
    bag = [...shapes].sort(() => Math.random() - 0.5);
  }
  
  const type = bag.pop() as keyof typeof TETROMINOS;
  return { ...TETROMINOS[type], type };
};