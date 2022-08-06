export function bg(texture, width, height, posX = 0) {
  const sprite = new PIXI.Sprite(texture);
  sprite.width = width + 2;
  sprite.height = height;
  sprite.x = posX;
  return sprite;
}
