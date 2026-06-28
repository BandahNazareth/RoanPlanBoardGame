import { testMap } from "../data/maps/test_map.js";
import { terrainDefinitions } from "../data/terrain.js";
import { gameState } from "./gameState.js";

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
  const hex = getCurrentMap().hexes.find(
    (candidate) => candidate.q === q && candidate.r === r
  );

  return hex ? formatHex(hex) : null;
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
  return getCurrentMap().hexes.map(formatHex);
}

export function getMapData() {
  const map = getCurrentMap();
  return {
    id: map.id,
    name: map.name,
    hexes: map.hexes.map(formatHex),
  };
}

export function getHexId(q, r) {
  return `${q},${r}`;
}

export function getHexForEntity(entity) {
  if (!entity?.position) {
    return null;
  }

  return getHex(entity.position.q, entity.position.r);
}

function getCurrentMap() {
  const map = MAPS.find((candidate) => candidate.id === gameState.mapId);

  if (!map) {
    throw new Error(`Unknown map: ${gameState.mapId}`);
  }

  return map;
}

function formatHex(hex) {
  return {
    q: hex.q,
    r: hex.r,
    id: getHexId(hex.q, hex.r),
    terrainId: hex.terrainId,
  };
}
