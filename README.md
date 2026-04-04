# Face Smasher v2

A customizable face smasher game where users upload their own image and choose a tool to smash it!

## Features
- Upload any image as the smash target
- Choose from 3 tools (Punch, Slap, Hammer)
- Realistic bruise effects with multiple layers
- Screen shake on hit
- Sound effects
- Commentary toggle (default ON) with switch-style UI
- Animated commentary bubble with typewriter effect
- Timed floating emoji bursts for hit, miss, and combo events
- Tool-wise commentary animations (Punch/Slap/Hammer each feels different)
- Tool-wise savage commentary lines with combo tiers
- Fully modular commentary system for easy future extension
- Comic book pop-up effects with tool + message-specific animations and colors
- Tool-wise hit/miss comic text packs with combo variants
- Modular comic effects system for easy extension
- Mobile responsive with touch support

## How to Play
1. Open `index.html` in a browser
2. Click "Upload Face" to select an image
3. Pick your tool (Punch, Slap, or Hammer)
4. Click/tap on the face to smash it!
5. After game starts, use the Commentary toggle to turn commentary ON/OFF

## Running Locally
Simply open `index.html` in any modern browser. No server required!

## Deploying
This project can be deployed to any static hosting service:
- [Netlify Drop](https://app.netlify.com/drop) - drag and drop
- [Vercel](https://vercel.com/drop) - drag and drop
- GitHub Pages

## Tech Stack
- Vanilla JavaScript (ES6 modules)
- HTML5 Canvas
- Web Audio API
- No build tools required

## Project Structure
```
face-smasher/
├── index.html          # Main HTML
├── style.css           # Styling
├── script.js           # Main entry point
├── js/                 # Modular JavaScript
│   ├── audio.js        # Sound effects
│   ├── face.js         # Image upload handling
│   ├── tool.js         # Tool loading & switching
│   ├── marks.js        # Bruise generation
│   ├── input.js        # Mouse/touch input
│   ├── game.js         # Main game loop
│   ├── commentary/      # Commentary feature
│   │   ├── commentary.js   # Animated commentary engine (hit/miss/combo + tool profiles)
│   │   └── commentaryText.js # Tool-wise commentary text and combo message builders
│   └── comicEffects/    # Comic pop-up effects
│       ├── comicPopups.js   # Pop-up animation engine
│       └── comicText.js     # Tool-wise pop text, colors, and animation metadata
└── tools/              # Tool images
```

## Contributing
1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License
MIT