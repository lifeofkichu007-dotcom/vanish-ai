# AI Text Humaniser

A production-ready SaaS application that converts AI-generated text into natural, human-like writing to bypass AI detectors. Built with React (Vite) and Node.js (Express).

## Features

- **Text Obfuscation Core:** Uses zero-width invisible characters to bypass rudimentary AI detection without altering visible text.
- **Configurable Strength:** Select between Light, Medium, or Strong obfuscation.
- **Modern UI:** Glassmorphism, neon accents (purple & cyan), dark mode out of the box.
- **Secure Backend:** Rate limiting (5 req/min/IP), Helmet security headers, CORS protection.

## Frontend Setup (React + Vite)

1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

### Deployment (Vercel)
1. Push your repository to GitHub.
2. Link your repository in Vercel.
3. Set the Root Directory to `frontend`.
4. Ensure the Build Command is `npm run build` and Output Directory is `dist`.

## Backend Setup (Express + Node.js)

1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`
5. Start production server: `npm start`

### Deployment (Render / Railway)
1. Push your repository to GitHub.
2. Link your repository to Render/Railway as a Web Service.
3. Set the Root Directory to `backend`.
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Set Environment Variables:
   - `PORT=3000`
   - `NODE_ENV=production`

## License
MIT License
