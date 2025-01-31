class Pipes {
    #context;
    #canvas;
    #sprite;
    #bird;
    #sounds;
    #score;
    #position;
    #top;
    #bottom;
    #width;
    #height;
    #gap;
    #maxYPos;
    #game;

    constructor(context, canvas, sprite, bird, sounds, score, game) {
        this.#context = context;
        this.#canvas = canvas;
        this.#sprite = sprite;
        this.#bird = bird;
        this.#sounds = sounds;
        this.#score = score;
        this.#game = game;

        this.#position = [];
        this.#top = {sX: 553, sY: 0};
        this.#bottom = {sX: 502, sY: 0};
        this.#width = 53;
        this.#height = 400;
        this.#gap = 85;
        this.#maxYPos = -150;
        this.driveX = 2;
        this.pipeFrequency = 100;
    }

    draw() {
        this.#position.forEach((p) => {
            const topYPos = p.y;
            const bottomYPos = p.y + this.#height + this.#gap;
            this.#context.drawImage(this.#sprite, this.#top.sX, this.#top.sY, this.#width, this.#height, p.x, topYPos, this.#width, this.#height);
            this.#context.drawImage(this.#sprite, this.#bottom.sX, this.#bottom.sY, this.#width, this.#height, p.x, bottomYPos, this.#width, this.#height);
        });
    }

    update(state, frames) {
        if (state.current !== state.game) return;

        if (frames % this.pipeFrequency === 0) {
            this.#position.push({x: this.#canvas.width, y: this.#maxYPos * (Math.random() + 1)});
        }

        this.#position.forEach((p, index) => {
            const bottomPipeYPos = p.y + this.#height + this.#gap;
            const birdX = this.#bird.x + this.#bird.radius;

            if (birdX > p.x && this.#bird.x - this.#bird.radius < p.x + this.#width) {
                if (this.#bird.y + this.#bird.radius > p.y && this.#bird.y - this.#bird.radius < p.y + this.#height) {
                    state.current = state.over;
                    this.#sounds.DIE_SND.play().then(_ => null);
                }
                if (this.#bird.y + this.#bird.radius > bottomPipeYPos && this.#bird.y - this.#bird.radius < bottomPipeYPos + this.#height) {
                    state.current = state.over;
                    this.#sounds.DIE_SND.play().then(_ => null);
                }
            }

            if (!p.centerScored && this.#bird.x + this.#bird.radius > p.x + this.#width / 2 && this.#bird.x - this.#bird.radius < p.x + this.#width / 2) {
                this.#score.increment();
                p.centerScored = true;
            }

            p.x -= this.driveX;
            if (p.x + this.#width <= 0) {
                this.#position.splice(index, 1);
            }
        });

        this.#game.increaseGameSpeed();
    }

    reset() {
        this.#position = [];
        this.driveX = 2;
        this.pipeFrequency = 100;
    }
}

export default Pipes;
