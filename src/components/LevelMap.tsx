import { LevelProgress } from '../hooks/useGameState';
import { Star, Lock, Play } from 'lucide-react';
import classroomBg from '../assets/classroom_background.png';

interface LevelMapProps {
    progress: LevelProgress[];
    onStartLevel: (levelId: number) => void;
    userName?: string;
}

export function LevelMap({ progress, onStartLevel, userName }: LevelMapProps) {
    return (
        <div
            className="min-h-screen p-8 flex flex-col items-center"
            style={{
                backgroundImage: `url(${classroomBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl mb-8 shadow-lg">
                <h1 className="text-4xl font-bold text-green-800">
                    Star Learning {userName}
                </h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl w-full">
                {progress.map((level) => (
                    <button
                        key={level.levelId}
                        onClick={() => level.unlocked && onStartLevel(level.levelId)}
                        disabled={!level.unlocked}
                        className={`
              relative aspect-square rounded-2xl flex flex-col items-center justify-center
              transition-all duration-300 transform hover:scale-105
              ${level.unlocked
                                ? 'bg-white border-4 border-green-500 shadow-lg cursor-pointer hover:bg-green-50'
                                : 'bg-gray-200 border-4 border-gray-300 cursor-not-allowed opacity-70'}
            `}
                    >
                        <div className="text-3xl font-bold text-gray-700 mb-2">
                            {level.levelId}
                        </div>

                        {level.unlocked ? (
                            <div className="flex gap-1">
                                {[1, 2, 3].map((star) => (
                                    <Star
                                        key={star}
                                        size={20}
                                        className={`${star <= level.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Lock className="text-gray-400" size={32} />
                        )}

                        {level.unlocked && level.stars === 0 && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full animate-bounce">
                                <Play size={16} className="fill-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
