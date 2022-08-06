// import * as PIXI from "pixi.js";

const { isMobile } = require("pixi.js");
import { STAGE } from "./constant";
import IdleScreen from "./screen/Idle";
import PlayingScreen from "./screen/Playing";
import GameOverScreen from "./screen/GameOver";

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  transparent: true,
});
document.body.appendChild(app.view);

let stage = STAGE.IDLE;

let width, height;
if (isMobile.any) {
  width = window.innerHeight;
  height = window.innerWidth;
  app.stage.x = height / 2;
  app.stage.y = width / 2;
  app.stage.pivot.x = width / 2;
  app.stage.pivot.y = height / 2;
  app.stage.angle = 90;
} else {
  width = window.innerWidth;
  height = window.innerHeight;
}

let idleScreen, playingScreen, gameOverScreen;

//load assets
app.loader
  .add("bg", "assets/bg.png")
  .add("plane_dead", "assets/plane/dead.png")
  .add("plane_fly_1", "assets/plane/fly_1.png")
  .add("plane_fly_2", "assets/plane/fly_2.png")
  .add("plane_shoot_1", "assets/plane/shoot_1.png")
  .add("plane_shoot_2", "assets/plane/shoot_2.png")
  .add("plane_shoot_3", "assets/plane/shoot_3.png")
  .add("plane_shoot_4", "assets/plane/shoot_4.png")
  .add("plane_shoot_5", "assets/plane/shoot_5.png")
  .add("bullet_1", "assets/bullet/bullet_1.png")
  .add("bullet_2", "assets/bullet/bullet_2.png")
  .add("bullet_3", "assets/bullet/bullet_3.png")
  .add("bullet_4", "assets/bullet/bullet_4.png")
  .add("bullet_5", "assets/bullet/bullet_5.png")
  .add("enemy", "assets/enemy/enemy.json")
  .load(onAssetsLoaded);

function onAssetsLoaded(_loader, resources) {
  idleScreen = new IdleScreen(width, height, onNextStage(STAGE.PLAYING));
  playingScreen = new PlayingScreen(
    width,
    height,
    resources,
    onNextStage(STAGE.OVER)
  );
  gameOverScreen = new GameOverScreen(
    width,
    height,
    onNextStage(STAGE.PLAYING)
  );
  app.stage.addChild(idleScreen.container);
  app.stage.addChild(playingScreen.container);
  app.stage.addChild(gameOverScreen.container);

  idleScreen.play();

  app.stage.interactive = true;
  app.ticker.add(update);
}

function update(delta) {
  switch (stage) {
    case STAGE.IDLE:
      idleScreen.update(delta);
      break;
    case STAGE.PLAYING:
      playingScreen.update(delta);
      break;
    case STAGE.OVER:
      gameOverScreen.update(delta);
      break;
    default:
      break;
  }
}

function onNextStage(updateStage) {
  return function () {
    stage = updateStage;
    switch (stage) {
      case STAGE.PLAYING:
        playingScreen.play();
        break;
      case STAGE.OVER:
        gameOverScreen.play();
        break;
      default:
        break;
    }
  };
}
