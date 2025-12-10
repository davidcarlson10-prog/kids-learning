import { Star, RefreshCcw } from 'lucide-react';

interface CompletionModalProps {
    isOpen: boolean;
    onPlayAgain: () => void;
}

export function CompletionModal({ isOpen, onPlayAgain }: CompletionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center animate-bounce-in border-8 border-yellow-400">
                <div className="flex justify-center mb-6">
                    <Star size={120} className="text-yellow-400 fill-yellow-400 animate-spin-slow" />
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6 font-comic">
                    Great job!
                </h2>

                <p className="text-2xl text-gray-700 mb-8 leading-relaxed">
                    You caught all of the stars,<br />
                    you are a <span className="font-bold text-yellow-500">SUPER STAR!!!</span>
                </p>

                <button
                    onClick={onPlayAgain}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl text-2xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                    <RefreshCcw size={32} />
                    Play Again
                </button>
            </div>
        </div>
    );
}
