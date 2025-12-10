
import { useGameState, TOTAL_LEVELS } from './hooks/useGameState';
import { useState, useEffect } from 'react';
import { LevelMap } from './components/LevelMap';
import { QuizGame } from './components/QuizGame';
import { WelcomeModal } from './components/WelcomeModal';
import { CompletionModal } from './components/CompletionModal';
import { Star } from 'lucide-react';
import { playWin, playPop } from './utils/soundEffects';

function App() {
    const {
        currentView,
        currentLevel,
        currentQuestions,
        progress,
        startGame,
        returnToMap,
        unlockNextLevel,
        resetGame,
        userName,
        setUserName
    } = useGameState();
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    // Calculate total stars
    const totalStars = progress.reduce((acc, curr) => acc + curr.stars, 0);
    const maxStars = TOTAL_LEVELS * 3;

    // Check for completion (30 stars)
    useEffect(() => {
        if (totalStars >= 30) {
            playWin(); // Super Star Fanfare!
            setShowCompletionModal(true);
        }
    }, [totalStars]);

    const handlePlayAgain = () => {
        playPop();
        setShowCompletionModal(false);
        resetGame();
    };

    return (
        <div className="min-h-screen font-sans relative">
            <WelcomeModal
                isOpen={!userName}
                onStart={(name) => {
                    playPop();
                    setUserName(name);
                }}
            />

            {/* Background Image */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/src/assets/classroom_bg.png')" }}
            />
            {/* Overlay for readability */}
            <div className="fixed inset-0 z-0 bg-white/80 backdrop-blur-sm" />

            {/* Content Container - Needs distinct z-index to sit on top */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 font-comic tracking-wide">
                            Try and catch the stars!
                        </h1>
                        <button
                            onClick={resetGame}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-600 text-sm font-bold px-3 py-1 rounded-full transition-colors border border-blue-200"
                        >
                            New Game
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-300 shadow-sm">
                        <Star className="text-yellow-500 fill-yellow-500 animate-pulse" size={28} />
                        <span className="text-2xl font-bold text-yellow-700">
                            {totalStars} / {maxStars}
                        </span>
                    </div>
                </header>

                <main>
                    {currentView === 'MAP' ? (
                        <LevelMap
                            progress={progress}
                            onStartLevel={startGame}
                            userName={userName}
                        />
                    ) : (
                        <QuizGame
                            levelId={currentLevel}
                            questions={currentQuestions} // Pass dynamic questions
                            onBack={returnToMap}
                            onComplete={(stars) => {
                                unlockNextLevel(currentLevel, stars);
                                // Don't return to map immediately, let them see the result in QuizGame
                                // But QuizGame calls onComplete then shows "Next Level" button which calls onBack?
                                // No, QuizGame handles "Next Level" button itself? 
                                // Let's check QuizGame logic.
                                // QuizGame calls onComplete when "Next Level" or "Finish" is clicked.
                                // So we should go back to map here.
                                returnToMap();
                            }}
                        />
                    )}
                </main>

                <CompletionModal
                    isOpen={showCompletionModal}
                    onPlayAgain={handlePlayAgain}
                />
            </div>
        </div>
    );
}

export default App;

