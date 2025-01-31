class BirdMovement {
    #bird;
    #sounds;
    #gravity;
    #jump;
    #speed;
    #rotation;
    #degree;
    #slowDownFrameRate;

    constructor(bird, sounds, degree) {
        this.#bird = bird;
        this.#sounds = sounds;
        this.#gravity = 0.3;
        this.#jump = 4.6;
        this.#speed = 0;
        this.#rotation = 0;
        this.#degree = degree;
        this.#slowDownFrameRate = false;
    }

    update(state, fgHeight, cvsHeight) {
        if (state.current === state.getReady) {
            this.#bird.y = 150;
            this.#rotation = 0;
        } else {
            this.#speed += this.#gravity;
            this.#bird.y += this.#speed;

            if (this.#bird.y + this.#bird.height / 2 >= cvsHeight - fgHeight) {
                this.#bird.y = cvsHeight - fgHeight - this.#bird.height / 2;
                if (state.current === state.game) {
                    state.current = state.over;
                    this.#sounds.DIE_SND.play().then(_ => null);
                }
            }

            if (this.#speed >= this.#jump) {
                this.#rotation += (90 * this.#degree - this.#rotation) * 0.08;
                this.#slowDownFrameRate = true;
            } else {
                this.#rotation -= (this.#rotation + 25 * this.#degree);
                this.#slowDownFrameRate = false;
            }
        }
    }

    flap() {
        this.#speed = -this.#jump;
    }

    resetSpeed() {
        this.#speed = 0;
    }

    getRotation() {
        return this.#rotation;
    }

    shouldSlowDownFrameRate() {
        return this.#slowDownFrameRate;
    }
}

export default BirdMovement;
