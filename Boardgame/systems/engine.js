import { gameState } from "./gameState.js";

export function selectHex(q, r) {
  gameState.selectedHex = { q, r };
  gameState.selectedEntityId = null;
}

export function selectEntity(entityId) {
  const entity = getEntity(entityId);

  if (!entity) {
    return;
  }

  gameState.selectedHex = { ...entity.position };
  gameState.selectedEntityId = entity.id;
}

export function moveEntity(entityId, q, r) {
  const entity = getEntity(entityId);

  if (!entity) {
    return;
  }

  entity.position = { q, r };

  if (gameState.selectedEntityId === entity.id) {
    gameState.selectedHex = { q, r };
  }
}

function getEntity(entityId) {
  return gameState.entities.find((entity) => entity.id === entityId);
}
