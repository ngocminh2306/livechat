# 3D Street Fighting Game

A first-person 3D action combat game built with Babylon.js and TypeScript. Players fight enemies in street-style combat with immersive first-person perspective.

## Features

- First-person perspective 3D combat
- Character movement with WASD/Arrow Keys
- Attack system with mouse controls
- Enemy AI with detection and combat mechanics
- Health system and visual feedback
- Interactive 3D environment

## Prerequisites

Make sure you have the following tools installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (usually comes with Node.js)

## Installation

1. Clone or download this repository to your local machine
2. Navigate to the project directory in your terminal
3. Install the required dependencies:

```bash
npm install
```

## Running the Game

There are two ways to run the game:

### Method 1: Using HTTP Server

1. Build the TypeScript code:
```bash
npm run build
```

2. Serve the project files:
```bash
npm run serve
```

The game will be accessible at `http://localhost:8080` (or another available port).

### Method 2: Direct Development Mode

For development purposes, you can run the game directly with:
```bash
npm run dev
```

Note: This method requires additional setup for browser security restrictions on loading assets.

## Controls

- **Movement**: W/A/S/D keys or Arrow keys
- **Look around**: Mouse movement
- **Attack**: Left mouse button
- **Special Attack**: Right mouse button (coming soon)

## Project Structure

```
/workspace/
├── src/
│   ├── game.ts          # Main game logic
│   ├── player.ts        # Player character class
│   └── enemy.ts         # Enemy character class
├── index.html           # Main HTML page
├── tsconfig.json        # TypeScript configuration
├── package.json         # Project dependencies
└── README.md            # This file
```

## Technologies Used

- [Babylon.js](https://www.babylonjs.com/) - 3D graphics engine
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Node.js](https://nodejs.org/) - JavaScript runtime environment
- [npm](https://www.npmjs.com/) - Package manager

## Customization

You can modify the game by editing the TypeScript files in the `src/` directory:

- `game.ts` - Contains the main game class and environment setup
- `player.ts` - Player character logic and behaviors
- `enemy.ts` - Enemy character logic and AI

After making changes to TypeScript files, remember to rebuild the project with `npm run build`.

## Tutorial

### Getting Started

1. **Setup Environment**
   - Install Node.js (v14 or higher) from [nodejs.org](https://nodejs.org/)
   - Open your terminal/command prompt
   - Navigate to your project directory

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build and Run the Game**
   ```bash
   npm run build  # Compiles TypeScript to JavaScript
   npm run serve  # Serves the game at http://localhost:8080
   ```

### Understanding the Code Structure

The game is organized into several key files:

- **`src/game.ts`**: Contains the main game class that initializes the Babylon.js scene, creates the player, enemies, and manages the game loop
- **`src/player.ts`**: Defines the player character with movement controls, attack mechanics, and health system
- **`src/enemy.ts`**: Implements enemy AI with detection, chasing, and combat behaviors

### Creating Your First Customization

1. **Modify Player Movement**
   - Open `src/player.ts`
   - Find the `move()` method
   - Adjust the speed values to make the player move faster or slower

2. **Add New Enemy Behavior**
   - In `src/enemy.ts`, explore the `update()` method
   - You can modify the detection range by changing the `detectionRange` value
   - Customize attack patterns in the `attack()` method

3. **Customize Game Environment**
   - In `src/game.ts`, look for the `createEnvironment()` method
   - Add new objects by using Babylon.js mesh builders like `Mesh.CreateBox()`, `Mesh.CreateSphere()`, etc.

### Adding New Features

#### Adding Sound Effects
1. Create a new method in the Player class to play sounds:
   ```typescript
   import { Sound } from '@babylonjs/core/Audio/sound';
   
   playAttackSound() {
     const attackSound = new Sound("attack", "path/to/sound.wav", this.scene);
     attackSound.play();
   }
   ```

#### Implementing Power-ups
1. Create a new class `powerup.ts` similar to `enemy.ts`
2. Define properties like type, duration, and effect
3. Add collision detection between player and power-up

#### Creating Different Enemy Types
1. Extend the Enemy class to create specialized enemies
   ```typescript
   class RangedEnemy extends Enemy {
     shootProjectile() {
       // Implementation for ranged attacks
     }
   }
   ```

### Advanced Customization

#### Changing Graphics Settings
- Modify the engine initialization in `src/game.ts` to adjust anti-aliasing, shadows, or post-processing effects
- Experiment with different materials by modifying the mesh creation code

#### Adding Multiplayer Support
- Integrate a WebSocket library to enable multiplayer functionality
- Implement network synchronization for player positions and actions

## Troubleshooting

### Common Issues:

1. **Game won't load**:
   - Make sure you've run `npm install` and `npm run build`
   - Check that you're serving the files via a web server (not opening index.html directly in browser)

2. **Performance issues**:
   - The game uses advanced 3D graphics, ensure your system meets minimum requirements
   - Close other applications to free up memory and processing power

3. **Controls not responding**:
   - Make sure the game canvas has focus
   - Some browsers might require clicking on the game area before accepting keyboard input

## Contributing

Feel free to fork this repository and submit pull requests for improvements or bug fixes.

## License

This project is licensed under the ISC License.