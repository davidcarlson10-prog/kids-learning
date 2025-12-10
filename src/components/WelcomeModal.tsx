import { useState } from 'react';
import { Sparkles, User } from 'lucide-react';

interface WelcomeModalProps {
    isOpen: boolean;
    onStart: (name: string) => void;
}

export function WelcomeModal({ isOpen, onStart }: WelcomeModalProps) {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onStart(name.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-yellow-300 animate-bounce-in relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-100 rounded-full opacity-50" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-100 rounded-full opacity-50" />

                <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-yellow-100 p-4 rounded-full animate-bounce-slow">
                            <Sparkles size={48} className="text-yellow-500" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-blue-600 mb-2 font-comic">
                        Welcome, Friend!
                    </h2>
                    <p className="text-gray-500 mb-8 text-lg">
                        What should we call you?
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Type your name..."
                                className="w-full pl-12 pr-4 py-4 text-xl rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300 font-comic"
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className={`
                                w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transform transition-all
                                ${name.trim()
                                    ? 'bg-gradient-to-r from-green-400 to-green-500 hover:scale-105 hover:shadow-xl hover:from-green-500 hover:to-green-600 cursor-pointer'
                                    : 'bg-gray-300 cursor-not-allowed'}
                            `}
                        >
                            Let's Play! 🚀
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
