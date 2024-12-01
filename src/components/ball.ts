import { Canvas } from "./canva";

export class Ball extends Canvas {
  private width: number = 0;
  private height: number = 0;
  private color: string = 'red';
  private x: number = 0;
  private y: number = 0;
  private dx: number = 0;
  private dy: number = 0;
  private radius: number;

  constructor(
    canvasId: string, 
    radius: number, 
    color: string = 'red', 
    x: number = 0, 
    y: number = 0
  ) {
    super(canvasId);
    this.radius = radius;
    this.color = color;
    this.x = x;
    this.y = y;
  }

  public draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  public move() {
    this.x += this.dx;
    this.y += this.dy;

    if (
      this.x + this.dx > this.canvas.width - this.radius || 
      this.x + this.dx < this.radius
    ) {
      this.dx = -this.dx;
    }

    if (
      this.y + this.dy > this.canvas.height - this.radius || 
      this.y + this.dy < this.radius
    ) {
      this.dy = -this.dy;
    }
  }

  public setVelocity(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }

  public animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.move();
    this.draw();
    requestAnimationFrame(this.animate.bind(this));
  }
}