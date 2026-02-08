import * as BABYLON from 'babylonjs';
import { PlayerCharacter } from './player';

export class EnemyCharacter {
    public mesh: BABYLON.Mesh;
    public name: string;
    private scene: BABYLON.Scene;
    private health: number = 80;
    private maxHealth: number = 80;
    private isAttacking: boolean = false;
    private isAlive: boolean = true;
    private player: PlayerCharacter;
    private detectionRange: number = 10;
    private attackRange: number = 2;
    private speed: number = 0.02;
    
    constructor(name: string, position: BABYLON.Vector3, scene: BABYLON.Scene, player: PlayerCharacter) {
        this.name = name;
        this.scene = scene;
        this.player = player;
        
        // Create enemy character
        this.mesh = BABYLON.MeshBuilder.CreateCapsule(`${name}_capsule`, {
            height: 4,
            radius: 0.5
        }, scene);
        
        this.mesh.position = position;
        
        // Create material for the enemy
        const material = new BABYLON.StandardMaterial(`${name}_material`, scene);
        material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red for enemy
        material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        this.mesh.material = material;
        
        // Enable collisions
        this.mesh.checkCollisions = true;
        this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 2, 0.5);
        this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 2, 0);
        
        // Start enemy AI behavior
        this.startAI();
    }
    
    private startAI(): void {
        // Simple AI loop that runs continuously
        setInterval(() => {
            if (!this.isAlive || !this.player) return;
            
            // Calculate distance to player
            const distanceToPlayer = BABYLON.Vector3.Distance(
                this.mesh.position, 
                this.player.mesh.position
            );
            
            if (distanceToPlayer <= this.detectionRange) {
                // Move toward player if outside attack range
                if (distanceToPlayer > this.attackRange) {
                    this.moveToTarget(this.player.mesh.position);
                } 
                // Attack player if in range
                else if (!this.isAttacking) {
                    this.performAttack(this.player);
                }
            }
        }, 100); // Check every 100ms
    }
    
    private moveToTarget(targetPosition: BABYLON.Vector3): void {
        if (!this.isAlive) return;
        
        // Calculate direction to target
        const direction = targetPosition.subtract(this.mesh.position).normalize();
        
        // Move towards the target
        this.mesh.moveWithCollisions(
            direction.multiplyByFloat(this.speed)
        );
    }
    
    public async performAttack(target: PlayerCharacter): Promise<void> {
        if (this.isAttacking || !this.isAlive) return;
        
        this.isAttacking = true;
        
        // Animation for attack
        const initialRotation = this.mesh.rotation.clone();
        const attackAnimation = new BABYLON.Animation(
            "enemyAttackAnim",
            "rotation.x",
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE
        );

        const keys = [
            { frame: 0, value: initialRotation.x },
            { frame: 10, value: initialRotation.x - 0.7 },
            { frame: 20, value: initialRotation.x + 0.5 },
            { frame: 30, value: initialRotation.x }
        ];

        attackAnimation.setKeys(keys);
        this.mesh.animations.push(attackAnimation);

        // Run the animation
        this.scene.beginAnimation(this.mesh, 0, 30, false).onAnimationEnd = () => {
            this.isAttacking = false;
        };

        // Apply damage to target
        setTimeout(() => {
            target.takeDamage(5);
        }, 500); // Damage applied halfway through the attack animation
    }
    
    public takeDamage(amount: number): void {
        if (!this.isAlive) return;
        
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        
        console.log(`${this.name} took ${amount} damage. Health: ${this.health}`);
        
        // Visual feedback for taking damage
        const originalColor = (this.mesh.material as BABYLON.StandardMaterial).diffuseColor;
        (this.mesh.material as BABYLON.StandardMaterial).diffuseColor = new BABYLON.Color3(1, 1, 0); // Yellow
        
        setTimeout(() => {
            if (this.mesh.material) {
                (this.mesh.material as BABYLON.StandardMaterial).diffuseColor = originalColor;
            }
        }, 200);
        
        // Check if enemy is dead
        if (this.health <= 0) {
            this.die();
        }
    }
    
    private die(): void {
        this.isAlive = false;
        console.log(`${this.name} has been defeated!`);
        
        // Remove from scene after a short delay
        setTimeout(() => {
            if (this.mesh) {
                this.mesh.dispose();
            }
        }, 1000);
    }
    
    public getHealthPercentage(): number {
        if (!this.isAlive) return 0;
        return (this.health / this.maxHealth) * 100;
    }
    
    public dispose(): void {
        this.isAlive = false;
        if (this.mesh) {
            this.mesh.dispose();
        }
    }
}