import BirdMovement from './BirdMovement.js';

class Bird {
    #context;
    #canvas;
    #sounds;
    #degree;
    #sprite;
    #animation;
    #movement;

    constructor(context, canvas, sounds, degree, sprite) {
        this.#context = context;
        this.#canvas = canvas;
        this.#sounds = sounds;
        this.#degree = degree;
        this.#sprite = sprite;

        this.#animation = [
            {sX: 276, sY: 112},
            {sX: 276, sY: 139},
            {sX: 276, sY: 164},
            {sX: 276, sY: 139}
        ];
        this.x = 50;
        this.y = 150;
        this.width = 34;
        this.height = 26;
        this.radius = 12;
        this.frame = 0;
        this.period = 0;

        this.#movement = new BirdMovement(this, this.#sounds, degree);
    }

    draw() {
        const bird = this.#animation[this.frame];
        this.#context.save();
        this.#context.translate(this.x, this.y);
        this.#context.rotate(this.#movement.getRotation());
        this.#context.drawImage(this.#sprite, bird.sX, bird.sY, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height);
        this.#context.restore();
    }

    flap() {
        this.#movement.flap();
    }

    update(frames, state, fg) {
        this.period = state.current === state.getReady ? 10 : 5;
        if (this.#movement.shouldSlowDownFrameRate()) {
            this.period *= 2;
        }
        this.frame += frames % this.period === 0 ? 1 : 0;
        this.frame = this.frame % this.#animation.length;

        this.#movement.update(state, fg.pHeight, this.#canvas.height);
        this.frame = this.#movement.getRotation() >= 90 * this.#degree ? 1 : this.frame;
    }

    speedReset() {
        this.#movement.resetSpeed();
    }
}

export default Bird;
