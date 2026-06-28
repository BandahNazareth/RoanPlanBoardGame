# Entity Model

## Philosophy

Everything that exists on the game board is an Entity.

Examples:

- Units
- Heroes
- Strongholds
- Terrain
- Objectives

Entities are instances of immutable Definitions.

The Definition describes **what an Entity is**.

The Entity State describes **what is happening to that Entity right now**.

---

# Architecture

```text
Entity Definition
        │
        ▼
     Entity
        │
        ▼
 Runtime State
```

Definitions never change during a match.

Runtime State changes continuously.

---

# Entity Definition

Definitions are stored inside the `data/` folder.

Examples:

```text
data/
    /commanders
    /heroes
    /objectives
    /strongholds
    /terrain
    /tokens
    /units
```

Definitions contain information such as:

- Name
- Type
- Movement
- Area
- Ally Combat Modifier (modifiers to nearby ally damage and health)
- Abilities
- Base Combat Values (damage and health)
- Creature type
- Starting Zone
- Keywords
- Artwork
- Card Text

Definitions are immutable.

---

# Entity

Each Entity represents one object currently existing on the map.

Example:

```json
{
    "id": "entity_001",
    "definitionId": "royal_knight",
    "ownerId": "player_2",
    "position": {
        "q": 5,
        "r": -2
    },
    "state": {}
}
```

---

# Required Properties

Every Entity must contain:

| Property | Description |
|-----------|-------------|
| id | Unique runtime identifier |
| definitionId | Reference to its Definition |
| ownerId | Owning player (or null) |
| position | Current hex |
| state | Mutable runtime data |

---

# Entity State

State contains everything that may change during gameplay.

Examples:

```json
{
    "damage": 2,
    "movementUsed": 1,
    "activated": true,
    "statusEffects": []
}
```

State should never contain information already present in the Definition.

---

# Definition IDs

Definitions are referenced using IDs.

Example:

```text
royal_knight

forest_guardian

orc_warlord

castle

ancient_forest
```

The engine always looks up the Definition using `definitionId`.

---

# Position

Entities placed on the map must contain:

```json
{
    "position": {
        "q": 0,
        "r": 0
    }
}
```

The Map System owns all coordinate calculations.

Entities never calculate movement themselves.

---

# Ownership

An Entity may belong to:

- a Player
- Neutral
- The Evil Wizard
- No owner

If an Entity has no owner:

```json
{
    "ownerId": null
}
```

---

# Entity Types

Current supported types:

- unit
- hero
- stronghold
- terrain

Future types may include:

- structure
- summon
- objective
- decoration

The engine should not require modification when adding new Entity Types.

---

# Rule Cards

Rule Cards are NOT Entities.

Rule Cards exist only as documentation for the player.

They are stored separately under:

```text
data/rules/
```

---

# Commander Cards

Commander Cards are also not Entities.

They represent player information.

Future location:

```text
data/commanders/
```

---

# Runtime Lifecycle

Every Entity follows the same lifecycle.

```text
Create

↓

Spawn

↓

Move

↓

Interact

↓

Destroy
```

Different systems may react to these events.

---

# Design Rules

1. Every object on the map is an Entity.
2. Definitions never change during gameplay.
3. Runtime State contains all mutable information.
4. Runtime State should remain as small as possible.
5. The Renderer should never distinguish Entity types beyond visual appearance.
6. The Engine owns Entity behavior.
7. Entities should never contain executable game logic.
8. The Definition is data.
9. The Runtime State is data.
10. Systems provide behavior.

---

# Decision Log

## 2026-06-28

- Everything placed on the board is an Entity.
- Rule Cards are not Entities.
- Commander Cards are not Entities.
- Definitions are immutable.
- Runtime State stores mutable information.
- The Engine provides all gameplay behavior.