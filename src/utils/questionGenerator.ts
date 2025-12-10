import { Question } from '../data/questions';

// --- Types & Helpers ---

// Helper to get random integer between min and max (inclusive)
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to get random item from array
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to shuffle array
function shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

// Helper to generate unique questions
export function generateQuestionsForLevel(levelId: number): Question[] {
    const questions: Question[] = [];
    const count = 15;
    const signatures = new Set<string>(); // To track uniqueness
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loops

    while (questions.length < count && attempts < maxAttempts) {
        const id = `${levelId}-${questions.length + 1}-${Date.now()}-${Math.random()}`;
        let q: Question | null = null;

        switch (levelId) {
            case 1: q = generateLevel1Question(id, levelId); break;
            case 2: q = generateLevel2Question(id, levelId); break;
            case 3: q = generateAdditionQuestion(id, levelId, 10); break;
            case 4: q = generateSubtractionQuestion(id, levelId, 10); break;
            case 5: q = generateShapeQuestion(id, levelId); break;
            case 6: // Mix Add/Sub to 20
                q = Math.random() > 0.5
                    ? generateAdditionQuestion(id, levelId, 20)
                    : generateSubtractionQuestion(id, levelId, 20);
                break;
            case 7: q = generatePatternQuestion(id, levelId); break;
            case 8: q = generateMeasurementQuestion(id, levelId); break;
            case 9: q = generateMoneyQuestion(id, levelId); break;
            case 10: q = generateDataQuestion(id, levelId); break;
            default: q = generateLevel1Question(id, levelId);
        }

        if (q) {
            // Create a unique signature for the question (e.g. "2+2=4")
            // For text based questions, the text itself is usually good enough
            const signature = q.text + q.correctAnswer;

            if (!signatures.has(signature)) {
                signatures.add(signature);
                questions.push(q);
                attempts = 0; // Reset attempts on success
            } else {
                attempts++;
            }
        } else {
            attempts++;
        }
    }

    return questions;
}

// --- Level 1: Number Sense (1-50) ---
function generateLevel1Question(id: string, levelId: number): Question {
    const type = randomInt(1, 3);
    if (type === 1) { // After
        const num = randomInt(1, 49);
        const correct = num + 1;
        return {
            id, levelId,
            text: `What number comes after ${num}?`,
            correctAnswer: correct.toString(),
            options: shuffle([correct.toString(), (correct + 1).toString(), (correct - 2).toString(), (correct + 5).toString()]),
            visualKeyword: 'coins'
        };
    } else if (type === 2) { // Before
        const num = randomInt(2, 50);
        const correct = num - 1;
        return {
            id, levelId,
            text: `What number comes before ${num}?`,
            correctAnswer: correct.toString(),
            options: shuffle([correct.toString(), (correct - 1).toString(), (correct + 2).toString(), (correct + 10).toString()]),
            visualKeyword: 'coins'
        };
    } else { // Compare
        // Generate 4 unique numbers
        const nums = new Set<number>();
        while (nums.size < 4) {
            nums.add(randomInt(1, 50));
        }
        const optionsNum = Array.from(nums);
        const isBigger = Math.random() > 0.5;
        const correct = isBigger ? Math.max(...optionsNum) : Math.min(...optionsNum);

        return {
            id, levelId,
            text: `Find the ${isBigger ? 'biggest' : 'smallest'} number.`,
            correctAnswer: correct.toString(),
            options: shuffle(optionsNum.map(n => n.toString())),
            visualKeyword: 'scale'
        };
    }
}

// --- Level 2: Skip Counting ---
function generateLevel2Question(id: string, levelId: number): Question {
    const step = randomItem([2, 5, 10]);
    const start = randomInt(1, 5) * step;
    const seq = [start, start + step, start + step * 2];
    const correct = start + step * 3;
    return {
        id, levelId,
        text: `Skip count by ${step}s: ${seq.join(', ')}, __`,
        correctAnswer: correct.toString(),
        options: shuffle([correct.toString(), (correct + step).toString(), (correct - step).toString(), (correct + 1).toString()]),
        visualKeyword: 'coins'
    };
}

