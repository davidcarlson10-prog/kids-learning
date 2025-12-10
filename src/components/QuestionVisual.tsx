import {
    Circle, Square, Triangle, Hexagon, Octagon, Box, Cylinder, Cone,
    Star, Heart, Cloud, Sun, Moon, Umbrella, Car, Bus, Train,
    Cat, Dog, Fish, Bird, Apple, Banana, Cherry,
    Coins, DollarSign, Ruler, Scale, Clock, Thermometer
} from 'lucide-react';

interface QuestionVisualProps {
    keyword?: string;
}

export function QuestionVisual({ keyword }: QuestionVisualProps) {
    if (!keyword) return null;

    const size = 120;


    // Map keywords to Lucide Icons
    const iconMap: Record<string, React.ReactNode> = {
        // Shapes
        'circle': <Circle size={size} className="text-red-500 fill-red-100" />,
        'square': <Square size={size} className="text-blue-500 fill-blue-100" />,
        'triangle': <Triangle size={size} className="text-green-500 fill-green-100" />,
        'hexagon': <Hexagon size={size} className="text-purple-500 fill-purple-100" />,
        'octagon': <Octagon size={size} className="text-red-600 fill-red-100" />,
        'cube': <Box size={size} className="text-orange-500" />,
        'cylinder': <Cylinder size={size} className="text-teal-500" />,
        'cone': <Cone size={size} className="text-yellow-500" />,

        // Objects
        'star': <Star size={size} className="text-yellow-400 fill-yellow-100" />,
        'heart': <Heart size={size} className="text-pink-500 fill-pink-100" />,
        'cloud': <Cloud size={size} className="text-gray-400 fill-gray-100" />,
        'sun': <Sun size={size} className="text-orange-400 fill-orange-100" />,
        'moon': <Moon size={size} className="text-indigo-400 fill-indigo-100" />,
        'umbrella': <Umbrella size={size} className="text-purple-500" />,

        // Transport
        'car': <Car size={size} className="text-red-500" />,
        'bus': <Bus size={size} className="text-yellow-500" />,
        'train': <Train size={size} className="text-blue-600" />,

        // Animals (Lucide has limited animals, using emojis for some)
        'cat': <Cat size={size} className="text-orange-400" />,
        'dog': <Dog size={size} className="text-brown-500" />,
        'fish': <Fish size={size} className="text-blue-400" />,
        'bird': <Bird size={size} className="text-green-500" />,

        // Food
        'apple': <Apple size={size} className="text-red-500 fill-red-100" />,
        'banana': <Banana size={size} className="text-yellow-400 fill-yellow-100" />,
        'cherry': <Cherry size={size} className="text-red-600" />,

        // Math/Money
        'coins': <Coins size={size} className="text-yellow-600" />,
        'dollar': <DollarSign size={size} className="text-green-600" />,
        'ruler': <Ruler size={size} className="text-yellow-700" />,
        'scale': <Scale size={size} className="text-gray-600" />,
        'clock': <Clock size={size} className="text-blue-800" />,
        'thermometer': <Thermometer size={size} className="text-red-500" />,
    };

    // Check for Icon match
    const icon = iconMap[keyword.toLowerCase()];
    if (icon) {
        return <div className="flex justify-center animate-bounce-slow">{icon}</div>;
    }

    // Fallback to Emoji for things Lucide doesn't have
    const emojiMap: Record<string, string> = {
        'nickel': '🦫', // Beaver
        'dime': '⛵', // Bluenose
        'quarter': '🦌', // Caribou
        'loonie': '🦆', // Loon
        'toonie': '🐻‍❄️', // Polar Bear
        'pencil': '✏️',
        'book': '📖',
        'flower': '🌸',
        'tree': '🌳',
        'leaf': '🍃',
        'mouse': '🐭',
        'elephant': '🐘',
        'giraffe': '🦒',
        'ant': '🐜',
        'chair': '🪑',
        'table': '🪑',
        'bed': '🛏️',
        'stove': '🍳',
        'toilet': '🚽',
        'mittens': '🧤',
        'swimsuit': '🩱',
        'snowman': '⛄',
        'fire': '🔥',
        'ice': '🧊',
        'water': '💧',
        'hand': '✋',
        'foot': '🦶',
        'eye': '👁️',
    };

    const emoji = emojiMap[keyword.toLowerCase()];
    if (emoji) {
        return <div className="text-[100px] mb-8 animate-bounce-slow text-center">{emoji}</div>;
    }

    return null;
}
