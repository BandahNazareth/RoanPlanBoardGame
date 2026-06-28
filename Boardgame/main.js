import { tokens } from "./data/tokens.js";
import { createHexGrid, hexId } from "./systems/hexGrid.js";
import { renderMap, renderTokenInfo } from "./systems/renderer.js";

const mapElement = document.querySelector("#map");
const infoPanel = document.querySelector("#infoPanel");
const selectionText = document.querySelector("#selectionText");

const state = {
  hexes: createHexGrid(3),
  tokens,
  selectedHexId: null,
  selectedToken: null,
};

function draw() {
  renderMap({
    container: mapElement,
    hexes: state.hexes,
    tokens: state.tokens,
    selectedHexId: state.selectedHexId,
    onHexClick: selectHex,
    onTokenClick: selectToken,
  });

  renderTokenInfo(infoPanel, state.selectedToken);
}

function selectHex(hex) {
  state.selectedHexId = hexId(hex.q, hex.r);
  state.selectedToken = null;
  selectionText.textContent = `Vald hex: ${state.selectedHexId}`;
  draw();
}

function selectToken(token) {
  state.selectedHexId = hexId(token.q, token.r);
  state.selectedToken = token;
  selectionText.textContent = `Vald token: ${token.name}`;
  draw();
}

draw();
