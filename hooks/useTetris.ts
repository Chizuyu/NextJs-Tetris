import { useState, useEffect, useCallback } from "react";
import { COLS, ROWS, getRandomTetromino, TETROMINOS } from "@/constants";

export const useTetris = () => {
    const [grid, setGrid] = useState<string[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill("0")));
    const [activePiece, setActivePiece] = useState({ pos: { x: 3, y: 0 }, ...getRandomTetromino() });
    const [isPaused, setIsPaused] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);


    const togglePause = useCallback(() => {
        if (!gameOver && isPlaying) {
            setIsPaused((prev) => !prev);
        }
    }, [gameOver, isPlaying]);

    // Fitur: Next Piece Queue
    const [nextPiece, setNextPiece] = useState(getRandomTetromino());

    // Fitur: Memutar suara
    const playSound = (file: string) => {
        const audio = new Audio(`/sounds/${file}`);
        audio.volume = 0.3; // Atur volume (0.0 sampai 1.0)
        audio.play().catch(() => { }); // Catch error jika autoplay diblokir browser
    };


    const startGame = useCallback(() => {
        setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill("0")));
        setScore(0);
        setGameOver(false);
        const firstPiece = getRandomTetromino();
        const secondPiece = getRandomTetromino();
        setActivePiece({ pos: { x: 3, y: 0 }, ...firstPiece });
        setNextPiece(secondPiece);
        setIsPlaying(true);
    }, []);

    const checkCollision = useCallback((nx: number, ny: number, shape: number[][]) => {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const newX = x + nx;
                    const newY = y + ny;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || (grid[newY] && grid[newY][newX] !== "0")) {
                        return true;
                    }
                }
            }
        }
        return false;
    }, [grid]);

    const getGhostPos = useCallback(() => {
        let ghostY = activePiece.pos.y;
        while (!checkCollision(activePiece.pos.x, ghostY + 1, activePiece.shape)) {
            ghostY++;
        }
        return ghostY;
    }, [activePiece, checkCollision]);

    const lockPiece = useCallback((overridePos?: { x: number; y: number }) => {
        const targetPos = overridePos || activePiece.pos;

        setGrid((prevGrid) => {
            const newGrid = [...prevGrid.map((row) => [...row])];
            activePiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        const gridY = y + targetPos.y;
                        const gridX = x + targetPos.x;
                        if (gridY >= 0 && gridY < ROWS) newGrid[gridY][gridX] = activePiece.type;
                    }
                });
            });

            // Line clearing
            const filteredGrid = newGrid.filter((row) => row.some((cell) => cell === "0"));
            const numCleared = ROWS - filteredGrid.length;
            if (numCleared > 0) {
                setScore((s) => s + [0, 100, 300, 500, 800][numCleared]);
                playSound('clear.mp3');
                const blankRows = Array.from({ length: numCleared }, () => Array(COLS).fill("0"));
                return [...blankRows, ...filteredGrid];
            }
            return newGrid;
        });

        // Spawn Next Piece
        setActivePiece({ pos: { x: 3, y: 0 }, ...nextPiece });
        setNextPiece(getRandomTetromino());

        if (checkCollision(3, 0, nextPiece.shape)) {
            setGameOver(true);
            setIsPlaying(false);
            playSound('gameover.mp3');
        }
    }, [activePiece, nextPiece, checkCollision]);


    const move = useCallback((dirX: number, dirY: number) => {
        if (!isPlaying || gameOver) return;
        if (!checkCollision(activePiece.pos.x + dirX, activePiece.pos.y + dirY, activePiece.shape)) {
            setActivePiece((prev) => ({ ...prev, pos: { x: prev.pos.x + dirX, y: prev.pos.y + dirY } }));

            // Suara Gerak (hanya jika gerak horizontal)
            if (dirX !== 0) playSound('move.mp3');
        } else if (dirY > 0) {
            lockPiece();
        }
    }, [activePiece, checkCollision, lockPiece, isPlaying, gameOver]);

    // Fitur: Hard Drop
    const hardDrop = useCallback(() => {
        if (!isPlaying || gameOver) return;
        const ghostY = getGhostPos();
        playSound('drop.mp3'); // Suara Hard Drop
        lockPiece({ x: activePiece.pos.x, y: ghostY });
    }, [activePiece, isPlaying, gameOver, getGhostPos, lockPiece]);

    const rotate = () => {
        if (!isPlaying || gameOver) return;
        const rotatedShape = activePiece.shape[0].map((_, index) =>
            activePiece.shape.map((col) => col[index]).reverse()
        );
        if (!checkCollision(activePiece.pos.x, activePiece.pos.y, rotatedShape)) {
            setActivePiece((prev) => ({ ...prev, shape: rotatedShape }));
            playSound('rotate.mp3'); // Suara Rotasi
        }
    };

    useEffect(() => {
        if (!isPlaying || gameOver || isPaused) return;
        const interval = setInterval(() => move(0, 1), 800);
        return () => clearInterval(interval);
    }, [move, isPlaying, gameOver, isPaused]);

    return { grid, activePiece, nextPiece, move, rotate, hardDrop, gameOver, score, startGame, isPlaying, getGhostPos, isPaused, togglePause, setIsPaused };
};