import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import xss from 'xss';
import { humaniseText } from './humaniser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON body
app.use(express.json());

// Enable CORS
app.use(cors());

// Security headers
app.use(
helmet({
crossOriginResourcePolicy: false
})
);

// Rate limiting
const limiter = rateLimit({
windowMs: 60 * 1000,
max: 5,
message: { error: 'Too many requests from this IP, please try again after a minute.' },
standardHeaders: true,
legacyHeaders: false,
});

app.use('/api', limiter);

// Humanise endpoint
app.post('/api/humanise', (req, res) => {
  try {

    const text = req.body.text || "";
    const strength = req.body.strength || "Medium";

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Valid text is required' });
    }

    if (text.length > 100000) {
      return res.status(400).json({ error: 'Text too long. Maximum 100000 characters.' });
    }

    // Sanitize input
    const sanitizedText = xss(text);

    // Process text
    const humanised = humaniseText(sanitizedText, strength);

    res.json({ result: humanised });

  } catch (error) {
    console.error('Error processing text:', error);
    res.status(500).json({ error: 'Internal server error while processing text' });
  }
});

// Health check
app.get('/health', (req, res) => {
res.json({ status: 'ok' });
});

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
