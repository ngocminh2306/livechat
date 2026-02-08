import * as BABYLON from 'babylonjs';

export class PlayerCharacter {
    public mesh: BABYLON.Mesh;
    public name: string;
    private scene: BABYLON.Scene;
    private health: number = 100;
    private maxHealth: number = 100;
    private isAttacking: boolean = false;
    private isBlocking: boolean = false;
    private isMoving: boolean = false;

    constructor(name: string, position: BABYLON.Vector3, scene: BABYLON.Scene) {
        this.name = name;
        this.scene = scene;
        
        // Create capsule-shaped player character
        this.mesh = BABYLON.MeshBuilder.CreateCapsule(`${name}_capsule`, {
            height: 4,
            radius: 0.5
        }, scene);
        
        this.mesh.position = position;
        
        // Create material for the player
        const material = new BABYLON.StandardMaterial(`${name}_material`, scene);
        material.diffuseColor = new BABYLON.Color3(0, 0, 1); // Blue for player
        material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        this.mesh.material = material;
        
        // Enable collisions
        this.mesh.checkCollisions = true;
        this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 2, 0.5);
        this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 2, 0);
    }

    public move(direction: BABYLON.Vector3, speed: number = 0.1): void {
        this.isMoving = true;
        this.mesh.moveWithCollisions(
            direction.multiplyByFloat(speed)
        );
    }

    public rotate(yaw: number): void {
        this.mesh.rotation.y += yaw;
    }

    public async performAttack(target?: PlayerCharacter): Promise<void> {
        if (this.isAttacking) return;
        
        this.isAttacking = true;
        
        // Animation for attack
        const initialRotation = this.mesh.rotation.clone();
        const attackAnimation = new BABYLON.Animation(
            "attackAnim",
            "rotation.x",
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE
        );

        const keys = [
            { frame: 0, value: initialRotation.x },
            { frame: 10, value: initialRotation.x - 0.5 },
            { frame: 20, value: initialRotation.x + 0.3 },
            { frame: 30, value: initialRotation.x }
        ];

        attackAnimation.setKeys(keys);
        this.mesh.animations.push(attackAnimation);

        // Run the animation
        this.scene.beginAnimation(this.mesh, 0, 30, false).onAnimationEnd = () => {
            this.isAttacking = false;
        };

        // If there's a target, apply damage
        if (target) {
            setTimeout(() => {
                target.takeDamage(10);
            }, 500); // Damage applied halfway through the attack animation
        }
    }

    public takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        
        console.log(`${this.name} took ${amount} damage. Health: ${this.health}`);
        
        // Visual feedback for taking damage
        const originalColor = (this.mesh.material as BABYLON.StandardMaterial).diffuseColor;
        (this.mesh.material as BABYLON.StandardMaterial).diffuseColor = new BABYLON.Color3(1, 0, 0); // Red
        
        setTimeout(() => {
            if (this.mesh.material) {
                (this.mesh.material as BABYLON.StandardMaterial).diffuseColor = originalColor;
            }
        }, 200);
    }

    public heal(amount: number): void {
        this.health += amount;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
    }

    public getHealthPercentage(): number {
        return (this.health / this.maxHealth) * 100;
    }

    public dispose(): void {
        this.mesh.dispose();
    }
}