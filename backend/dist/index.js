"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const humaniser_1 = require("./humaniser");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rate limiting: 5 requests per minute per IP
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: 'Too many requests from this IP, please try again after a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);
// Endpoints
app.post('/api/humanise', (req, res) => {
    try {
        const { text, strength = 'Medium' } = req.body;
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Valid text is required' });
        }
        if (text.length > 100000) {
            return res.status(400).json({ error: 'Text too long. Maximum 100000 characters.' });
        }
        const humanised = (0, humaniser_1.humaniseText)(text, strength);
        res.json({ result: humanised });
    }
    catch (error) {
        console.error('Error processing text:', error);
        res.status(500).json({ error: 'Internal server error while processing text' });
    }
});
// Basic health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
