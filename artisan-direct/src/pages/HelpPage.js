import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { HelpCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

// --- The Snake Game Component ---
const SnakeGame = () => {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    
    const snakeRef = useRef([{ x: 10, y: 10 }]);
    const foodRef = useRef({ x: 15, y: 15 });
    const directionRef = useRef({ x: 0, y: -1 });
    const gridSize = 20;

    const generateFood = () => {
        if (canvasRef.current) {
            foodRef.current = {
                x: Math.floor(Math.random() * (canvasRef.current.width / gridSize)),
                y: Math.floor(Math.random() * (canvasRef.current.height / gridSize))
            };
        }
    };

    const resetGame = () => {
        snakeRef.current = [{ x: 10, y: 10 }];
        directionRef.current = { x: 0, y: -1 };
        generateFood();
        setScore(0);
        setIsGameOver(false);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp': case 'w': if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 }; break;
                case 'ArrowDown': case 's': if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 }; break;
                case 'ArrowLeft': case 'a': if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 }; break;
                case 'ArrowRight': case 'd': if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 }; break;
                default: break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        generateFood();

        const gameLoop = setInterval(() => {
            if (isGameOver || !canvasRef.current) return;

            const snake = snakeRef.current;
            const head = { x: snake[0].x + directionRef.current.x, y: snake[0].y + directionRef.current.y };

            if (head.x < 0 || head.x >= canvasRef.current.width / gridSize || head.y < 0 || head.y >= canvasRef.current.height / gridSize) {
                setIsGameOver(true);
                return;
            }
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    setIsGameOver(true);
                    return;
                }
            }

            const newSnake = [head, ...snake];

            if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
                setScore(s => s + 10);
                generateFood();
            } else {
                newSnake.pop();
            }

            snakeRef.current = newSnake;

            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(foodRef.current.x * gridSize, foodRef.current.y * gridSize, gridSize, gridSize);
            ctx.fillStyle = '#007BFF';
            snakeRef.current.forEach(segment => {
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
            });

        }, 200);

        return () => clearInterval(gameLoop);
    }, [isGameOver]);

    return (
        <div className="game-wrapper">
            <div className="game-header">
                <h3>Snake Game</h3>
                <div className="score">Score: {score}</div>
            </div>
            <canvas ref={canvasRef} width="480" height="400" className="game-canvas" />
            {isGameOver && (
                <div className="game-over">
                    <h3>Game Over!</h3>
                    <p>Your score: {score}</p>
                    <button onClick={resetGame}>Play Again</button>
                </div>
            )}
            <div className="mobile-controls">
                <div className="controls-row">
                    <button className="control-btn placeholder"></button>
                    <button className="control-btn" onClick={() => { if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 } }}><ArrowUp /></button>
                    <button className="control-btn placeholder"></button>
                </div>
                <div className="controls-row">
                    <button className="control-btn" onClick={() => { if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 } }}><ArrowLeft /></button>
                    <button className="control-btn" onClick={() => { if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 } }}><ArrowDown /></button>
                    <button className="control-btn" onClick={() => { if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 } }}><ArrowRight /></button>
                </div>
            </div>
        </div>
    );
};


// --- The Main Page Component ---
function HelpPage() {
    const navigate = useNavigate(); // Initialize navigate

    return (
        <>
            <div className="help-container">
                <div className="help-box">
                    {/* **NEW**: Added a back button */}
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} /> Go Back
                    </button>
                    <div className="help-header">
                        <HelpCircle size={48} className="header-icon" />
                        <h2>Help & FAQ</h2>
                        <p>This page is currently under construction. We're working hard to bring you a comprehensive help center!</p>
                        <p><strong>In the meantime, why not play a game?</strong></p>
                    </div>
                    <SnakeGame />
                </div>
            </div>
            <style>{`
                .help-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-color: #f0f4f8;
                    font-family: sans-serif;
                    padding: 20px;
                }
                .help-box {
                    width: 100%;
                    max-width: 500px;
                    background: white;
                    padding: 2.5rem;
                    border-radius: 12px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    position: relative; /* Needed for positioning the back button */
                }
                /* **NEW**: Styles for the back button */
                .back-button {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #555;
                    font-weight: bold;
                }
                .help-header {
                    margin-bottom: 2rem;
                }
                .header-icon {
                    color: #007BFF;
                }
                .help-header h2 {
                    color: #003366;
                    margin: 1rem 0 0.5rem;
                }
                .help-header p {
                    color: #666;
                    font-size: 1rem;
                    line-height: 1.5;
                }

                /* Game Styles */
                .game-wrapper {
                    position: relative;
                }
                .game-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .score {
                    font-weight: bold;
                    font-size: 1.2rem;
                    color: #003366;
                }
                .game-canvas {
                    background-color: #e7f3ff;
                    border: 2px solid #007BFF;
                    border-radius: 8px;
                    width: 100%;
                    height: auto;
                }
                .game-over {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.8);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                }
                .game-over h3 {
                    font-size: 2rem;
                    color: #dc3545;
                }
                .game-over button {
                    padding: 10px 20px;
                    background-color: #28a745;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                }
                .mobile-controls {
                    margin-top: 15px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                }
                .controls-row {
                    display: flex;
                    gap: 5px;
                }
                .control-btn {
                    width: 60px;
                    height: 60px;
                    border: 2px solid #007BFF;
                    background: #f0f4f8;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #007BFF;
                }
                .control-btn.placeholder {
                    visibility: hidden;
                }
            `}</style>
        </>
    );
}

export default HelpPage;
