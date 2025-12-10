import { useState, useEffect } from 'react';
import { generateQuestionsForLevel } from '../utils/questionGenerator';
import { questions as _staticQuestions, Question } from '../data/questions';

export type ViewState = 'MAP' | 'GAME';

export interface LevelProgress {
    levelId: number;
    stars: number; // 0-3
    unlocked: boolean;
}

export const TOTAL_LEVELS = 10;

export function useGameState() {
    const [currentView, setCurrentView] = useState<ViewState>('MAP');
    const [currentLevel, setCurrentLevel] = useState<number>(1);
    const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);

    const [userName, setUserName] = useState<string>(() => {
        return localStorage.getItem('kids-math-username') || '';
    });

    // Initialize progress from localStorage or default
    const [progress, setProgress] = useState<LevelProgress[]>(() => {
        const saved = localStorage.getItem('kids-math-progress');
        if (saved) {
            return JSON.parse(saved);
        }
        // Default: Level 1 unlocked, others locked
        return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
            levelId: i + 1,
            stars: 0,
            unlocked: i === 0,
        }));
    });

    useEffect(() => {
        localStorage.setItem('kids-math-progress', JSON.stringify(progress));
    }, [progress]);

    useEffect(() => {
        if (userName) {
            localStorage.setItem('kids-math-username', userName);
        }
    }, [userName]);

    const unlockNextLevel = (levelId: number, stars: number) => {
        setProgress(prev => prev.map(p => {
            if (p.levelId === levelId) {
                // Update stars if better
                return { ...p, stars: Math.max(p.stars, stars) };
            }
            if (p.levelId === levelId + 1) {
                // Unlock next level
                return { ...p, unlocked: true };
            }
            return p;
        }));
    };

    const startGame = (levelId: number) => {
        // Check if we should use static or dynamic questions
        // For now, let's mix them or just use dynamic if available
        // Ideally, we use static for the first run, then dynamic?
        // Simpler: Just use dynamic generator for everything now that we have it
        // BUT, the user might want the specific static questions I wrote.
        // Let's use static questions by default, but if "Play Again" is triggered, we might want dynamic.
        // Actually, the requirement is "Play again with a new set of randomly generated questions".
        // So standard play = static (or consistent), Play Again = dynamic.

        // For simplicity in this iteration: Always use dynamic generator which falls back to pools for static-like content
        // This ensures infinite replayability immediately.
        const newQuestions = generateQuestionsForLevel(levelId);
        setCurrentQuestions(newQuestions);

        setCurrentLevel(levelId);
        setCurrentView('GAME');
    };

    const returnToMap = () => {
        setCurrentView('MAP');
    };

    const resetGame = () => {
        // Reset progress
        const newProgress = Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
            levelId: i + 1,
            stars: 0,
            unlocked: i === 0,
        }));
        setProgress(newProgress);
        setCurrentView('MAP');

        // Reset user
        setUserName('');
        localStorage.removeItem('kids-math-username');
    };

    return {
        userName,
        setUserName,
        currentView,
        currentLevel,
        currentQuestions, // Export this
        progress,
        startGame,
        returnToMap,
        unlockNextLevel,
        resetGame, // Export this
    };
}
