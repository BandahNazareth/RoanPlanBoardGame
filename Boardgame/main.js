import { entityDefinitions } from "./data/tokens.js";
import { gameState } from "./systems/gameState.js";
import {
  onEntityClicked,
  onExportClicked,
  onHexClicked,
} from "./systems/controller.js";
import {
  getHex,
  getHexForEntity,
  getHexId,
  getMapData,
} from "./systems/mapSystem.js";
import { renderEntityInfo, renderMap } from "./systems/renderer.js";

const mapElement = document.querySelector("#map");
const infoPanel = document.querySelector("#infoPanel");
const selectionText = document.querySelector("#selectionText");
const exportButton = document.querySelector("#exportGameState");

function draw() {
  const map = getMapData();
  const entities = getEntityViews();
  const selectedEntity = getSelectedEntityView(entities);

  renderMap({
    container: mapElement,
    map,
    entities,
    selectedHexId: getSelectedHexId(),
    onHexClick: handleHexClick,
    onEntityClick: handleEntityClick,
  });

  renderEntityInfo(infoPanel, selectedEntity);
}

function handleHexClick(q, r) {
  onHexClicked(q, r);
  selectionText.textContent = `Vald hex: ${getSelectedHexId()}`;
  draw();
}

function handleEntityClick(entityId) {
  onEntityClicked(entityId);
  const entity = getEntityViews().find((candidate) => candidate.id === entityId);

  if (!entity) {
    draw();
    return;
  }

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
      const hex = getHexForEntity(entity);

      if (!hex) {
        return null;
      }

      return {
        ...entity,
        definition,
        hex,
        hexId: hex.id,
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

  const hex = getHex(gameState.selectedHex.q, gameState.selectedHex.r);

  return hex ? getHexId(hex.q, hex.r) : null;
}

if (exportButton) {
  exportButton.addEventListener("click", () => {
    onExportClicked();
  });
}

draw();
