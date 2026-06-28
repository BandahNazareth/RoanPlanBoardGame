import { testMap } from "../data/maps/test_map.js";
import { terrainDefinitions } from "../data/terrain.js";
import { gameState } from "./gameState.js";

export const HEX_SIZE = 48;

const SQRT_3 = Math.sqrt(3);
const MAPS = [testMap];
const NEIGHBOR_DIRECTIONS = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function getHex(q, r) {
  return getCurrentMap().hexes.find((hex) => hex.q === q && hex.r === r) || null;
}

export function hasHex(q, r) {
  return Boolean(getHex(q, r));
}

export function getNeighbors(q, r) {
  return NEIGHBOR_DIRECTIONS.map((direction) =>
    getHex(q + direction.q, r + direction.r)
  ).filter(Boolean);
}

export function getDistance(a, b) {
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  const ds = -a.q - a.r - (-b.q - b.r);

  return (Math.abs(dq) + Math.abs(dr) + Math.abs(ds)) / 2;
}

export function getTerrain(q, r) {
  const hex = getHex(q, r);

  if (!hex) {
    return null;
  }

  return (
    terrainDefinitions.find((terrain) => terrain.id === hex.terrainId) || null
  );
}

export function getOccupants(q, r) {
  return gameState.entities.filter(
    (entity) => entity.position.q === q && entity.position.r === r
  );
}

export function isOccupied(q, r) {
  return getOccupants(q, r).length > 0;
}

export function getMapHexes() {
  return getCurrentMap().hexes;
}

export function getRenderableHexes() {
  const hexes = getMapHexes();
  const centers = hexes.map((hex) => ({
    ...hex,
    id: getHexId(hex.q, hex.r),
    center: axialToPixel(hex.q, hex.r),
  }));
  const bounds = getBounds(centers);
  const padding = HEX_SIZE + 32;
  const offsetX = padding - bounds.minX;
  const offsetY = padding - bounds.minY;

  return {
    width: bounds.maxX - bounds.minX + padding * 2,
    height: bounds.maxY - bounds.minY + padding * 2,
    hexes: centers.map((hex) => {
      const center = {
        x: hex.center.x + offsetX,
        y: hex.center.y + offsetY,
      };

      return {
        q: hex.q,
        r: hex.r,
        id: hex.id,
        terrainId: hex.terrainId,
        center,
        points: getHexPoints(center.x, center.y),
      };
    }),
  };
}

export function getHexId(q, r) {
  return `${q},${r}`;
}

function getCurrentMap() {
  const map = MAPS.find((candidate) => candidate.id === gameState.mapId);

  if (!map) {
    throw new Error(`Unknown map: ${gameState.mapId}`);
  }

  return map;
}

function axialToPixel(q, r, size = HEX_SIZE) {
  return {
    x: size * SQRT_3 * (q + r / 2),
    y: size * 1.5 * r,
  };
}

function getHexPoints(x, y, size = HEX_SIZE) {
  const points = [];

  for (let corner = 0; corner < 6; corner += 1) {
    const angle = (Math.PI / 180) * (60 * corner - 30);
    points.push(`${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`);
  }

  return points.join(" ");
}

function getBounds(hexes) {
  return hexes.reduce(
    (bounds, hex) => ({
      minX: Math.min(bounds.minX, hex.center.x),
      maxX: Math.max(bounds.maxX, hex.center.x),
      minY: Math.min(bounds.minY, hex.center.y),
      maxY: Math.max(bounds.maxY, hex.center.y),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  );
}
