# Face Smasher v2

A customizable face smasher game where users upload their own image and choose a tool to smash it!

## Features
- Upload any image as the smash target
- Choose from 3 tools (Fist, Hammer, Glove)
- Realistic bruise effects with multiple layers
- Screen shake on hit
- Sound effects
- Mobile responsive with touch support

## How to Play
1. Open `index.html` in a browser
2. Click "Upload Face" to select an image
3. Pick your tool (Fist, Hammer, or Glove)
4. Click/tap on the face to smash it!

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
│   └── game.js         # Main game loop
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