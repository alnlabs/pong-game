# Firebase Setup Guide

This project uses Firebase Authentication and Realtime Database (not Hosting).

## Firebase Services Used

1. **Firebase Authentication** - For user authentication
2. **Firebase Realtime Database** - For online multiplayer game state synchronization

## Setup Instructions

### 1. Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `pong-game-54d24`
3. Navigate to **Authentication** > **Sign-in method**
4. Enable the following sign-in methods:
   - **Anonymous** (for guest users)
   - **Google** (for Google OAuth sign-in)
     - Click on **Google** provider
     - Enable it and save
     - Configure OAuth consent screen if prompted

### 1.1. Configure Authorized Domains (IMPORTANT for Google Sign-In)

To fix "unauthorized domain" errors, you must add your domains to the authorized list:

1. In Firebase Console, go to **Authentication** > **Settings**
2. Scroll down to **Authorized domains**
3. Add the following domains:
   - `localhost` (for local development - usually already added)
   - Your production domain (e.g., `yourdomain.com`, `yourdomain.netlify.app`, etc.)
   - Any other domains where you'll host the app

**Note**: Firebase automatically includes:
- `localhost` (for development)
- `*.firebaseapp.com` (for Firebase Hosting)
- `*.web.app` (for Firebase Hosting)

If you're deploying to Netlify, Vercel, or another service, make sure to add that domain!

### 2. Enable Realtime Database

1. In Firebase Console, go to **Realtime Database**
2. Click **Create Database**
3. Choose a location (e.g., `us-central1`)
4. Start in **test mode** (we'll update rules)
5. Copy the database URL (should be: `https://pong-game-54d24-default-rtdb.firebaseio.com/`)

### 3. Set Database Rules

The database rules are in `database.rules.json`. Deploy them:

```bash
firebase deploy --only database
```

Or manually set in Firebase Console:
- Go to **Realtime Database** > **Rules**
- Paste the rules from `database.rules.json`
- Publish

### 4. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Firebase configuration values:
   - Go to Firebase Console > Project Settings > Your apps
   - Copy the config values and paste them into `.env`
   - All variables must start with `REACT_APP_` prefix

3. The `.env` file is already in `.gitignore` and won't be committed to version control.

**Important**: Never commit your `.env` file to version control. The `.env.example` file serves as a template.

## Authentication Flow

- **Guest Mode**: Users can sign in anonymously to play immediately
- **Google Sign-In**: Users can sign in with their Google account
- **Online Multiplayer**: Requires authentication (guest or Google account)

## Database Structure

```
rooms/
  {roomId}/
    status: "waiting" | "ready"
    host: userId
    createdAt: timestamp
    players/
      {userId}/
        playerNumber: 1 | 2
        connected: true
        joinedAt: timestamp
    game/
      paddle1: { x, direction, timestamp }
      paddle2: { x, direction, timestamp }
      ball: { x, y, vx, vy, size, speed, timestamp }
      score: { score1, score2, timestamp }
      gameOver: { winner, timestamp }
      restart: timestamp
```

## Deployment

Since Firebase Hosting is not used, you can deploy to any hosting service:
- Netlify
- Vercel
- GitHub Pages
- Your own server

Just build the project:
```bash
npm run build
```

And deploy the `build` folder to your hosting service.

## Security Notes

- Database rules require authentication (`auth != null`)
- Users can only read/write to rooms they're part of
- Consider adding more specific rules based on your needs

