import { CONFIG, LEVEL } from "../constant";
import { bg } from "../object/bg";

class PlayingScreen {
  constructor(width, height, resources, onNextStage) {
    this.initial(resources);
    this.width = width;
    this.height = height;
    this.level = LEVEL.EASY;
    this.score = 0;
    this.container = new PIXI.Container();
    this.onNextStage = onNextStage;
  }

  initial(resources) {
    this.bgTexture = new PIXI.Texture(resources.bg.texture);

    this.planeFlyTexture = [
      new PIXI.Texture(resources.plane_fly_1.texture),
      new PIXI.Texture(resources.plane_fly_2.texture),
    ];

    this.planeShootTexture = [
      new PIXI.Texture(resources.plane_shoot_1.texture),
      new PIXI.Texture(resources.plane_shoot_2.texture),
      new PIXI.Texture(resources.plane_shoot_3.texture),
      new PIXI.Texture(resources.plane_shoot_4.texture),
      new PIXI.Texture(resources.plane_shoot_5.texture),
    ];

    this.bulletTexture = [
      new PIXI.Texture(resources.bullet_1.texture),
      new PIXI.Texture(resources.bullet_2.texture),
      new PIXI.Texture(resources.bullet_3.texture),
      new PIXI.Texture(resources.bullet_4.texture),
      new PIXI.Texture(resources.bullet_5.texture),
    ];

    this.enemyTextures = Object.values(resources.enemy.textures);
  }

  play() {
    this.current = true;
    this.bgContainer = new PIXI.Container();
    this.container.addChild(this.bgContainer);
    this.bgContainer.addChild(bg(this.bgTexture, this.width, this.height));
    this.bgContainer.addChild(
      bg(this.bgTexture, this.width, this.height, this.width)
    );

    //plane
    this.createPlane();

    //bullet
    this.pulletContainer = new PIXI.Container();
    this.container.addChild(this.pulletContainer);
    this.createBullets();

    //enemy
    this.enemyContainer = new PIXI.Container();
    this.container.addChild(this.enemyContainer);
    this.createEnemy();

    //score
    this.createScore();
  }

  createPlane() {
    this.plane = new PIXI.AnimatedSprite(this.planeFlyTexture);
    this.container.addChild(this.plane);
    this.plane.scale.set(0.25);
    this.plane.anchor.set(0.5);
    this.plane.x = 100;
    this.plane.y = this.height - 200;
    this.plane.onComplete = this.onComplete.bind(this);
    this.plane.play();
    this.plane.interactive = true;
    this.plane.on("pointerdown", this.onDragStart.bind(this));
    this.plane.on("pointerup", this.onDragEnd.bind(this));
    this.plane.on("touchstart", this.onDragStart.bind(this));
    this.plane.on("touchend", this.onDragEnd.bind(this));
  }

  createBullets() {
    if (!this.current) return;
    const { bullet } = CONFIG[this.level];
    switch (this.level) {
      case LEVEL.EASY:
        this.createBullet(bullet.x);
        break;
      case LEVEL.MEDIUM:
        this.createBullet(bullet.x, -bullet.y);
        this.createBullet(bullet.x, bullet.y);
        break;
      case LEVEL.HARD:
      case LEVEL.VERY_HARD:
        this.createBullet(bullet.x, -bullet.y);
        this.createBullet(bullet.x);
        this.createBullet(bullet.x, bullet.y);
        break;
      default:
        break;
    }
    this.plane.textures = this.planeShootTexture;
    this.plane.loop = false;
    this.plane.play();
    setTimeout(this.createBullets.bind(this), bullet.timeout);
  }

  createBullet(deltaX, deltaY = 0) {
    const bullet = new PIXI.AnimatedSprite(this.bulletTexture);
    this.pulletContainer.addChild(bullet);
    bullet.anchor.set(0.5);
    bullet.scale.set(0.25);
    bullet.x = this.plane.x + this.plane.width * 0.235;
    bullet.y = this.plane.y + this.plane.height * 0.235;
    bullet.deltaX = deltaX;
    bullet.deltaY = deltaY;
    bullet.animationSpeed = 4;
    bullet.play();
  }

  createEnemy() {
    if (!this.current) return;
    const { enemy: config } = CONFIG[this.level];
    const enemy = new PIXI.Sprite(
      this.enemyTextures[Math.floor(Math.random() * 10)]
    );
    this.enemyContainer.addChild(enemy);
    enemy.anchor.set(0.5);
    enemy.scale.set(0.1);
    enemy.x = this.width + this.plane.width / 2;
    enemy.y = Math.round(Math.random() * this.height * 0.8) + 0.1 * this.height;
    enemy.deltaScale = 0;
    enemy.deltaX = -Math.round(Math.random() * config.x) - config.x / 2;
    enemy.deltaY = Math.round(Math.random() * config.y) - config.y / 2;
    enemy.isExplode = false;
    setTimeout(this.createEnemy.bind(this), config.timeout);
  }

