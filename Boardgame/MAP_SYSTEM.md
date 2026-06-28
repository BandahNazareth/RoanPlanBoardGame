# Map System

## Purpose

The Map System is responsible for representing the game world.

It defines the board layout, stores map data and provides spatial information to the rest of the engine.

The Map System does **not** implement gameplay rules. Instead, it provides information used by systems such as the Movement System, Combat System and Ability System.

The Map System is shared by both the **Game Client** and the **Map Editor**.

---

## Responsibilities

The Map System is responsible for:

- Defining the playable map.
- Storing every hex on the map.
- Looking up hexes by coordinate.
- Returning neighbouring hexes.
- Calculating distances.
- Returning terrain information.
- Tracking which entities occupy each hex.
- Loading map definitions.
- Saving map definitions.
- Providing spatial queries to other Engine Systems.

---

## Does NOT Handle

The Map System does **not** handle:

- Movement rules.
- Combat rules.
- Ability rules.
- Turn progression.
- Victory conditions.
- Rendering.
- User interface.
- Entity creation.
- Entity destruction.

Those responsibilities belong to other Engine Systems.

---

## Reads

The Map System reads:

- Map Definitions
- Terrain Definitions
- Game State
- Entity positions (during early development)

---

## Writes

The Map System may write:

- Map data during initialization.
- Map Definitions while using the Map Editor.
- Hex occupancy when instructed by the Engine.

The Map System must never modify Game State directly.

---

## Public API

The public API should remain small and focused.

| Function | Description |
|----------|-------------|
| `getHex(q, r)` | Returns the hex at the given coordinate. |
| `hasHex(q, r)` | Returns whether the coordinate exists. |
| `getNeighbors(q, r)` | Returns all neighbouring hexes. |
| `getDistance(a, b)` | Calculates hex distance. |
| `getTerrain(q, r)` | Returns terrain information. |
| `getOccupants(q, r)` | Returns all entities occupying the hex. |
| `isOccupied(q, r)` | Returns whether the hex contains one or more entities. |

Future API:

| Function | Description |
|----------|-------------|
| `findPath()` | Pathfinding. |
| `getVisibleHexes()` | Visibility calculations. |
| `getRegion()` | Region lookup. |
| `findSpawnPoints()` | Returns spawn points matching a filter. |

---

## Coordinate System

The engine uses **axial hex coordinates**.

Each hex is uniquely identified by two values:

```json
{
    "q": 0,
    "r": 0
}
```

All coordinate mathematics belongs exclusively to the Map System.

No other Engine System should calculate:

- Distance
- Neighbours
- Coordinate conversion
- Rings
- Spirals
- Areas of effect

These operations should always be requested from the Map System.

---

## Hex Model

Every playable hex is represented by a Hex object.

Example:

```json
{
    "q": 0,
    "r": 0,
    "terrainId": "land",
    "occupants": [],
    "effects": []
}
```

### q / r

The axial coordinate.

### terrainId

Reference to a Terrain Definition.

### occupants

List of Entity IDs currently occupying this hex.

### effects

Temporary map effects.

Examples:

- Fire
- Fog
- Magical Barrier
- Corruption
- Commander Aura

The Map System stores these effects but does not interpret them.
---

## Terrain

Terrain is completely data-driven.

The Map System stores terrain but never interprets it.

Terrain Definitions should live in:

```text
data/terrain/
```

Example:

```json
{
    "id": "forest",
    "name": "Forest"
}
```

Possible terrain types include:

- land
- sea
- forest
- mountain
- swamp
- road
- river
- port
- fortress
- corrupted_land

The meaning of terrain belongs to other Engine Systems.

Examples:

- Movement System determines movement cost.
- Combat System determines defensive bonuses.
- Ability System determines magical interactions.

---

## Occupancy

The Map System tracks which entities occupy each hex.

Occupancy is purely informational.

The Map System does **not** determine whether occupancy is legal.

Examples of valid occupancy:

- One Stronghold
- One Hero
- Several Units
- Terrain Entity
- Temporary Effects

The legality of occupancy is determined by the Movement System and Combat System.

---

## Entity Relationship

The Map System references Entities only by ID.

It never creates Entities.

It never destroys Entities.

Example:

```json
{
    "occupants": [
        "entity_001",
        "entity_014"
    ]
}
```

---

## Position Ownership

During early development an Entity may contain its own position.

Example:

```json
{
    "position": {
        "q": 4,
        "r": -2
    }
}
```

Long-term architecture should move toward map ownership of positions.

Preferred model:

```text
Map
 └── Hex
      └── Occupants
           └── Entity IDs
```

If both systems exist simultaneously, the Engine is responsible for keeping them synchronized.

Neither the Renderer nor the Controller may synchronize entity positions.

---

## Initialization

Maps are loaded from data.

Suggested folder structure:

```text
data/maps/
    default_world.json
    campaign_01.json
    tutorial.json
    test_map.json
```

A map definition may contain:

- Map ID
- Name
- Description
- Width
- Height
- Hexes
- Spawn Points
- Regions
- Objectives
- Special Locations

---

## Map Editor Support

The Map System must support a dedicated visual Map Editor.

The editor is a separate application built on top of the same Engine.

The editor does **not** create Game States.

It creates **Map Definitions**.

Workflow:

```text
Map Editor
      │
      ▼
Map Definition
      │
      ▼
Game Setup
      │
      ▼
Game State
```

The Map Editor should support:

- Creating new maps.
- Loading existing maps.
- Saving maps.
- Changing map dimensions.
- Painting terrain.
- Defining land and sea.
- Defining spawn points.
- Previewing maps.

The Map Editor must **not**:

- Execute gameplay.
- Handle turns.
- Handle combat.
- Modify Game State.

---

## Spawn Points

Spawn Points belong to the Map Definition.

They should not be hardcoded.

Rather than defining only Stronghold positions, the system should support generic spawn points.

Example:

```json
{
    "type": "stronghold",
    "playerSlot": 1,
    "q": 0,
    "r": 0
}
```

Future spawn point types may include:

- stronghold
- hero
- neutral_unit
- monster
- objective
- resource
- boss
- event

Using generic spawn points allows future scenarios and campaigns without changing the map format.
## Dependencies

The Map System depends on:

- Game State
- Map Definitions
- Terrain Definitions

The Map System should remain independent from:

- Renderer
- Controller
- Movement System
- Combat System
- Ability System

---

## Design Rules

The Map System must follow these rules:

1. Own all coordinate calculations.
2. Never interpret terrain.
3. Never execute gameplay rules.
4. Never manipulate the Renderer.
5. Never manipulate the DOM.
6. Store only map-related information.
7. Support both gameplay and map editing.
8. Be fully data-driven.
9. Be serializable to JSON.
10. Remain independent of UI.

---

## Future Expansion

The Map System is expected to support:

- Pathfinding
- Regions
- Roads
- Rivers
- Ports
- Fog of War
- Visibility
- World Events
- Scenario Maps
- Procedural Maps

These features should extend the Map System without changing its public API.

---

## Decision Log

### 2026-06-28

- Axial coordinates selected.
- Terrain is data-driven.
- Gameplay systems interpret terrain.
- The Map Editor creates Map Definitions instead of Game States.
- Generic Spawn Points replace Stronghold-specific starting positions.
- Long-term position ownership should move toward hex occupancy.