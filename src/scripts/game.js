import {Shoot, Saucer, Starship, BossShip} from './mobile';
import GetSound from './sound';

export default class Game {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.starship = new Starship(40,(this.canvas.height/2)-Starship.STARSHIP_HEIGHT/2);
        this.saucer = new Array();
        this.shoot = new Array(); // array des shoots du joueurs
        this.boss = new Array(); // array qui est soit vide si pas de boss soit avec un élément qui est du type BossShip
        this.shootBoss = new Array(); // array des shoots du boss
        this.bossShooting = null; // contient ou non le setInterval qui a pour callback addBossShoot
        this.score = document.getElementById("score");
        this.flotteSaucer = null; // contient ou non le setInterval qui a pour callback addSaucer
        this.gameOverImg = new Image(); // Image du GameOver
        this.gameOverImg.src = './images/gameover.png'; // Image du GameOver
        this._hp = null; // contient le nombre de points de vie du starship joueur voir buildFUllHP
        this._saucerKilled = 0; // compteur de saucers tués, au bout de 25 tués un boss spwan 
        this.raf = null; // raf...

        this.start(); // lancement du premier appel à moveAndDraw
    }

    start() {
        this.buildFullHP();
        this.moveAndDraw();
    }

    buildFullHP() {
        this.hp = 3;
        const hpspan = document.querySelectorAll(".hp"); // on récupére les élements la class hp voir les div des hp dans index.html
        hpspan.forEach(hp => hp.style.display = "inline-block");
    }

    gameOver() {
        // on stop tout ce qui doit être arrêtés puis on effectue un timeout
        this.flotteSaucerOFF();
        clearInterval(this.bossShooting);
        this.raf = null;
        GetSound.GAMEOVER.play();
        window.setTimeout(() => {
            this.ctx.drawImage(this.gameOverImg,280,10);
        },1);
    }

    moveAndDraw() {
        if (this.hp > 0) {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
            this.starship.draw(this.ctx);
            if (this.checkBoss()) {
                this.boss[0].draw(this.ctx);
                this.shootBoss.forEach( s => s.draw(this.ctx));
                this.shootBoss = this.shootBoss.filter(s => !s.collisionWithStarship(this));
                this.shootBoss = this.shootBoss.filter(s => s.moveBoss());
                this.boss[0].move(this.canvas);
            }
            this.shoot.forEach( s => s.draw(this.ctx));
            this.shoot = this.shoot.filter(s => (!s.collisionWithSaucer(this) && !s.collisionWithBoss(this)));
            this.shoot = this.shoot.filter( s => s.move(this.canvas));
            this.saucer = this.saucer.filter(s => s.move(this.canvas,this.score));
            this.saucer.forEach(s => s.draw(this.ctx));
            this.starship.collisionWithSaucer(this);
            this.starship.move(this.canvas);
            this.raf = window.requestAnimationFrame(this.moveAndDraw.bind(this));
        } else {
            this.gameOver(); // si le joueur n'a plus de points de vie on lance la méthode gameOver
        }
    }

    keyUpActionHandler(event) {
        switch (event.key) {
            case " ":
                break;
            case "ArrowUp":
            case "Up":
            case "ArrowDown":
            case "Down":
                this.starship.stopMoving();
                if (this.checkBoss()) {
                    this.boss[0].stopMoving();
                }
                break;
            default: return;
        }
        event.preventDefault();
    }

    keyDownActionHandler(event) {
        switch (event.key) {
            case " ":
                this.addShoot();
                GetSound.SHOOT.play();
                break;
            case "ArrowUp":
            case "Up":
                this.starship.moveUp();
                if(this.checkBoss()) {
                    this.boss[0].moveUp();
                }
                break;
            case "ArrowDown":
            case "Down":
                this.starship.moveDown();
                if (this.checkBoss()) {
                    this.boss[0].moveDown();
                }
                break;
            default: return;
        }
        event.preventDefault();
    }

    addSaucer() {
        const y = alea(0, this.canvas.height - Saucer.SAUCER_HEIGHT); // alea défini en fin de fichier game.js
        const x = this.canvas.width-Saucer.SAUCER_WIDTH;
        this.saucer.push(new Saucer(x,y));
    }

    addShoot() {
        this.shoot.push(new Shoot(this.starship.x+Starship.STARSHIP_WIDTH,this.starship.y+Starship.STARSHIP_HEIGHT/4));
    }

    addBoss() {
        this.boss.push(new BossShip(this.canvas.width-BossShip.BOSSSHIP_WIDTH,this.starship.y-20));
        this.bossShooting = window.setInterval(this.addBossShoot.bind(this),630);
    }

    addBossShoot() {
        GetSound.BOSS_SHOOT.play();
        this.shootBoss.push(new Shoot(this.boss[0].x-30,this.boss[0].y+BossShip.BOSSSHIP_HEIGHT/2.5,true));
    }

    checkBoss() {
        if (this.boss.length === 1) {
            if (this.boss[0].hp > 0) {
                return true;
            } else {
                GetSound.BOSS_KILLED.play();
                this.boss = new Array();
                this.score.innerHTML = parseInt(score.innerHTML,10) + 5000;
                clearInterval(this.bossShooting);
                this.buildFullHP();
            }
        } else if (this.boss.length === 0 && this.saucerKilled === 20) {
            GetSound.BOSS_INC.play();
        } else if (this.boss.length === 0 && this.saucerKilled >= 25) {
            this.saucerKilled = 0;
            this.addBoss();
        }
        return false;
    }

    flotteSaucerON() {
        GetSound.CLICK.play();
        document.getElementById('flotteSoucoupes').style.backgroundColor = "aquamarine";
        this.flotteSaucer = window.setInterval(this.addSaucer.bind(this),750);
        document.getElementById('flotteSoucoupes').onclick = this.flotteSaucerOFF.bind(this);
        document.activeElement.blur();
    }
    
    flotteSaucerOFF() {
        GetSound.CLICK.play();
        document.getElementById('flotteSoucoupes').style = "orignal";
        document.activeElement.blur();
        clearInterval(this.flotteSaucer);
        document.getElementById('flotteSoucoupes').onclick = this.flotteSaucerON.bind(this);

    }

    get hp() {
        return this._hp;
    }

    set hp(hp) {
        if (this._hp > hp) {
            GetSound.STARSHIP_HITED.play();
        }
        this._hp = hp;
    }

    get saucerKilled() {
        return this._saucerKilled;
    }

    set saucerKilled(n) {
        this._saucerKilled = n ;
    }

    restartGame() {
        this.score.innerHTML = parseInt(0,10);
        this.flotteSaucerOFF();
        this.raf = null;
        clearInterval(this.bossShooting);
        window.clearTimeout(); // si timeout du gameOver actif
        document.activeElement.blur();
    }
}

const alea = (a, b) => {
    const min = Math.ceil(a);
    const max = Math.floor(b);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
