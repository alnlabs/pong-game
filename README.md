# Pong Game

A modern, feature-rich Pong game built with React. Play with 2 players, navigate obstacles, and experience increasing ball speed as the game progresses.

## Features

- **2-Player Local**: Compete head-to-head with local multiplayer
- **vs AI**: Play against AI with 3 difficulty levels (Easy, Medium, Hard)
- **Online Multiplayer**: Play against other players online in real-time
- **Gradually Increasing Speed**: Ball speed increases every 10 hits
- **Obstacles**: 
  - **Holes**: Trap the ball and reset its position
  - **Poles**: Reflect the ball at different angles
- **Modern UI**: Beautiful gradient background and smooth animations
- **Responsive Design**: Works on different screen sizes
- **Platform Ready**: Structured for easy deployment to web game platforms

## Controls

- **Player 1 (Top Paddle)**: 
  - `A` - Move left
  - `D` - Move right

- **Player 2 (Bottom Paddle)**:
  - `←` (Left Arrow) - Move left
  - `→` (Right Arrow) - Move right

- **Game Controls**:
  - `Space` or `Esc` - Pause/Resume game

## Installation

### Frontend (React App)

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Firebase configuration
# Get these values from Firebase Console > Project Settings > Your apps
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

**Note**: The `.env` file is required for Firebase Authentication and Realtime Database to work. Make sure to add your Firebase credentials to the `.env` file.

### Backend Server (for Online Multiplayer)

1. Navigate to server directory:
```bash
cd server
npm install
```

2. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server runs on port 3001 by default. Make sure the server is running before using online multiplayer mode.

**Note**: For online multiplayer to work, you need both the frontend and backend running. The frontend connects to `http://localhost:3001` by default, but you can change this in the Online Lobby.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Deployment to Web Game Platforms

### Itch.io

1. Build the project: `npm run build`
2. Zip the contents of the `build` folder
3. Upload to Itch.io as an HTML5 game
4. Set the main file to `index.html`

### Newgrounds

1. Build the project: `npm run build`
2. Follow Newgrounds HTML5 game submission guidelines
3. Ensure all assets are included in the build folder
4. Test the game in their preview environment

### GameJolt

1. Build the project: `npm run build`
2. Upload the `build` folder contents
3. Configure game settings in GameJolt dashboard
4. Set entry point to `index.html`

### General HTML5 Deployment

The game is built as a standard React app and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Simply build the project and upload the `build` folder contents.

## Project Structure

```
pong-game/
├── public/
│   └── index.html
├── server/                 # Backend server for online multiplayer
│   ├── server.js          # Socket.io server
│   ├── package.json       # Server dependencies
│   └── README.md          # Server documentation
├── src/
│   ├── components/          # React components
│   │   ├── Ball.js         # Ball component
│   │   ├── Paddle.js       # Paddle component
│   │   ├── Obstacles.js    # Holes and poles
│   │   ├── GameBoard.js    # Main game board
│   │   ├── ScoreBoard.js   # Score display
│   │   ├── GameOver.js     # Game over screen
│   │   ├── Instructions.js # Game instructions
│   │   ├── ModeSelector.js # Game mode selector
│   │   └── OnlineLobby.js # Online multiplayer lobby
│   ├── engine/
│   │   ├── GameEngine.js   # Game physics and logic
│   │   └── AIController.js # AI controller for vs AI mode
│   ├── utils/
│   │   └── socketManager.js # WebSocket connection manager
│   ├── config/
│   │   └── gameConfig.js   # Game configuration
│   ├── App.js              # Main app component
│   ├── App.css             # App styles
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json
└── README.md
```

## Customization

All game settings can be customized in `src/config/gameConfig.js`:

- Canvas dimensions
- Paddle size and speed
- Ball size and speed settings
- Win condition (score to win)
- Obstacle settings
- Colors and styling
- Platform-specific configurations

## Game Modes

### 2-Player Local
- Both players play on the same device
- Player 1 (top): A/D keys
- Player 2 (bottom): Arrow keys

### vs AI
- Play against computer-controlled opponent
- Choose from 3 difficulty levels
- Player controls bottom paddle with arrow keys

### Online Multiplayer
- Play against other players over the internet
- Create or join a room using a room ID
- Real-time synchronization of game state
- Requires the backend server to be running

## Game Rules

1. Each player controls a paddle at opposite ends of the screen
2. Hit the ball with your paddle to reflect it toward your opponent
3. Score a point when the ball passes your opponent's goal line
4. First player to reach the winning score (default: 5) wins
5. Ball speed increases every 10 hits
6. Avoid holes (they reset the ball) and use poles strategically

## License

This project is open source and available for personal and commercial use.