// --- Levels 3, 4, 6: Math Facts ---
function generateAdditionQuestion(id: string, levelId: number, max: number): Question {
    const a = randomInt(0, max);
    const b = randomInt(0, max - a);
    const correct = a + b;
    return {
        id, levelId,
        text: `${a} + ${b} = ?`,
        correctAnswer: correct.toString(),
        options: shuffle([
            correct.toString(),
            (correct + 1).toString(),
            (correct - 1 >= 0 ? correct - 1 : correct + 2).toString(),
            (correct + randomInt(2, 5)).toString()
        ]),
        visualKeyword: 'apple'
    };
}

function generateSubtractionQuestion(id: string, levelId: number, max: number): Question {
    const a = randomInt(1, max);
    const b = randomInt(0, a);
    const correct = a - b;
    return {
        id, levelId,
        text: `${a} - ${b} = ?`,
        correctAnswer: correct.toString(),
        options: shuffle([
            correct.toString(),
            (correct + 1).toString(),
            (correct - 1 >= 0 ? correct - 1 : correct + 2).toString(),
            (correct + randomInt(2, 5)).toString()
        ]),
        visualKeyword: 'banana'
    };
}

// --- Level 5: Shapes (Dynamic) ---
const SHAPES = [
    { name: 'Circle', sides: 0, corners: 0, look: 'Ball', visual: 'circle' },
    { name: 'Square', sides: 4, corners: 4, look: 'Box', visual: 'square' },
    { name: 'Triangle', sides: 3, corners: 3, look: 'Pizza Slice', visual: 'triangle' },
    { name: 'Rectangle', sides: 4, corners: 4, look: 'Door', visual: 'square' }, // reusing square visual for now or generic
    { name: 'Hexagon', sides: 6, corners: 6, look: 'Honeycomb', visual: 'hexagon' },
    { name: 'Octagon', sides: 8, corners: 8, look: 'Stop Sign', visual: 'octagon' },
];

function generateShapeQuestion(id: string, levelId: number): Question {
    const type = randomInt(1, 3);
    const shape = randomItem(SHAPES);

    // Get distractors
    const distractors = shuffle(SHAPES.filter(s => s.name !== shape.name)).slice(0, 3).map(s => s.name);

    if (type === 1) { // Sides/Corners
        const prop = Math.random() > 0.5 ? 'sides' : 'corners';
        return {
            id, levelId,
            text: `How many ${prop} does a ${shape.name} have?`,
            correctAnswer: shape[prop].toString(),
            options: shuffle([shape[prop].toString(), (shape[prop] + 1).toString(), (shape[prop] + 2).toString(), (shape[prop] > 0 ? shape[prop] - 1 : 5).toString()]),
            visualKeyword: shape.visual
        };
    } else if (type === 2) { // Identify by Attribute
        const prop = Math.random() > 0.5 ? 'sides' : 'corners';

        // Ensure distractors don't have the same number of sides/corners
        const validDistractors = SHAPES
            .filter(s => s[prop] !== shape[prop])
            .map(s => s.name);

        return {
            id, levelId,
            text: `Which shape has ${shape[prop]} ${prop}?`,
            correctAnswer: shape.name,
            options: shuffle([shape.name, ...shuffle(validDistractors).slice(0, 3)]),
            visualKeyword: shape.visual
        };
    } else { // Real world analogy
        return {
            id, levelId,
            text: `Which shape looks like a ${shape.look}?`,
            correctAnswer: shape.name,
            options: shuffle([shape.name, ...distractors]),
            visualKeyword: shape.visual
        };
    }
}