  createScore() {
    this.scoreText = new PIXI.Text(this.score, {
      fontFamily: "Arial",
      fontSize: 50,
      fontWeight: "bold",
      stroke: ["#ffffff", "#00ff99"],
      strokeThickness: 3,
      fill: "transparent",
    });
    this.scoreText.anchor.set(1);
    this.scoreText.x = this.width - 20;
    this.scoreText.y = 75;
    this.container.addChild(this.scoreText);
  }

  onDragStart() {
    this.dragging = true;
    this.plane.on("pointermove", this.onDragMove.bind(this));
  }

  onDragEnd() {
    this.dragging = false;
    this.plane.off("pointermove", this.onDragMove);
  }

  onDragMove(e) {
    if (!this.dragging) return;
    this.plane.parent.toLocal(e.data.global, null, this.plane.position);
    this.plane.x = Math.min(
      Math.max(this.plane.width / 2, this.plane.x),
      this.width - this.plane.width / 2
    );
    this.plane.y = Math.min(
      Math.max(this.plane.height / 2, this.plane.y),
      this.height - this.plane.height / 2
    );
  }

  onComplete() {
    this.plane.textures = this.planeFlyTexture;
    this.plane.loop = true;
    this.plane.play();
  }

  update(delta) {
    this.bgContainer.children.forEach((bg, idx) => {
      bg.x -= CONFIG[this.level].bg.x;
      if (bg.x < -this.width) {
        bg.x =
          this.bgContainer.children[Math.abs(idx - 1)].width -
          CONFIG[this.level].bg.x -
          2;
      }
    });
    [...this.pulletContainer.children].forEach((bullet) => {
      bullet.x += bullet.deltaX;
      bullet.y += bullet.deltaY;
      if (bullet.x > this.width + this.plane.width / 2) {
        this.pulletContainer.removeChild(bullet);
      }
    });
    [...this.enemyContainer.children].forEach((enemy) => {
      enemy.x += enemy.deltaX;
      enemy.y += enemy.deltaY;
      enemy.scale.set(enemy.scale.x + enemy.deltaScale);
      if (enemy.scale.x <= 0) {
        return this.enemyContainer.removeChild(enemy);
      }
      if (
        enemy.x < -this.plane.width / 2 ||
        enemy.y < -this.plane.height / 2 ||
        enemy.y > this.height + this.plane.height / 2
      ) {
        this.enemyContainer.removeChild(enemy);
        return;
      }
      if (enemy.isExplode) {
        return;
      }
      const pullet = this.pulletContainer.children.find((pullet) =>
        this.collisionPullet(enemy, pullet)
      );
      if (pullet) {
        this.pulletContainer.removeChild(pullet);
        enemy.tint = 0xff0000;
        enemy.deltaX = 0;
        enemy.deltaY = 0;
        enemy.deltaScale = -0.005;
        enemy.isExplode = true;
        this.scoreText.text = ++this.score;
        return;
      }
      if (this.collisionPlane(enemy, this.plane)) {
        // app.stop();
        this.destroy();
      }
    });
    if (this.score >= CONFIG[this.level].max) {
      const values = Object.values(LEVEL);
      this.level = values[values.indexOf(this.level) + 1];
    }
  }

  destroy() {
    this.current = false;
    this.score = 0;
    this.level = LEVEL.EASY;
    this.container.removeChildren();
    this.pulletContainer.removeChildren();
    this.enemyContainer.removeChildren();
    this.onNextStage();
  }

  collisionPullet(enemy, pullet) {
    const boxA = enemy.getBounds();
    const boxB = pullet.getBounds();
    return (
      boxA.right > boxB.left + boxB.width / 2 &&
      boxA.left < boxB.right - boxB.width / 2 &&
      boxA.bottom > boxB.top + boxB.height / 2 &&
      boxA.top < boxB.bottom - boxB.height / 2
    );
  }

  collisionPlane(enemy, plane) {
    const boxA = enemy.getBounds();
    const boxB = plane.getBounds();
    return (
      boxA.right > boxB.left + boxB.width / 5 &&
      boxA.left < boxB.right - boxB.width / 5 &&
      boxA.bottom > boxB.top + boxB.height / 5 &&
      boxA.top < boxB.bottom - boxB.height / 5
    );
  }
}

export default PlayingScreen;
