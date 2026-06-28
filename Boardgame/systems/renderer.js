const SVG_NS = "http://www.w3.org/2000/svg";

export function renderMap({
  container,
  map,
  entities,
  selectedHexId,
  onHexClick,
  onEntityClick,
}) {
  container.replaceChildren();

  const svg = createSvg("svg", {
    class: "hex-map",
    viewBox: `0 0 ${map.width} ${map.height}`,
    role: "img",
    "aria-label": "Klickbar hexagon-karta",
  });

  const hexLayer = createSvg("g", { class: "hex-layer" });
  const entityLayer = createSvg("g", { class: "entity-layer" });

  map.hexes.forEach((hex) => {
    const polygon = createSvg("polygon", {
      class: hex.id === selectedHexId ? "hex is-selected" : "hex",
      points: hex.points,
      tabindex: "0",
      "data-hex-id": hex.id,
      "aria-label": `Hex ${hex.id}`,
    });
    const label = createSvg("text", {
      class: "hex-label",
      x: hex.center.x,
      y: hex.center.y,
    });

    label.textContent = hex.id;
    polygon.addEventListener("click", () => onHexClick(hex.q, hex.r));
    polygon.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onHexClick(hex.q, hex.r);
      }
    });

    hexLayer.append(polygon, label);
  });

  entities.forEach((entity) => {
    const hex = map.hexes.find(
      (candidate) =>
        candidate.q === entity.position.q && candidate.r === entity.position.r
    );

    if (!hex) {
      return;
    }

    const marker = createSvg("g", {
      class: "entity",
      tabindex: "0",
      transform: `translate(${hex.center.x} ${hex.center.y})`,
      "aria-label": entity.definition.name,
    });
    const circle = createSvg("circle", { r: 22 });
    const label = createSvg("text", { y: 1 });

    label.textContent = entity.definition.shortName;
    marker.append(circle, label);
    marker.addEventListener("click", (event) => {
      event.stopPropagation();
      onEntityClick(entity.id);
    });
    marker.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onEntityClick(entity.id);
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

  panel.innerHTML = `
    <article class="entity-card">
      <p class="entity-meta">${definition.type} | Hex ${entity.hexId}</p>
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

function createSvg(tagName, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tagName);

  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });

  return element;
}