// --- Level 7: Patterns (Dynamic) ---
function generatePatternQuestion(id: string, levelId: number): Question {
    const type = randomInt(1, 3);

    if (type === 1) { // Number Pattern
        const start = randomInt(1, 10);
        const step = randomInt(1, 3);
        const seq = [start, start + step, start, start + step];
        const ans = start;
        return {
            id, levelId,
            text: `Complete: ${seq.join(', ')}, __`,
            correctAnswer: ans.toString(),
            options: shuffle([ans.toString(), (ans + step).toString(), (ans + 2).toString(), (ans + 5).toString()]),
            visualKeyword: 'coins'
        };
    } else if (type === 2) { // Shape/Color Pattern (Text based)
        const items = [['Red', 'Blue'], ['Circle', 'Square'], ['Sun', 'Moon'], ['Up', 'Down'], ['A', 'B']];
        const pair = randomItem(items);
        const seq = [pair[0], pair[1], pair[0], pair[1]];
        const ans = pair[0];
        const distractors = ['Green', 'Triangle', 'Star', 'Left', 'C'].filter(d => !pair.includes(d)).slice(0, 3);

        // Need relevant visual
        let vis = 'apple';
        if (pair[0] === 'Circle') vis = 'circle';
        if (pair[0] === 'Sun') vis = 'sun';
        if (pair[0] === 'Up') vis = 'ladder';
        if (pair[0] === 'A') vis = 'book';

        return {
            id, levelId,
            text: `Complete: ${seq.join(', ')}, __`,
            correctAnswer: ans,
            options: shuffle([ans, pair[1], ...distractors.slice(0, 2)]),
            visualKeyword: vis
        };
    } else { // AAB Pattern
        const seq = ['A', 'A', 'B', 'A', 'A', 'B'];
        const ans = 'A';
        return {
            id, levelId,
            text: `Complete: ${seq.join(', ')}, __`,
            correctAnswer: ans,
            options: shuffle(['A', 'B', 'C', 'D']),
            visualKeyword: 'book'
        };
    }
}

// --- Level 8: Measurement (Dynamic) ---
const MEASURE_OBJECTS = [
    { name: 'Elephant', size: 10, weight: 10, visual: 'elephant' },
    { name: 'Mouse', size: 1, weight: 1, visual: 'mouse' },
    { name: 'Dog', size: 4, weight: 4, visual: 'dog' },
    { name: 'Giraffe', size: 9, weight: 8, visual: 'giraffe' }, // Tall
    { name: 'Ant', size: 0.1, weight: 0.1, visual: 'ant' },
    { name: 'Bus', size: 8, weight: 9, visual: 'bus' },
    { name: 'Car', size: 6, weight: 7, visual: 'car' },
    { name: 'Feather', size: 2, weight: 0.01, visual: 'bird' }, // Light but visible
    { name: 'Rock', size: 2, weight: 3, visual: 'scale' },
];

function generateMeasurementQuestion(id: string, levelId: number): Question {
    const o1 = randomItem(MEASURE_OBJECTS);
    let o2 = randomItem(MEASURE_OBJECTS);
    while (o1.name === o2.name) o2 = randomItem(MEASURE_OBJECTS); // Ensure different

    const type = randomInt(1, 3);
    if (type === 1) { // Heavier/Lighter
        const isHeavier = Math.random() > 0.5;
        const correct = isHeavier
            ? (o1.weight > o2.weight ? o1.name : o2.name)
            : (o1.weight < o2.weight ? o1.name : o2.name);

        return {
            id, levelId,
            text: `Which is ${isHeavier ? 'heavier' : 'lighter'}?`,
            correctAnswer: correct,
            options: shuffle([o1.name, o2.name]),
            visualKeyword: 'scale'
        };
    } else if (type === 2) { // Bigger/Smaller
        const isBigger = Math.random() > 0.5;
        const correct = isBigger
            ? (o1.size > o2.size ? o1.name : o2.name)
            : (o1.size < o2.size ? o1.name : o2.name);

        return {
            id, levelId,
            text: `Which is ${isBigger ? 'bigger' : 'smaller'}?`,
            correctAnswer: correct,
            options: shuffle([o1.name, o2.name]),
            visualKeyword: 'ruler'
        };
    } else { // Taller (simplified to size for now)
        const correct = o1.size > o2.size ? o1.name : o2.name;
        return {
            id, levelId,
            text: `Which is taller?`,
            correctAnswer: correct,
            options: shuffle([o1.name, o2.name]),
            visualKeyword: 'giraffe'
        };
    }
}

