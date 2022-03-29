import Assets from "/src/assets.js"
import Config from "/src/config.js"

let bgBack;
let bgMiddle1;
let bgMiddle2;
let bgMiddle3;
let bgFront;
let bgX = 0;
let player;
let keys = {};
let digSpawn = 0;
let emojiText = ""; 
let emojis = [];
let bgSize= [];

(async () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = {
        method: 'GET',
        headers
    };
    await fetch('/.netlify/functions/getNotionData', options)
    .then(function(response) {
      return response.json();
    }).then(function(data) { 
        emojis = data
        startGame();
    });
})()

const app = new PIXI.Application({width: innerWidth, height: innerHeight});

document
    .querySelector('.game')
    .appendChild(app.view);

function startGame(){
    app.loader.baseUrl = Assets.baseUrl;
    app.loader.add(Assets.assetList);
    app.loader.onComplete.add(initLevel); 

    app.loader.load();
}

function gameLoop(){
    window.addEventListener("keydown", keysDown);
    window.addEventListener("keyup", keysUp);
    if (keys[Config.KEY_FORWARD]){ // -->
        if (player.scale.x > 0){
            player.scale.x = player.scale.x * -1
        }
        playerWalk(Config.walkSpeedForward);
    } else if (keys[Config.KEY_BACKWARDS]) { // <--
        if (player.scale.x < 0){
            player.scale.x = player.scale.x * -1
        }
        playerWalk(Config.walkSpeedBackwards);
    } else if (keys[Config.KEY_P]){ // p
        playerDig();
    } else {
        playerIdle();
    }
    upgradeSky(1);
}

function keysDown(e){
    keys[e.keyCode] = true;
}

function keysUp(e){
    keys[e.keyCode] = false;
}

function initLevel(){
    bgBack = createBg(app.loader.resources["bgBack"].texture);
    bgMiddle1 = createBg(app.loader.resources["bgMiddle1"].texture);
    bgMiddle2 = createBg(app.loader.resources["bgMiddle2"].texture);
    bgMiddle3 = createBg(app.loader.resources["bgMiddle3"].texture);
    player = createPlayer()
    bgFront = createBg(app.loader.resources["bgFront"].texture);
    bgFront.interactive = true;
    bgFront.buttonMode = true;
    bgFront.on('pointerdown', function (e) {
        if (e.data.global.x < (app.renderer.width/2)){
            keys[Config.KEY_FORWARD] = true;
        }else{
            keys[Config.KEY_BACKWARDS] = true;
        }    
      });
    bgFront.on('pointerup', function (e) {
        if (e.data.global.x < (app.renderer.width/2)){
            keys[Config.KEY_FORWARD] = false;
        }else{
            keys[Config.KEY_BACKWARDS] = false;
        }       
    });
    let pickaxe = createPickaxeIcon();
    pickaxe.interactive = true;
    pickaxe.buttonMode = true;
    pickaxe.on('pointerdown', function (e) {
            keys[Config.KEY_P] = true;   
      });
    pickaxe.on('pointerup', function (e) {
        keys[Config.KEY_P] = false;
    });
    emojiText = createEmojiText("")
    app.ticker.add(gameLoop)
}

function createBg(texture){
    let tiling = new PIXI.TilingSprite(texture,1920,1080);
    tiling.position.set(0,0);
    let scaleX;
    let scaleY;
    if (app.view.height > app.view.width){
        scaleX = app.renderer.height/1920
        scaleY = app.renderer.width/1080
    } else{
        scaleX = app.renderer.width/1920
        scaleY = app.renderer.height/1080
    }
    tiling.scale.set(scaleX,scaleY)
    app.stage.addChild(tiling);
    bgSize = [scaleX, scaleY, tiling.height*scaleY];
    return tiling
}

function createPickaxeIcon(){
    let sprite = new PIXI.Sprite.from(app.loader.resources["pickaxeIcon"].texture,520,420);
    sprite.anchor.set(0.5);
    sprite.x = app.renderer.width / 2;
    sprite.y = bgSize[2] * 60 / 100;
    sprite.position.set(sprite.x,sprite.y)
    sprite.scale.set(bgSize[0]*0.1, bgSize[1]*0.1);
    app.stage.addChild(sprite);
    return sprite
}

function createPlayer(){
    player = new PIXI.Sprite.from(app.loader.resources["playerIdle0"].texture,520,420);
    player.anchor.set(0.5);
    player.x = app.renderer.width / 2;
    player.y = bgSize[2] * 82 / 100;
    player.position.set(player.x,player.y)
    player.scale.set(bgSize[0], bgSize[1]);
    app.stage.addChild(player);
    return player
}

function createEmojiText(text){
    const ltext = new PIXI.Text(text,{
        fontFamily : 'upheavtt', 
        fontSize: 35, 
        fontWeight: 900,
        fill : "#141414", 
        align : 'center'});
    ltext.anchor.set(0.5);
    ltext.x = app.renderer.width / 2;
    ltext.y = app.renderer.height * 96 / 100;
    app.stage.addChild(ltext);
    return ltext
}

function upgradeSky(windSpeed){
    let windX = (bgBack.tilePosition.x + windSpeed)
    bgBack.tilePosition.x = windX
}

function playerIdle(){
    let characterFrame = Math.floor(Date.now()/100) % 11;
    player.texture = app.loader.resources[`playerIdle${characterFrame}`].texture;
}

function playerWalk(walkSpeed){
    bgX = (bgX + walkSpeed);
    bgMiddle1.tilePosition.x = bgX * 0.2;
    bgMiddle2.tilePosition.x = bgX * 0.4;
    bgMiddle3.tilePosition.x = bgX * 0.6 ;   
    bgFront.tilePosition.x = bgX * 0.9;
    let characterFrame = Math.floor(Date.now()/60) % 17;
    player.texture = app.loader.resources[`playerWalk${characterFrame}`].texture;
}

function playerDig(){
    let characterFrame = Math.floor(Date.now()/60) % 12
    player.texture = app.loader.resources[`playerDig${characterFrame}`].texture
    if (characterFrame == 11){
        digSpawn += 1;
        let randomEmoji = Math.floor(Math.random() * 4);
        if ((digSpawn == 6)){
            emojiText.text = `${emojis[randomEmoji].emoji}`
            digSpawn = 0;
        }
    }
}
