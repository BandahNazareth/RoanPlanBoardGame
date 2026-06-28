import { axialToPixel, hexId, hexPoints, HEX_SIZE } from "./hexGrid.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export function renderMap({
  container,
  hexes,
  entities,
  selectedHexId,
  onHexClick,
  onEntityClick,
}) {
  container.replaceChildren();

  const bounds = getBounds(hexes);
  const padding = HEX_SIZE + 32;
  const width = bounds.maxX - bounds.minX + padding * 2;
  const height = bounds.maxY - bounds.minY + padding * 2;
  const offsetX = padding - bounds.minX;
  const offsetY = padding - bounds.minY;

  const svg = createSvg("svg", {
    class: "hex-map",
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": "Klickbar hexagon-karta",
  });

  const hexLayer = createSvg("g", { class: "hex-layer" });
  const entityLayer = createSvg("g", { class: "entity-layer" });

  hexes.forEach((hex) => {
    const center = getHexCenter(hex.q, hex.r, offsetX, offsetY);
    const id = hexId(hex.q, hex.r);
    const polygon = createSvg("polygon", {
      class: id === selectedHexId ? "hex is-selected" : "hex",
      points: hexPoints(center.x, center.y),
      tabindex: "0",
      "data-hex-id": id,
      "aria-label": `Hex ${id}`,
    });
    const label = createSvg("text", {
      class: "hex-label",
      x: center.x,
      y: center.y,
    });

    label.textContent = id;
    polygon.addEventListener("click", () => onHexClick(hex));
    polygon.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onHexClick(hex);
      }
    });

    hexLayer.append(polygon, label);
  });

  entities.forEach((entity) => {
    const center = getHexCenter(
      entity.position.q,
      entity.position.r,
      offsetX,
      offsetY
    );
    const marker = createSvg("g", {
      class: "entity",
      tabindex: "0",
      transform: `translate(${center.x} ${center.y})`,
      "aria-label": entity.definition.name,
    });
    const circle = createSvg("circle", { r: 22 });
    const label = createSvg("text", { y: 1 });

    label.textContent = entity.definition.shortName;
    marker.append(circle, label);
    marker.addEventListener("click", (event) => {
      event.stopPropagation();
      onEntityClick(entity);
    });
    marker.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onEntityClick(entity);
      }
    });

    entityLayer.append(marker);
  });

  svg.append(hexLayer, entityLayer);
  container.append(svg);
}

export function renderEntityInfo(panel, entity) {
  if (!entity) {
    panel.innerHTML = '<p class="empty-state">Ingen entity vald.</p>';
    return;
  }

  const { definition } = entity;
  const { q, r } = entity.position;

  panel.innerHTML = `
    <article class="entity-card">
      <p class="entity-meta">${definition.type} | Hex ${hexId(q, r)}</p>
      <h3>${definition.name}</h3>
      <p>${definition.description}</p>
      <div class="stats" aria-label="Entityvärden">
        <div class="stat"><span>Attack</span><strong>${definition.stats.attack}</strong></div>
        <div class="stat"><span>Försvar</span><strong>${definition.stats.defense}</strong></div>
        <div class="stat"><span>Rörelse</span><strong>${definition.stats.movement}</strong></div>
      </div>
    </article>
  `;
}

function getHexCenter(q, r, offsetX, offsetY) {
  const point = axialToPixel(q, r);
  return {
    x: point.x + offsetX,
    y: point.y + offsetY,
  };
}

function getBounds(hexes) {
  return hexes.reduce(
    (bounds, hex) => {
      const point = axialToPixel(hex.q, hex.r);
      return {
        minX: Math.min(bounds.minX, point.x),
        maxX: Math.max(bounds.maxX, point.x),
        minY: Math.min(bounds.minY, point.y),
        maxY: Math.max(bounds.maxY, point.y),
      };
    },
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  );
}

function createSvg(tagName, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tagName);

  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });

  return element;
}
