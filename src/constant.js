export const STAGE = {
  IDLE: "idle",
  PLAYING: "playing",
  OVER: "over",
};

export const LEVEL = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  VERY_HARD: "very_hard",
};

export const CONFIG = {
  [LEVEL.EASY]: {
    max: 15,
    bg: { x: 2 },
    bullet: { x: 4, y: 0, timeout: 300 },
    enemy: { x: 4, y: 2, timeout: 250 },
  },
  [LEVEL.MEDIUM]: {
    max: 50,
    bg: { x: 3 },
    bullet: { x: 5, y: 0.5, timeout: 250 },
    enemy: { x: 6, y: 4, timeout: 125 },
  },
  [LEVEL.HARD]: {
    max: 100,
    bg: { x: 4 },
    bullet: { x: 6, y: 0.8, timeout: 200 },
    enemy: { x: 8, y: 5, timeout: 50 },
  },
  [LEVEL.VERY_HARD]: {
    bg: { x: 5 },
    bullet: { x: 6, y: 0.8, timeout: 180 },
    enemy: { x: 8, y: 6, timeout: 40 },
  },
};
