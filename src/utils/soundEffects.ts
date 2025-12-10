// Simple Web Audio API wrapper for kid-friendly sounds

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let audioCtx: AudioContext | null = null;

const getContext = () => {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    return audioCtx;
};

export const playCorrect = () => {
    const ctx = getContext();
    const t = ctx.currentTime;

    // Happy major arpeggio (C - E - G - C)
    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine'; // Smooth sound
        osc.frequency.setValueAtTime(freq, t + i * 0.1);

        gain.gain.setValueAtTime(0.1, t + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + i * 0.1);
        osc.stop(t + i * 0.1 + 0.3);
    });
};

export const playIncorrect = () => {
    const ctx = getContext();
    const t = ctx.currentTime;

    // Wobbly low sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth'; // Buzzy sound
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.4); // Slide down

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.4);
};

export const playWin = () => {
    const ctx = getContext();
    const t = ctx.currentTime;

    // Fanfare (C - C - C - G - A - B - C)
    const melody = [
        { f: 523.25, d: 0.1, s: 0 },
        { f: 523.25, d: 0.1, s: 0.15 },
        { f: 523.25, d: 0.1, s: 0.3 },
        { f: 783.99, d: 0.4, s: 0.45 }, // G
        { f: 880.00, d: 0.2, s: 0.85 }, // A
        { f: 987.77, d: 0.2, s: 1.05 }, // B
        { f: 1046.50, d: 0.8, s: 1.25 } // High C
    ];

    melody.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle'; // Bright sound
        osc.frequency.setValueAtTime(note.f, t + note.s);

        gain.gain.setValueAtTime(0.1, t + note.s);
        gain.gain.exponentialRampToValueAtTime(0.01, t + note.s + note.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + note.s);
        osc.stop(t + note.s + note.d);
    });
};

export const playPop = () => {
    const ctx = getContext();
    const t = ctx.currentTime;

    // Short click/pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
};