// --- Level 9: Money (Dynamic) ---
const COINS = [
    { name: 'Nickel', val: 5, visual: 'nickel' },
    { name: 'Dime', val: 10, visual: 'dime' },
    { name: 'Quarter', val: 25, visual: 'quarter' },
    { name: 'Loonie', val: 100, visual: 'loonie' },
    { name: 'Toonie', val: 200, visual: 'toonie' },
];

function generateMoneyQuestion(id: string, levelId: number): Question {
    const type = randomInt(1, 3);
    const coin = randomItem(COINS);

    if (type === 1) { // Value check
        const valText = coin.val >= 100 ? `${coin.val / 100} dollar(s)` : `${coin.val} cents`;
        // Create unique distractors
        const distractors = [
            '1 cent', '5 cents', '10 cents', '25 cents', '1 dollar(s)', '2 dollar(s)'
        ].filter(d => d !== valText); // Remove correct answer if present in static list

        return {
            id, levelId,
            text: `What is a ${coin.name} worth?`,
            correctAnswer: valText,
            options: shuffle([valText, ...shuffle(distractors).slice(0, 3)]),
            visualKeyword: coin.visual
        };
    } else if (type === 2) { // Simple Sum
        const c1 = randomItem(COINS.filter(c => c.val <= 25)); // Keep sums simple
        const c2 = randomItem(COINS.filter(c => c.val <= 25));
        const sum = c1.val + c2.val;
        return {
            id, levelId,
            text: `${c1.name} + ${c2.name} = ?`,
            correctAnswer: `${sum} cents`,
            options: shuffle([`${sum} cents`, `${sum + 5} cents`, `${sum - 5} cents`, '100 cents']),
            visualKeyword: 'coins'
        };
    } else { // Identify coin
        // Ensure correct answer is in options
        const otherCoins = COINS.filter(c => c.name !== coin.name);
        const distractors = shuffle(otherCoins).slice(0, 3).map(c => c.name);

        return {
            id, levelId,
            text: `Which coin is worth ${coin.val >= 100 ? coin.val / 100 + ' dollar(s)' : coin.val + ' cents'}?`,
            correctAnswer: coin.name,
            options: shuffle([coin.name, ...distractors]),
            visualKeyword: coin.visual
        };
    }
}

// --- Level 10: Data & Sorting (Dynamic) ---
const CATEGORIES = {
    'Fruit': ['Apple', 'Banana', 'Cherry', 'Strawberry'],
    'Animal': ['Dog', 'Cat', 'Elephant', 'Fish', 'Bird'],
    'Toy': ['Doll', 'Ball', 'Car', 'Block'],
    'Furniture': ['Chair', 'Table', 'Bed', 'Lamp'],
    'Vehicle': ['Car', 'Bus', 'Train', 'Boat']
};

function generateDataQuestion(id: string, levelId: number): Question {
    const cats = Object.keys(CATEGORIES);
    const targetCat = randomItem(cats);
    const otherCat = randomItem(cats.filter(c => c !== targetCat));

    const correctItem = randomItem(CATEGORIES[targetCat as keyof typeof CATEGORIES]);
    const wrongItems = shuffle(CATEGORIES[otherCat as keyof typeof CATEGORIES]).slice(0, 3);

    // Visual mapping
    let vis = 'box';
    if (targetCat === 'Fruit') vis = 'apple';
    if (targetCat === 'Animal') vis = 'dog';
    if (targetCat === 'Vehicle') vis = 'car';

    return {
        id, levelId,
        text: `Which one is a ${targetCat}?`,
        correctAnswer: correctItem,
        options: shuffle([correctItem, ...wrongItems]),
        visualKeyword: vis
    };
}
