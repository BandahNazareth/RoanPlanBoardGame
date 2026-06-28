export const HEX_SIZE = 48;

const SQRT_3 = Math.sqrt(3);

export function createHexGrid(radius = 3) {
  const hexes = [];

  for (let q = -radius; q <= radius; q += 1) {
    const rMin = Math.max(-radius, -q - radius);
    const rMax = Math.min(radius, -q + radius);

    for (let r = rMin; r <= rMax; r += 1) {
      hexes.push({ q, r, id: hexId(q, r) });
    }
  }

  return hexes;
}

export function hexId(q, r) {
  return `${q},${r}`;
}

export function axialToPixel(q, r, size = HEX_SIZE) {
  return {
    x: size * SQRT_3 * (q + r / 2),
    y: size * 1.5 * r,
  };
}

export function hexPoints(x, y, size = HEX_SIZE) {
  const points = [];

  for (let corner = 0; corner < 6; corner += 1) {
    const angle = (Math.PI / 180) * (60 * corner - 30);
    points.push(`${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`);
  }

  return points.join(" ");
}
