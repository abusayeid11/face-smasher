# Face Smasher v2

A customizable face smasher game where users upload their own image and choose a tool to smash it!

## Features

- Upload any image as the smash target (or use default emoji face)
- Generate shareable links to play the game
- Multiple arena themes: Candy, Neon, SUST Gate, Tong
- Tool options: Punch, Slap, Hammer, Spank, Rose
- Realistic bruise effects with multiple layers
- Screen shake on hit
- Sound effects
- Mobile responsive with touch support
- Commentary system with tool-specific phrases
- Previous games history

## How to Play

### Create a Game (Creator Page)

1. Open `index.html` in a browser
2. Upload a face photo OR skip to use default emoji
3. Choose an arena background (optional)
4. Pick your smash tool
5. Click "Generate Smash Link" to share

### Play a Game (Player Page)

1. Open the shared link in a browser
2. Click/tap on the face to smash it!
3. Use the tool toggle to switch tools
4. Commentary can be toggled ON/OFF

## Running Locally

Simply open `index.html` in any modern browser. No server required!

For link generation, copy `js/config.example.js` to `js/config.js` and add your Firebase config.

## Tech Stack

- Vanilla JavaScript (ES6 modules)
- HTML5 Canvas
- Firebase Realtime Database
- No build tools required

## Disclaimer

This project is created for learning and fun purposes only. We are not responsible for any misuse of this software.

## Project Structure

```
face-smasher/
├── index.html              # Creator page (create & share games)
├── play.html            # Player page (play shared games)
├── style.css           # Styling
├── js/
│   ├── creator.js      # Creator page logic
│   ├── play.js       # Player page logic
│   ├── firebase.js   # Firebase database
│   ├── face.js      # Face/image handling
│   ├── tool.js      # Tool loading
│   ├── marks.js     # Bruise effects
│   ├── game.js     # Main game loop
│   ├── audio.js    # Sound effects
│   ├── config.js         # Firebase config (gitignored)
│   ├── config.example.js  # Config template
│   ├── components/       # UI components
│   │   ├── game-engine.js
│   │   ├── image-processor.js
│   │   ├── game-history.js
│   │   └── share-links.js
│   ├── managers/        # Game managers
│   │   ├── gameSessionManager.js
│   │   ├── inputManager.js
│   │   ├── controlManager.js
│   │   ├── runtimeManager.js
│   │   ├── arenaManager.js
│   │   └── commentaryManager.js
│   ├── arena/          # Arena themes
│   │   └── arena.js
│   └── commentary/    # Commentary engine
│       ├── commentary.js
│       ├── commentaryText.js
│       └── config.js
├── tools/                # Tool images
│   ├── punch.png
│   ├── slap.png
│   ├── hammer.png
│   └── whip-icon.svg
└── firebase-rules.json   # Firebase rules (review before deploy)
```

## Contributing

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## Git Hooks (Branch Protection)

This project uses Husky hooks to protect the `main` branch:

- Direct commits to `main` are blocked (`.husky/pre-commit`)
- Direct pushes to `main` are blocked (`.husky/pre-push`)

Work on a feature branch and open a pull request to merge into `main`.

## License

MIT
