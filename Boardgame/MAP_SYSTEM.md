# Map System

## Purpose

The Map System represents the game board.

It is responsible for hex coordinates, map structure, terrain lookup, distance calculations and basic spatial queries.

The Map System does **not** decide gameplay rules by itself. It provides information that other systems, such as Movement System and Combat System, can use.

---

## Responsibilities

The Map System is responsible for:

- Defining the hex grid.
- Storing map hexes.
- Looking up hexes by coordinate.
- Calculating distance between hexes.
- Finding neighbouring hexes.
- Checking whether a coordinate exists on the map.
- Returning terrain information for a hex.
- Returning entities located on a hex.
- Supporting future pathfinding.

---

## Does NOT Handle

The Map System does **not** handle:

- Movement rules.
- Combat rules.
- Turn progression.
- Player ownership.
- Entity creation.
- Rendering.
- UI interaction.
- Victory conditions.

---

## Reads

The Map System reads:

- Game State.
- Map Definitions.
- Terrain Definitions.
- Entity positions or map occupancy data.

---

## Writes

The Map System should write as little as possible.

Allowed writes:

- Map state during initialization.
- Hex occupancy when the Engine moves entities.
- Temporary pathfinding cache if needed later.

The Map System must not modify Game State directly unless called through the Engine.

---

## Public API

The Map System should expose a small public API.

Suggested functions:

| Function | Description |
|---|---|
| `getHex(q, r)` | Returns the hex at the given coordinate. |
| `hasHex(q, r)` | Returns true if the coordinate exists on the map. |
| `getNeighbors(q, r)` | Returns neighbouring hexes. |
| `getDistance(a, b)` | Returns hex distance between two coordinates. |
| `getTerrain(q, r)` | Returns terrain data for a hex. |
| `getOccupants(q, r)` | Returns entities located on a hex. |
| `isOccupied(q, r)` | Returns true if the hex contains entities. |
| `getRenderableHexes()` | Returns map hex data prepared for visual rendering. |
| `getHexId(q, r)` | Returns the coordinate id string for a hex. |

Future functions:

| Function | Description |
|---|---|
| `findPath(start, end)` | Finds a path between two hexes. |
| `getRegion(q, r)` | Returns region or territory information. |
| `getVisibleHexes(entityId)` | Returns visible hexes for an entity. |

---

## Hex Coordinates

The project uses axial hex coordinates.

Each hex is identified by:

```json
{
  "q": 0,
  "r": 0
}
