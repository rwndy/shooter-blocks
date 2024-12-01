import { Component } from "./canva";

export class CanvasController {
  private ball: Component;
  private rectangle: Component;
  private animationFrameId: number | null = null;

  constructor() {
    this.ball = new Component('drawingCanvas', 10, 10, 'red', 280, 280);
    this.rectangle = new Component('drawingCanvas', 60, 10, 'red', 256, 290, false);

    this.setupKeyboardControls();
    this.startAnimation();
  }

  private setupKeyboardControls() {
    document.addEventListener('keydown', (event) => {
      switch(event.key) {
        case 'ArrowLeft':
          this.rectangle.setSpeedX(-5);
          break;
        case 'ArrowRight':
          this.rectangle.setSpeedX(5);
          break;
        case 'Escape':
          this.stopAnimation();
          break;
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        this.rectangle.setSpeedX(0);
      }
    });
  }

  private animate = () => {
    // Get canvas and context
    const canvas = this.rectangle.getCanvas();
    const ctx = this.rectangle.getContext();

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update positions
    this.rectangle.newPos();

    // Redraw everything
    this.ball.draw();
    this.rectangle.draw();

    // Continue animation
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  private startAnimation() {
    // Cancel any existing animation frame to prevent multiple animations
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.ball.draw();
    this.rectangle.draw();
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  private stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}