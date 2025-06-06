export const getRandomHours = (min: number, max: number): number => {
  return +(Math.random() * (max - min) + min).toFixed(1);
}

export const getRandomTips = (min: number, max: number): number => {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

