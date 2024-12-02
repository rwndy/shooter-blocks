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
        this.coordinateDisplay.style.left = `${
            this.canvas.offsetLeft + this.canvas.width
        }px`;
        document.body.appendChild(this.coordinateDisplay);

        this.setupCanvas();
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
    private dx: number = 2;
    private dy: number = -2;
    private isGameOver: boolean = false;

    constructor(
        canvasId: string,
        width: number,
        height: number,
        color: string,
        x: number,
        y: number,
        isCircle: boolean = true
    ) {
        super(canvasId);
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
        if (
            potentialNewX >= 0 &&
            potentialNewX + this.width <= this.canvasWidth
        ) {
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
            ctx.arc(this.x + radius, this.y + radius, radius, 0, Math.PI * 2);
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
        if (
            potentialNewX >= 0 &&
            potentialNewX + this.width <= this.canvasWidth
        ) {
            this.x = potentialNewX;
        }

        this.y += this.speedY;
    }

    startBall() {
        // Check if game is already over
        if (this.isGameOver) return;

        // Bounce horizontally
        if (
            this.x + this.dx > this.canvasWidth - this.width ||
            this.x + this.dx < 0
        ) {
            this.dx = -this.dx;
        }

        // Check vertical boundary and game over condition
        if (this.y + this.dy < 0) {
            // Bounce off top
            this.dy = -this.dy;
        } else if (this.y + this.dy > this.canvasHeight - this.height) {
            // Reached bottom - stop movement
            this.y = this.canvasHeight - this.height;
            this.dx = 0;
            this.dy = 0;
            this.isGameOver = true;
        }

        // Update position only if not game over
        if (!this.isGameOver) {
            this.x += this.dx;
            this.y += this.dy;
        }
    }
    public isGameOverState(): boolean {
        return this.isGameOver;
    }

    public getSpeedY(): number {
        return this.speedY;
    }

    public setSpeedY(speed: number): void {
        // Optional: Add boundary checking if needed
        this.speedY = speed;
    }

    public getY(): number {
        return this.y;
    }

    public getDx(): number {
        return this.dx;
    }

    // Method to get current dy (vertical speed)
    public getDy(): number {
        return this.dy;
    }

    public setBallSpeed(dx: number, dy: number) {
        this.dx = dx;
        this.dy = dy;
    }
}
