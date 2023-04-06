const rows = 30;
const cols = 30;
const size = 20; // The size of each cell (20x20)

class Apple {
    constructor() {
        this.x = Math.floor(Math.random() * cols);
        this.y = Math.floor(Math.random() * rows);
        this.color = '#e8463a';
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * size, this.y * size, size, size);
    }
}

export default Apple;
