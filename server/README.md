# Pong Game Server

Backend server for online multiplayer Pong game using Socket.io.

## Installation

```bash
cd server
npm install
```

## Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on port 3001 by default (or the port specified in the PORT environment variable).

## Environment Variables

- `PORT`: Server port (default: 3001)

## Features

- Room-based multiplayer system
- Real-time game state synchronization
- Paddle movement synchronization
- Score and game over synchronization
- Automatic room cleanup on disconnect

## API Events

### Client to Server

- `createRoom(roomId)`: Create a new game room
- `joinRoom(roomId)`: Join an existing room
- `paddleMove({ x, direction })`: Send paddle movement
- `gameStateUpdate(state)`: Send game state update (ball position)
- `scoreUpdate({ score1, score2 })`: Send score update
- `gameOver({ winner })`: Send game over event
- `restartGame()`: Request game restart (host only)

### Server to Client

- `roomCreated({ roomId, playerNumber })`: Room created successfully
- `roomJoined({ roomId, playerNumber })`: Joined room successfully
- `gameReady({ player1, player2 })`: Both players connected, game can start
- `opponentPaddleMove({ playerNumber, x, direction })`: Opponent paddle moved
- `gameStateSync(state)`: Game state synchronization
- `scoreSync({ score1, score2 })`: Score synchronization
- `gameOverSync({ winner })`: Game over synchronization
- `gameRestart()`: Game restart notification
- `opponentDisconnected()`: Opponent disconnected
- `roomError({ message })`: Room error occurred

## Deployment

The server can be deployed to any Node.js hosting platform:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS
- etc.

Make sure to set the PORT environment variable if needed.

