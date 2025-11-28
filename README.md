# 3D Tic-Tac-Toe 🎮

> **⚠️ AI-Generated Project**: This entire project was created using AI assistance (Google Gemini/Antigravity). The code, structure, and implementation were generated through conversational prompts.

A beautiful 3D implementation of the classic Tic-Tac-Toe game built with React, Three.js, and React-three-fiber.

![3D Tic-Tac-Toe](https://img.shields.io/badge/AI-Generated-blue) ![React](https://img.shields.io/badge/React-19.2.0-61dafb) ![Three.js](https://img.shields.io/badge/Three.js-0.181.2-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6)

## ✨ Features

- **3D Gameplay**: Interactive 3D board with X and O markers
- **Smooth Animations**: 
  - Rotating markers
  - Animated winning line that grows and pulses
  - Hover effects on cells
- **Beautiful Visuals**:
  - Neon glow effects
  - Dynamic lighting and shadows
  - Environment reflections
  - Glassmorphism UI overlay
- **Full Game Logic**: Winner detection, turn management, and reset functionality

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/3d-ticktacktoe.git

# Navigate to the project directory
cd 3d-ticktacktoe

# Install dependencies
npm install

# Start the development server
npm run dev
```

The game will be available at `http://localhost:5173`

## 🎮 How to Play

1. Click on any cell to place your marker (X or O)
2. Players alternate turns automatically
3. Win by getting three in a row (horizontal, vertical, or diagonal)
4. A glowing green line will appear through the winning cells
5. Click "Reset Game" to start a new round

## 🛠️ Tech Stack

- **React 19.2.0** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **Tailwind CSS v4** - Styling

## 📁 Project Structure

```
src/
├── components/
│   ├── Game.tsx          # Main game component with state management
│   ├── Board.tsx         # 3D board grid
│   ├── Cell.tsx          # Individual cell with X/O markers
│   └── WinningLine.tsx   # Animated winning line
├── App.tsx               # Application entry point
└── index.css             # Global styles
```

## 🤖 AI Generation Details

This project was created entirely through AI assistance using:
- **AI Tool**: Google Gemini (Antigravity)
- **Development Approach**: Conversational prompting and iterative refinement
- **Time to Create**: Approximately 1 hour
- **Human Input**: Requirements, feedback, and design preferences

### Key AI-Generated Components:
- ✅ Project setup and configuration
- ✅ All React components
- ✅ 3D rendering logic
- ✅ Game state management
- ✅ Animations and visual effects
- ✅ This README

## 🚀 Deployment

### GitHub Pages

The project is configured for easy deployment to GitHub Pages:

```bash
npm run deploy
```

This will:
1. Build the production bundle
2. Deploy to the `gh-pages` branch
3. Make it available at `https://YOUR_USERNAME.github.io/3d-ticktacktoe/`

**Note**: Make sure GitHub Pages is enabled in your repository settings and set to use the `gh-pages` branch.

## 🎨 Customization

You can customize various aspects:

- **Colors**: Modify the marker colors in `Cell.tsx`
- **Animations**: Adjust timing in `WinningLine.tsx` and `Cell.tsx`
- **Camera**: Change position in `Game.tsx`
- **Lighting**: Modify intensity and position in `Game.tsx`

## 📝 License

MIT License - Feel free to use this project for learning or personal use.

## 🙏 Acknowledgments

- Created with AI assistance from Google Gemini
- Built with amazing open-source libraries
- Inspired by classic Tic-Tac-Toe

---

**Note**: This is an AI-generated project created for demonstration and learning purposes.
