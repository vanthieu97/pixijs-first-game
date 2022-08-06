class GameOverScreen {
  constructor(width, height, onNextStage) {
    this.width = width;
    this.height = height;

    this.bg = new PIXI.Graphics();
    this.bg.beginFill(0xffbf00);
    this.bg.drawRect(0, 0, width, height);
    this.bg.endFill();

    this.try = new PIXI.Text("Try Again", {
      fontFamily: "Arial",
      fontSize: 60,
      fontWeight: "bold",
      fill: ["#ffffff", "#00ff99"],
      strokeThickness: 3,
    });
    this.try.anchor.set(0.5);
    this.try.x = width / 2;
    this.try.y = height / 2;

    this.try.interactive = true;
    this.try.on("click", this.destroy.bind(this));
    this.try.on("tap", this.destroy.bind(this));
    this.container = new PIXI.Container();
    this.onNextStage = onNextStage;
  }

  play() {
    this.container.addChild(this.bg);
    this.container.addChild(this.try);
  }

  update() {}

  destroy() {
    this.container.removeChildren();
    this.onNextStage();
  }
}

export default GameOverScreen;
