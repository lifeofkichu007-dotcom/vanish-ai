"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.humaniseText = void 0;
// Zero-width characters for text obfuscation
// \u200B is Zero-width space
// \u200C is Zero-width non-joiner
// \u200D is Zero-width joiner
const ZERO_WIDTH_CHARS = ['\u200B', '\u200C', '\u200D'];
const humaniseText = (text, strength) => {
    let probability = 0.18; // Default Medium (18%)
    if (strength === 'Light') {
        probability = 0.10;
    }
    else if (strength === 'Strong') {
        probability = 0.25;
    }
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        result += char;
        // Only insert between alphabetical characters to avoid breaking formatting or code
        if (/[a-zA-Z]/.test(char) && Math.random() < probability) {
            // Pick a random zero-width character
            const randomChar = ZERO_WIDTH_CHARS[Math.floor(Math.random() * ZERO_WIDTH_CHARS.length)];
            result += randomChar;
        }
    }
    return result;
};
exports.humaniseText = humaniseText;
