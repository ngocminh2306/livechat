import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { PlayerCharacter } from './player';
import { EnemyCharacter } from './enemy';

export class StreetFighterGame {
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private camera: BABYLON.ArcRotateCamera;
    private light: BABYLON.Light;
    private player: PlayerCharacter;
    private enemies: EnemyCharacter[] = [];
    
    constructor(canvasElement: string) {
        const canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = this.createScene();
        
        // Create first person camera (ArcRotateCamera positioned to simulate first person)
        this.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2, Math.PI/2.5, 2, new BABYLON.Vector3(0, 2, 0), this.scene);
        this.camera.attachControl(canvas, true);
        this.camera.lowerRadiusLimit = 2;
        this.camera.upperRadiusLimit = 2;
        this.camera.panningSensibility = 0; // Disable panning with right click
        
        // Add lights
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        
        // Create street environment
        this.createEnvironment();
        
        // Create player character
        this.createPlayer();
        
        // Create enemies
        this.createEnemies();
        
        // Start render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
    
    private createScene(): BABYLON.Scene {
        const scene = new BABYLON.Scene(this.engine);
        scene.clearColor = new BABYLON.Color4(0.2, 0.2, 0.3, 1.0); // Sky color
        return scene;
    }
    
    private createEnvironment(): void {
        // Create ground
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 50, height: 50}, this.scene);
        const groundMaterial = new BABYLON.StandardMaterial("groundMat", this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2); // Gray concrete
        ground.material = groundMaterial;
        
        // Create some buildings/walls
        const building1 = BABYLON.MeshBuilder.CreateBox("building1", {width: 5, height: 8, depth: 5}, this.scene);
        building1.position.x = 10;
        building1.position.y = 4;
        
        const building2 = BABYLON.MeshBuilder.CreateBox("building2", {width: 8, height: 6, depth: 5}, this.scene);
        building2.position.x = -8;
        building2.position.y = 3;
        
        const building3 = BABYLON.MeshBuilder.CreateBox("building3", {width: 6, height: 10, depth: 6}, this.scene);
        building3.position.z = 10;
        building3.position.y = 5;
        
        // Create obstacles
        const obstacle1 = BABYLON.MeshBuilder.CreateCylinder("obstacle1", {height: 3, diameter: 2}, this.scene);
        obstacle1.position.set(5, 1.5, 5);
        
        const obstacle2 = BABYLON.MeshBuilder.CreateSphere("obstacle2", {diameter: 3}, this.scene);
        obstacle2.position.set(-5, 1.5, -5);
    }
    
    private createPlayer(): void {
        // Create main character (player)
        this.player = new PlayerCharacter("Player1", new BABYLON.Vector3(0, 2, 5), this.scene);
        
        // Position camera at player's eye level
        this.player.mesh.position.y = 0; // Adjust for capsule origin
        this.camera.setTarget(new BABYLON.Vector3(
            this.player.mesh.position.x, 
            this.player.mesh.position.y + 1.6, // Eye level
            this.player.mesh.position.z
        ));
    }
    
    private createEnemies(): void {
        // Create multiple enemies
        const enemy1 = new EnemyCharacter("Enemy1", new BABYLON.Vector3(8, 2, 8), this.scene, this.player);
        this.enemies.push(enemy1);
        
        const enemy2 = new EnemyCharacter("Enemy2", new BABYLON.Vector3(-8, 2, -8), this.scene, this.player);
        this.enemies.push(enemy2);
        
        const enemy3 = new EnemyCharacter("Enemy3", new BABYLON.Vector3(0, 2, -10), this.scene, this.player);
        this.enemies.push(enemy3);
    }
    
    private setupControls(): void {
        const inputMap: {[key: string]: number} = {};
        
        // Keyboard event listeners
        document.addEventListener('keydown', (event) => {
            inputMap[event.key.toLowerCase()] = 1;
        });
        
        document.addEventListener('keyup', (event) => {
            inputMap[event.key.toLowerCase()] = 0;
        });
        
        // Mouse event for combat actions
        document.addEventListener('mousedown', (event) => {
            if (this.player) {
                this.performAttack(event.button === 0 ? 'primary' : 'secondary');
            }
        });
        
        // Movement and combat loop
        this.scene.onBeforeRenderObservable.add(() => {
            if (!this.player) return;
            
            // Movement
            const speed = 0.1;
            const direction = new BABYLON.Vector3(0, 0, 0);
            
            if (inputMap['w'] || inputMap['arrowup']) {
                direction.addInPlace(this.camera.getForwardRay().direction.scale(speed));
            }
            if (inputMap['s'] || inputMap['arrowdown']) {
                direction.subtractInPlace(this.camera.getForwardRay().direction.scale(speed));
            }
            if (inputMap['a'] || inputMap['arrowleft']) {
                direction.addInPlace(this.camera.getSideVector().scale(-speed));
            }
            if (inputMap['d'] || inputMap['arrowright']) {
                direction.addInPlace(this.camera.getSideVector().scale(speed));
            }
            
            // Normalize direction to prevent faster diagonal movement
            if (direction.length() > 0) {
                direction.normalize().scaleInPlace(speed);
            }
            
            this.player.move(direction);
            
            // Update camera to follow player at eye level
            this.camera.setTarget(new BABYLON.Vector3(
                this.player.mesh.position.x, 
                this.player.mesh.position.y + 1.6, // Eye level
                this.player.mesh.position.z
            ));
        });
    }
    
    private performAttack(type: string): void {
        if (!this.player) return;
        
        // Find closest enemy to attack
        let closestEnemy: EnemyCharacter | null = null;
        let minDistance = Infinity;
        
        for (const enemy of this.enemies) {
            if (!enemy['isAlive']) continue;
            
            const distance = BABYLON.Vector3.Distance(
                this.player.mesh.position,
                enemy.mesh.position
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestEnemy = enemy;
            }
        }
        
        // Only attack if an enemy is within range
        if (closestEnemy && minDistance <= 3) {
            this.player.performAttack(closestEnemy);
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new StreetFighterGame('renderCanvas');
});

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new StreetFighterGame('renderCanvas');
});