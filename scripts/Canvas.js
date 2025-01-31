class Canvas {
    #canvas;
    #context;
    #sprite;
    #bird;
    #pipes;
    #score;
    #background;
    #foreground;
    #getReady;
    #gameOver;

    constructor(canvas, context, sprite, bird, pipes, score) {
        this.#canvas = canvas;
        this.#context = context;
        this.#sprite = sprite;
        this.#bird = bird;
        this.#pipes = pipes;
        this.#score = score;

        this.#background = this.#createBackground();
        this.#foreground = this.#createForeground();
        this.#getReady = this.#createGetReady();
        this.#gameOver = this.#createGameOver();
    }

    #createBackground() {
        return {
            sX: 0,
            sY: 0,
            pWidth: 275,
            pHeight: 226,
            x: 0,
            y: this.#canvas.height - 226,
            draw: () => {
                this.#context.drawImage(this.#sprite, this.#background.sX, this.#background.sY, this.#background.pWidth, this.#background.pHeight, this.#background.x, this.#background.y, this.#background.pWidth, this.#background.pHeight);
                this.#context.drawImage(this.#sprite, this.#background.sX, this.#background.sY, this.#background.pWidth, this.#background.pHeight, this.#background.x + this.#background.pWidth, this.#background.y, this.#background.pWidth, this.#background.pHeight);
            }
        };
    }

    #drawImage(layer) {
        this.#context.drawImage(this.#sprite, layer.sX, layer.sY, layer.pWidth, layer.pHeight, layer.x, layer.y, layer.pWidth, layer.pHeight);
    }

    #createForeground() {
        return {
            sX: 276,
            sY: 0,
            pWidth: 224,
            pHeight: 112,
            x: 0,
            y: this.#canvas.height - 112,
            driveX: 2,
            draw: () => {
                this.#drawImage(this.#foreground);
                this.#drawImage({...this.#foreground, x: this.#foreground.x + this.#foreground.pWidth});
            },
            update: (state) => {
                if (state.current !== state.over) {
                    this.#foreground.x = (this.#foreground.x - this.#foreground.driveX) % (this.#foreground.pWidth / 2);
                }
            }
        };
    }

    #createGetReady() {
        return {
            sX: 0,
            sY: 228,
            pWidth: 173,
            pHeight: 152,
            x: this.#canvas.width / 2 - 173 / 2,
            y: 80,
            draw: (state) => {
                if (state.current === state.getReady) {
                    this.#drawImage(this.#getReady);
                }
            }
        };
    }

    #createGameOver() {
        return {
            sX: 175,
            sY: 228,
            pWidth: 225,
            pHeight: 202,
            x: this.#canvas.width / 2 - 225 / 2,
            y: 90,
            draw: (state) => {
                if (state.current === state.over) {
                    this.#drawImage(this.#gameOver);
                }
            }
        };
    }

    draw(state) {
        this.#context.fillStyle = "#70c5ce";
        this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);

        this.#background.draw();
        this.#pipes.draw();
        this.#foreground.draw();
        this.#bird.draw();
        this.#getReady.draw(state);
        this.#gameOver.draw(state);
        this.#score.draw(state);
    }

    update(state, frames) {
        this.#bird.update(frames, state, this.#foreground);
        this.#foreground.update(state);
        this.#pipes.update(state, frames);
    }
}

export default Canvas;
