import Game from './game.js';
import GetSound from './sound';

// mise en place de la boucle de gameplay et gestion des event claviers et boutons
const init = () => {
    const canvas = document.getElementById("stars");
    const game = new Game(canvas);
    document.getElementById("nouvelleSoucoupe").addEventListener("click", () =>{
        GetSound.CLICK.play();
        game.addSaucer();
        document.activeElement.blur();
    });
    window.addEventListener('keydown', game.keyDownActionHandler.bind(game));
    window.addEventListener('keyup', game.keyUpActionHandler.bind(game));
    document.getElementById('flotteSoucoupes').onclick = game.flotteSaucerON.bind(game);
    document.getElementById("addboss").addEventListener('click',() => {
        if (!game.checkBoss()) {
            GetSound.CLICK.play();
            GetSound.BOSS_INC.play();
            game.addBoss();
        }
        document.activeElement.blur();
    });
    document.getElementById("restart").addEventListener("click", () => {
        GetSound.CLICK.play();
        game.restartGame();
        init();
    })
}
// gestion du son en fond (background.wav) avec l'autoplay en fonction de si le navigateur est chrome ou non
// car chrome refuse l'autoplay avant interaction avec l'user
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

if (!isChrome){
    GetSound.BACKGROUND.play();
} else {
    document.getElementById("music").setAttribute('value',0);
}
document.getElementById("music").addEventListener("click", () => {
    if(document.getElementById("music").getAttribute('value') == 0) {
        GetSound.CLICK.play();
        GetSound.BACKGROUND.play();
        GetSound.BACKGROUND.volume(0.08);
        document.getElementById("music").setAttribute('value',1);
    } else{
        GetSound.CLICK.play();
        GetSound.BACKGROUND.volume(0);
        document.getElementById("music").setAttribute('value',0);
    }
});
// lancement de init au chargement de page
window.addEventListener("load",init);

console.log('le bundle a été généré');
