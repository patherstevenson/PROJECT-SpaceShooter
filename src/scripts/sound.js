export class Sound {

    constructor (filename,format) {
        this._audio = new Audio(`./sound/${filename}.${format}`);
    }

    play() {
        this._audio.play();
    }

    volume(vol){
        this._audio.volume = vol;
    }

    get audio() {
        return this._audio;
    }

    
}

const BACKGROUND = new Sound('background','wav');
const CLICK = new Sound('click','wav');
const GAMEOVER = new Sound('gameover','wav');
const SHOOT = new Sound('shoot','wav');
const BOSS_KILLED = new Sound('boss_killed','wav');
const SAUCER_HITED = new Sound('saucer_hited','wav');
const STARSHIP_HITED = new Sound('starship_hited','wav');
const BOSS_SHOOT = new Sound('boss_shoot','wav');
const BOSS_INC = new Sound('boss_inc','wav');
const BOSS_HITED = new Sound('boss_hited','wav');

BACKGROUND.volume(0.08);
CLICK.volume(0.2);
GAMEOVER.volume(0.1);
SHOOT.volume(0.1);
BOSS_KILLED.volume(0.1);
SAUCER_HITED.volume(0.1);
STARSHIP_HITED.volume(0.1);
BOSS_SHOOT.volume(0.05);
BOSS_INC.volume(0.1);
BOSS_HITED.volume(0.1);

export default class GetSound {

    static get GAMEOVER() { return GAMEOVER};
    static get SHOOT() { return SHOOT};
    static get BOSS_KILLED() { return BOSS_KILLED};
    static get SAUCER_HITED() { return SAUCER_HITED};
    static get STARSHIP_HITED() { return STARSHIP_HITED};
    static get BOSS_SHOOT() { return BOSS_SHOOT};
    static get BOSS_INC() { return BOSS_INC};
    static get BOSS_HITED() { return BOSS_HITED};
    static get BACKGROUND() { return BACKGROUND};
    static get CLICK() { return CLICK};
}


