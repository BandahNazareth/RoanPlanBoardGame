import { selectEntity, selectHex } from "./engine.js";
import { exportGameState } from "./gameState.js";

export function onHexClicked(q, r) {
  selectHex(q, r);
  return { type: "hex", q, r };
}

export function onEntityClicked(entityId) {
  selectEntity(entityId);
  return { type: "entity", entityId };
}

export function onExportClicked() {
  console.log(exportGameState());
}
