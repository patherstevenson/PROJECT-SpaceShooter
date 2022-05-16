import MoveState from './movestate';
import GetSound from './sound';

import StarshipImgSrc from '../assets/images/vaisseau-ballon-petit.png';
import ShootImgSrc from '../assets/images/tir.png';
import SaucerImgSrc from '../assets/images/flyingSaucer-petit.png';
import BossShipImgSrc from '../assets/images/boss.png';
import ShootBossImgSrc from '../assets/images/bosstir.png';

export default class Mobile {

    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.image = new Image();
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y);
    }

    __collisionWith(mobile) {
        const p1 = { 
            abs1 : Math.max(this.x, mobile.x),
            ord1 : Math.max(this.y, mobile.y)
        };
        const p2 = { 
            abs2 : Math.min(this.x+this.image.width, mobile.x+mobile.image.width), 
            ord2 : Math.min(this.y+this.image.height, mobile.y+mobile.image.height)
        };
        return (p1.abs1 <= p2.abs2 && p1.ord1 <= p2.ord2);
    }
}

export class Starship extends Mobile {

    static STARSHIP_WIDTH = 48;
    static STARSHIP_HEIGHT = 44; // img 39 mais pour hitbox en haut du starship en étant en bas du canvas vs un boss
    static VERTICAL_STEP = 8;

    constructor (x,y) {
        super(x,y);
        this.image.src = StarshipImgSrc;
        this.image.width = Starship.STARSHIP_WIDTH;
        this.image.height = Starship.STARSHIP_HEIGHT;
        this.moving = MoveState.NONE;
        this.shiftY = 0;
    }

    stopMoving() {
        this.moving = MoveState.NONE;
    }

    moveUp() {
        this.shiftY = - Starship.VERTICAL_STEP;
        this.moving = MoveState.UP;
    }

    moveDown() {
        this.shiftY = + Starship.VERTICAL_STEP;
        this.moving = MoveState.DOWN;
    }

    move(canvas) {
        if (this.moving === MoveState.UP) {
            this.y = Math.max(0, this.y + this.shiftY);
        }
        if (this.moving === MoveState.DOWN) {
            this.y = Math.min(canvas.height - Starship.STARSHIP_HEIGHT, this.y + this.shiftY);
        }
    }

    collisionWithSaucer(game) {
        const saucer = game.saucer;

        const nf = saucer.filter(s => !s.isFalling());
        let i = 0;
        while (i < nf.length && game.hp > 0) {
            if (this.__collisionWith(nf[i])) {
                nf[i].setFalling();
                document.getElementById(`hp${game.hp}`).style.display = "none";
                game.hp += -1;
            }
            i++;
        }
    }
}

export class Saucer extends Mobile {

    static SAUCER_WIDTH= 48;
    static SAUCER_HEIGHT= 36;
    static HORIZONTAL_STEP = -3;

    constructor(x,y){
        super(x,y);
        this.image.src = SaucerImgSrc;
        this.image.width = Saucer.SAUCER_WIDTH;
        this.image.height = Saucer.SAUCER_HEIGHT;
        this._vertical_step = 0
    }

    get vertical_step() {
        return this._vertical_step;
    }

    set vertical_step(nb) {
        this._vertical_step = nb;
    }

    setFalling() {
        this.vertical_step = 3;
    }

    isFalling() {
        return this.vertical_step > 0;
    }

    move(canvas,score) {
        if (this.x > 0 && !this.isFalling()) {
            this.x += Saucer.HORIZONTAL_STEP;
            return true;
        } else if (this.isFalling() && this.y < canvas.height-Saucer.SAUCER_HEIGHT){
            this.y += this.vertical_step;
            return true;
        }else{
            if (this.x <= 0 && parseInt(score.innerHTML,10) > 0){
                if (parseInt(score.innerHTML,10) > 1000) {
                    score.innerHTML = parseInt(score.innerHTML,10) - 1000;
                }
                else {
                    score.innerHTML = 0;
                }
            }
            return false;
        }
    }
}

export class Shoot extends Mobile {

    static SHOOT_WIDTH= 32;
    static SHOOT_HEIGHT= 8;
    static HORIZONTAL_STEP = 8;

    constructor(x,y,boss=false){
        super(x,y);
        if (boss) {
            this.image.src = ShootBossImgSrc;
        } else {
            this.image.src= ShootImgSrc
        }
        this.image.width = Saucer.SHOOT_WIDTH;
        this.image.height = Saucer.SHOOT_HEIGHT;
        this._damage = 5;
    }
    
    move(canvas) {
        if (this.x < canvas.width-Shoot.SHOOT_WIDTH) {
            this.x += Shoot.HORIZONTAL_STEP;
            return true;
        }
        else {
            return false;
        }
    }

    moveBoss() {
        if (this.x > 0) {
            this.x += - 2.5*Shoot.HORIZONTAL_STEP;
            return true;
        }
        else {
            return false;
        }
    }

    collisionWithSaucer(game) {
        const score = game.score;
        const saucer = game.saucer;
        const nf = saucer.filter(s => !s.isFalling());
        let i = 0;
        while (i < nf.length) {
            if (this.__collisionWith(nf[i])) {
                GetSound.SAUCER_HITED.play();
                nf[i].setFalling();
                score.innerHTML = parseInt(score.innerHTML,10) + 200;
                game.saucerKilled += 1;
                return true;
            }
            i++;
        }
        return false;
    }

    collisionWithStarship(game) {
        const starship = game.starship;
        if (this.__collisionWith(starship) && game.hp > 0) {
            document.getElementById(`hp${game.hp}`).style.display = "none";
            game.hp -= 1;
            return true;
        }
        return false;
    }

    collisionWithBoss(game) {
        if (game.checkBoss()) {
            const boss = game.boss[0];
            if (this.__collisionWith(boss) && boss.hp > 0) {
                GetSound.BOSS_HITED.play();
                boss.hp -= this._damage;
                return true;
            }
        }
        return false;
    }
}

export class BossShip extends Mobile {

    static BOSSSHIP_WIDTH = 145;
    static BOSSSHIP_HEIGHT = 71; // img 75 hauteur mais sinon pas de shoot sur le starship en bas de canvas
    static VERTICAL_STEP = 8;

    constructor(x,y){
        super(x,y);
        this._hp = 200;
        this.image.src = BossShipImgSrc;
        this.image.width = BossShip.BOSSSHIP_WIDTH;
        this.image.height = BossShip.BOSSSHIP_HEIGHT;
        this.shiftY = 0;
        this.moving
    }

    stopMoving() {
        this.moving = MoveState.NONE;
    }

    moveUp() {
        this.shiftY = - BossShip.VERTICAL_STEP;
        this.moving = MoveState.UP;
    }

    moveDown() {
        this.shiftY = + BossShip.VERTICAL_STEP;
        this.moving = MoveState.DOWN;
    }

    move(canvas) {
        if (this.moving === MoveState.UP) {
            this.y = Math.max(0, this.y + this.shiftY);
        }
        if (this.moving === MoveState.DOWN) {
            this.y = Math.min(canvas.height - BossShip.BOSSSHIP_HEIGHT, this.y + this.shiftY);
        }
    }

    get hp() {
        return this._hp;
    }

    set hp(hp) {
        this._hp = hp;
    }
    
}