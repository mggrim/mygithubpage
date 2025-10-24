# Innovation Runway - Multiplayer Learning Simulation

A web-based multiplayer learning simulation where students compete as innovation managers, navigating hype cycles, organizational politics, and resource constraints to successfully launch and sustain innovations.

## 🎯 Learning Objectives

Students master five critical dimensions of innovation management:

1. **WHEN (Timing)**: Understanding boom vs. bubble dynamics and optimal launch timing
2. **WHY (Promoting)**: Effectively selling innovations internally and managing expectations
3. **WHO (Social Proofing)**: Building endorsement from high-profile champions AND deep expert engagement
4. **WHAT (Evidencing/Progress)**: Demonstrating progress on the hardest challenges ("train the monkey" vs. "build the pedestal")
5. **HOW (Strategy/Rollout)**: Managing organizational conflict, saboteurs, and long-term risks

## 🚀 Features (MVP)

- **Single-player mode** with simulated market dynamics
- **12 quarters** of gameplay (expandable to 16)
- **25+ decisions** across 5 dimensions (WHEN, WHY, WHO, WHAT, HOW)
- **Real-time metrics** tracking progress, stakeholder confidence, team morale, and more
- **Hype cycle simulation** with bubble risk indicators
- **Achievement system** for learning milestones
- **Interactive decision-making** with trade-offs and consequences
- **Visual feedback** with animations and progress tracking
- **Educational content** including Theranos warnings and best practices

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Icons**: Lucide React
- **Charts**: Recharts (ready for future data visualization)

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm

### Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

This will install dependencies for the client workspace.

### Running the Application

#### Development Mode

To run the client in development mode:

```bash
npm run dev:client
```

The application will be available at `http://localhost:3000`

#### Production Build

To build the client for production:

```bash
npm run build
```

## 🎮 How to Play

### 1. Setup Your Innovation

- Enter your name
- Choose your **Organization Type** (Startup, Mid-size Corp, Enterprise, or Government)
- Select your **Innovation Domain** (AI/ML, CleanTech, BioTech, FinTech, or EdTech)
- Receive random **character traits**

### 2. Navigate Through Quarters

Each quarter consists of:

- **Information Phase**: Review market conditions
- **Decision Phase**: Make critical decisions across the 5 dimensions
- **Resolution Phase**: See outcomes

### 3. Win the Game

After 12 quarters, your **Innovation Success Score** is calculated from:
- Innovation Launch Success (40%)
- Organizational Support (25%)
- Resource Efficiency (20%)
- Long-term Viability (15%)

## 📚 Project Structure

```
innovation-runway/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── data/           # Game content
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript types
│   │   └── lib/            # Utilities
│   └── package.json
├── server/                 # Backend (prepared for multiplayer)
└── package.json
```

## 🔮 Future Enhancements

- Real-time multiplayer (2-6 players)
- WebSocket integration
- AI opponents
- Event system
- Instructor dashboard
- Tutorial mode

## 📝 License

MIT License

---

**Built for educators and students to learn innovation management through engaging, interactive gameplay.**
