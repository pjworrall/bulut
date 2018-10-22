// prototype to abstract out

function Timer() {

    this.run = function (sound, timer) {
        let self = this;

        // Determine our current seek position.
        let seek = Math.round( sound.seek() || 0 );

        let minutes = Math.floor(seek / 60) || 0;
        let seconds = (seek - minutes * 60) || 0;

        timer.innerHTML = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

        // If the sound is still playing, continue stepping.
        if (sound.playing()) {
            requestAnimationFrame(step.bind(self));
        }
    };
}

export { Timer }