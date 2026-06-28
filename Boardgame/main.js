import { entityDefinitions } from "./data/tokens.js";
import { exportGameState, gameState } from "./systems/gameState.js";
import { selectEntity, selectHex } from "./systems/engine.js";
import { createHexGrid, hexId } from "./systems/hexGrid.js";
import { renderEntityInfo, renderMap } from "./systems/renderer.js";

const mapElement = document.querySelector("#map");
const infoPanel = document.querySelector("#infoPanel");
const selectionText = document.querySelector("#selectionText");
const exportButton = document.querySelector("#exportGameState");

const hexes = createHexGrid(3);

function draw() {
  const entities = getEntityViews();
  const selectedEntity = getSelectedEntityView(entities);

  renderMap({
    container: mapElement,
    hexes,
    entities,
    selectedHexId: getSelectedHexId(),
    onHexClick: handleHexClick,
    onEntityClick: handleEntityClick,
  });

  renderEntityInfo(infoPanel, selectedEntity);
}

function handleHexClick(hex) {
  selectHex(hex.q, hex.r);
  selectionText.textContent = `Vald hex: ${getSelectedHexId()}`;
  draw();
}

function handleEntityClick(entity) {
  selectEntity(entity.id);
  selectionText.textContent = `Vald entity: ${entity.definition.name}`;
  draw();
}

function getEntityViews() {
  return gameState.entities
    .map((entity) => {
      const definition = entityDefinitions.find(
        (candidate) => candidate.id === entity.definitionId
      );

      if (!definition) {
        return null;
      }

      return {
        ...entity,
        definition,
      };
    })
    .filter(Boolean);
}

function getSelectedEntityView(entities) {
  if (!gameState.selectedEntityId) {
    return null;
  }

  return entities.find((entity) => entity.id === gameState.selectedEntityId);
}

function getSelectedHexId() {
  if (!gameState.selectedHex) {
    return null;
  }

  return hexId(gameState.selectedHex.q, gameState.selectedHex.r);
}

if (exportButton) {
  exportButton.addEventListener("click", () => {
    console.log(exportGameState());
  });
}

draw();
