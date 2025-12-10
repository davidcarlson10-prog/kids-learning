import { useState, useEffect } from 'react';
import { ArrowLeft, Star, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question } from '../data/questions';
import { QuestionVisual } from './QuestionVisual';
import { playCorrect, playIncorrect, playWin } from '../utils/soundEffects';

interface QuizGameProps {
    levelId: number;
    questions: Question[];
    onBack: () => void;
    onComplete: (stars: number) => void;
}

export function QuizGame({ levelId, questions: levelQuestions, onBack, onComplete }: QuizGameProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [gameCompleted, setGameCompleted] = useState(false);

    // levelQuestions is now passed as a prop

    useEffect(() => {
        if (gameCompleted) {
            // Trigger confetti if they got at least 1 star (approx 33%)
            const percentage = (score / levelQuestions.length) * 100;
            if (percentage >= 33) {
                playWin(); // Fanfare!
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
    }, [gameCompleted, score, levelQuestions.length]);

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return; // Prevent double clicking

        setSelectedAnswer(answer);
        const currentQuestion = levelQuestions[currentQuestionIndex];
        const correct = answer === currentQuestion.correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            playCorrect(); // Ding!
            setScore(prev => prev + 1);
        } else {
            playIncorrect(); // Womp womp
        }

        // Wait a bit then show next question or result
        setTimeout(() => {
            if (currentQuestionIndex < levelQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setGameCompleted(true);
            }
        }, 1500);
    };

    const calculateStars = () => {
        const percentage = (score / levelQuestions.length) * 100;
        if (percentage === 100) return 3;
        if (percentage >= 66) return 2;
        if (percentage >= 33) return 1;
        return 0;
    };

    if (levelQuestions.length === 0) {
        return (
            <div className="min-h-screen bg-blue-50 p-8 flex flex-col items-center justify-center">
                <h2 className="text-2xl text-gray-600">No questions found for Level {levelId} yet!</h2>
                <button onClick={onBack} className="mt-4 text-blue-600 font-bold">Go Back</button>
            </div>
        );
    }

    if (gameCompleted) {
        const stars = calculateStars();
        return (
            <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full animate-bounce-in">
                    <h2 className="text-4xl font-bold text-blue-600 mb-4">Level Complete!</h2>
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3].map((star) => (
                            <Star
                                key={star}
                                size={48}
                                className={`${star <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-all duration-500`}
                            />
                        ))}
                    </div>
                    <p className="text-2xl text-gray-600 mb-8">
                        You got {score} out of {levelQuestions.length} correct!
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => onComplete(stars)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-xl transition-colors"
                        >
                            {stars > 0 ? 'Next Level!' : 'Finish'}
                        </button>
                        <button
                            onClick={() => {
                                setGameCompleted(false);
                                setCurrentQuestionIndex(0);
                                setScore(0);
                                setSelectedAnswer(null);
                                setIsCorrect(null);
                            }}
                            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-600 font-bold py-4 rounded-xl text-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCcw size={24} /> Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = levelQuestions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-blue-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                    >
                        <ArrowLeft /> Quit
                    </button>
                    <div className="text-xl font-bold text-blue-400">
                        Question {currentQuestionIndex + 1} / {levelQuestions.length}
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-b-8 border-blue-200">
                    <QuestionVisual keyword={currentQuestion.visualKeyword} />
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
                        {currentQuestion.text}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrectAnswer = option === currentQuestion.correctAnswer;

                            let buttonStyle = "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800";

                            if (selectedAnswer) {
                                if (isSelected) {
                                    buttonStyle = isCorrect
                                        ? "bg-green-100 border-green-500 text-green-800 ring-4 ring-green-200"
                                        : "bg-red-100 border-red-500 text-red-800 ring-4 ring-red-200";
                                } else if (isCorrectAnswer && !isCorrect) {
                                    // Show correct answer if they got it wrong
                                    buttonStyle = "bg-green-100 border-green-500 text-green-800 opacity-70";
                                } else {
                                    buttonStyle = "bg-gray-50 text-gray-400 border-gray-100";
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option)}
                                    disabled={selectedAnswer !== null}
                                    className={`
                    relative p-6 rounded-2xl text-2xl md:text-3xl font-bold border-b-4 transition-all duration-200
                    ${buttonStyle}
                    ${!selectedAnswer && 'hover:-translate-y-1 hover:shadow-lg'}
                  `}
                                >
                                    {option}
                                    {selectedAnswer && isSelected && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            {isCorrect ? <CheckCircle className="text-green-600" size={32} /> : <XCircle className="text-red-600" size={32} />}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
