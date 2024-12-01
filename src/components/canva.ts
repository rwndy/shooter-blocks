export class Canvas {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected coordinateDisplay: HTMLDivElement;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error(`Canvas with id ${canvasId} not found`);
    }
    this.ctx = this.canvas.getContext('2d')!;
    
    // Create coordinate display
    this.coordinateDisplay = document.createElement('div');
    this.coordinateDisplay.style.position = 'absolute';
    this.coordinateDisplay.style.top = `${this.canvas.offsetTop}px`;
    this.coordinateDisplay.style.left = `${this.canvas.offsetLeft + this.canvas.width}px`;
    document.body.appendChild(this.coordinateDisplay);

    this.setupCanvas();
    this.setupCoordinateTracking();
  }

  // Public getter for canvas
  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  // Public getter for context
  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  private setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = 560 * dpr;
    this.canvas.height = 300 * dpr;
    this.ctx.scale(dpr, dpr);
  }

  private setupCoordinateTracking() {
    this.canvas.addEventListener('mousemove', (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.updateCoordinateDisplay(x, y);
    });

    this.canvas.addEventListener('mouseenter', () => {
      this.coordinateDisplay.style.display = 'block';
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.coordinateDisplay.style.display = 'none';
    });
  }

  protected updateCoordinateDisplay(x: number, y: number) {
    this.coordinateDisplay.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
    this.coordinateDisplay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    this.coordinateDisplay.style.color = 'white';
    this.coordinateDisplay.style.padding = '5px';
  }
  
}

export class Component extends Canvas {
  private width: number;
  private height: number;
  private color: string;
  private x: number;
  private y: number;
  private isCircle: boolean;
  protected speedX: number = 0;
  protected speedY: number = 0;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(
    canvasId: string,
    width: number, 
    height: number, 
    color: string, 
    x: number, 
    y: number,
    isCircle: boolean = true,
  ) {
    super(canvasId)
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.isCircle = isCircle;

    // Calculate canvas dimensions accounting for device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    this.canvasWidth = this.canvas.width / dpr;
    this.canvasHeight = this.canvas.height / dpr;
  }

  // Getter for x coordinate
  public getX(): number {
    return this.x;
  }

  // Setter for speedX with boundary checking
  public setSpeedX(speed: number): void {
    // Calculate potential new position
    const potentialNewX = this.x + speed;

    // Check if the new position would keep the entire rectangle within canvas
    if (potentialNewX >= 0 && potentialNewX + this.width <= this.canvasWidth) {
      this.speedX = speed;
    } else {
      // Stop at the boundary
      this.speedX = 0;
    }
  }

  // Getter for width (for boundary checking)
  public getWidth(): number {
    return this.width;
  }

  draw() {
    const ctx = this.getContext();
    ctx.beginPath();
    if (this.isCircle) {
      // Use radius as the smaller of width/height
      const radius = Math.min(this.width, this.height) / 2;
      ctx.arc(
        this.x + radius, 
        this.y + radius, 
        radius, 
        0, 
        Math.PI * 2
      );
    } else {
      ctx.rect(this.x, this.y, this.width, this.height);
    }
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  newPos() {
    // Add boundary checking to newPos
    const potentialNewX = this.x + this.speedX;

    // Ensure the entire rectangle stays within canvas width
    if (potentialNewX >= 0 && potentialNewX + this.width <= this.canvasWidth) {
      this.x = potentialNewX;
    }

    this.y += this.speedY;  
  }
}
