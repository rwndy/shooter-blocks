import { Component } from "./canva";

export class CanvasController {
    private ball: Component;
    private rectangle: Component;
    private animationFrameId: number | null = null;
    private launchBall: boolean = false;
    private gameOver: boolean = false;

    constructor() {
        this.ball = new Component('drawingCanvas', 10, 10, 'red', 280, 280);
        this.rectangle = new Component(
            'drawingCanvas',
            60,
            10,
            'blue',
            256,
            290,
            false
        );

        this.setupKeyboardControls();
        this.startAnimation();
    }

    private setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            if (this.gameOver) return;

            switch (event.key) {
                case 'ArrowLeft':
                    this.rectangle.setSpeedX(-5);
                    break;
                case 'ArrowRight':
                    this.rectangle.setSpeedX(5);
                    break;
                case 'Escape':
                    this.stopAnimation();
                    break;
                case ' ':
                    if (!this.launchBall) {
                        this.launchBall = true;
                        // Set initial ball speed with more pronounced movement
                        this.ball.setBallSpeed(3, -4);
                    }
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                this.rectangle.setSpeedX(0);
            }
        });
    }

    private checkCollision() {
        const ballX = this.ball.getX();
        const ballWidth = this.ball.getWidth();
        const rectX = this.rectangle.getX();
        const rectWidth = this.rectangle.getWidth();
        const ballY = this.ball.getY();

        // Check if ball hits the bottom of the canvas
        // const canvas = this.ball.getCanvas();
        // const dpr = window.devicePixelRatio || 1;
        // const canvasHeight = canvas.height / dpr;

        if (this.ball.isGameOverState()) {
            this.gameOver = true;
            alert('GAME OVER');
            this.stopAnimation();
            return;
        }

        // Check collision with rectangle
        const rectY = this.rectangle.getY();
        if (
            ballY + this.ball.getWidth() >= rectY &&
            ballY + this.ball.getWidth() <= rectY + 10 && // Paddle height
            ballX + ballWidth >= rectX &&
            ballX <= rectX + rectWidth
        ) {
            // Bounce off the paddle, slightly randomize direction
            const currentDx = this.ball.getDx();
            const newDx = currentDx + (Math.random() * 2 - 1); // Add slight randomness
            this.ball.setBallSpeed(newDx, -Math.abs(this.ball.getDy()));
        }
    }
    private animate = () => {
        if (this.gameOver) return;

        // Get canvas and context
        const canvas = this.rectangle.getCanvas();
        const ctx = this.rectangle.getContext();

        // Clear the entire canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update positions
        this.rectangle.newPos();

        if (this.launchBall) {
            this.ball.startBall(); // Handle ball bouncing off walls
            this.checkCollision(); // Check for collisions
        }

        // Redraw everything
        this.ball.draw();
        this.rectangle.draw();

        // Continue animation
        this.animationFrameId = requestAnimationFrame(this.animate);
    };

    private startAnimation() {
        // Cancel any existing animation frame to prevent multiple animations
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        this.rectangle.draw();
        this.ball.draw();
        this.animationFrameId = requestAnimationFrame(this.animate);
    }

    private stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}