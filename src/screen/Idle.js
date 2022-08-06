class IdleScreen {
  constructor(width, height, onNextStage) {
    this.width = width;
    this.height = height;
    this.container = new PIXI.Container();
    this.onNextStage = onNextStage;
  }

  play() {
    //bg
    const bg = new PIXI.Graphics();
    this.container.addChild(bg);
    bg.beginFill(0x189ab4);
    bg.drawRect(0, 0, this.width, this.height);
    bg.endFill();

    //button
    const button = new PIXI.Text("Start", {
      fontFamily: "Arial",
      fontSize: 60,
      fontWeight: "bold",
      fill: ["#ffffff", "#00ff99"],
      strokeThickness: 3,
    });
    button.anchor.set(0.5);
    button.x = this.width / 2;
    button.y = this.height / 2;
    this.container.addChild(button);

    button.interactive = true;
    button.on("click", this.destroy.bind(this));
    button.on("tap", this.destroy.bind(this));
  }

  update() {}

  destroy() {
    this.container.removeChildren();
    this.onNextStage();
  }
}

export default IdleScreen;
