const SVG_NS = "http://www.w3.org/2000/svg";
const HEX_SIZE = 48;
const SQRT_3 = Math.sqrt(3);

export function renderMap({
  container,
  map,
  entities,
  selectedHexId,
  onHexClick,
  onEntityClick,
}) {
  container.replaceChildren();

  const renderGeometry = createRenderGeometry(map.hexes);
  const svg = createSvg("svg", {
    class: "hex-map",
    viewBox: `0 0 ${renderGeometry.width} ${renderGeometry.height}`,
    role: "img",
    "aria-label": "Klickbar hexagon-karta",
  });

  const hexLayer = createSvg("g", { class: "hex-layer" });
  const entityLayer = createSvg("g", { class: "entity-layer" });

  renderGeometry.hexes.forEach((hex) => {
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
    const hex = renderGeometry.hexById.get(entity.hex.id);

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

function createRenderGeometry(hexes) {
  const centers = hexes.map((hex) => ({
    ...hex,
    center: axialToPixel(hex.q, hex.r),
  }));
  const bounds = getBounds(centers);
  const padding = HEX_SIZE + 32;
  const offsetX = padding - bounds.minX;
  const offsetY = padding - bounds.minY;
  const renderHexes = centers.map((hex) => {
    const center = {
      x: hex.center.x + offsetX,
      y: hex.center.y + offsetY,
    };

    return {
      ...hex,
      center,
      points: getHexPoints(center.x, center.y),
    };
  });

  return {
    width: bounds.maxX - bounds.minX + padding * 2,
    height: bounds.maxY - bounds.minY + padding * 2,
    hexes: renderHexes,
    hexById: new Map(renderHexes.map((hex) => [hex.id, hex])),
  };
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
