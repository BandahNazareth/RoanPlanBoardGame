# Engine Architecture

## Philosophy

> **This project is not a website.**
>
> It is a strategy game engine that happens to render itself in a web browser.

The architecture should always prioritize:

- Readability
- Maintainability
- Extensibility
- Data-driven design
- Multiplayer compatibility
- Save/Load compatibility

Whenever possible, new game content should be added by creating data rather than modifying engine code.

---

# Core Principle

## Game State is the single source of truth.

All gameplay information exists inside the Game State.

Everything rendered on screen must originate from the Game State.

Nothing outside the Game State may represent gameplay information.

---

# Layer Architecture

```text
User Input
    │
    ▼
Controller
    │
    ▼
Engine
    │
    ▼
Game State
    │
    ▼
Renderer
```

Information always flows downward.

The Renderer never modifies Game State.

---

# Layer Responsibilities

## User Input

Responsible for:

- Mouse
- Keyboard
- Touch (future)

Must NOT:

- Know game rules
- Know turn order
- Know combat

---

## Controller

Responsible for translating user actions into engine commands.

Examples:

- Select hex
- Select entity
- End turn
- Open card
- Zoom camera

The Controller must NOT contain game rules.

---

## Engine

The Engine contains all game logic.

The Engine is the **only** layer allowed to modify Game State.

Responsibilities:

- Movement
- Combat
- Turn progression
- Resource management
- Victory checking
- Ability execution

---

## Game State

Represents the current match.

Contains:

- Players
- Entities
- Cards
- Resources
- Turn information
- Selection
- Objectives

Must NOT contain:

- HTML
- CSS
- DOM references
- Rendering information

---

## Renderer

Responsible only for visual presentation.

May:

- Draw map
- Draw entities
- Draw cards
- Draw UI
- Play animations

Must NEVER:

- Move entities
- Spend resources
- End turns
- Modify Game State

Renderer only reads Game State.

---

# Engine Systems

The engine is divided into independent systems.

## Entity System

Responsible for:

- Creating entities
- Removing entities
- Finding entities

---

## Map System

Responsible for:

- Hex coordinates
- Distance calculations
- Terrain lookup
- Pathfinding

---

## Movement System

Responsible for:

- Legal movement
- Movement cost
- Reachability

---

## Combat System

Responsible for:

- Attacks
- Damage
- Elimination
- Capture

---

## Ability System

Responsible for:

- Hero abilities
- Commander abilities
- Passive effects
- Triggered effects

---

## Turn System

Responsible for:

- Turn order
- Round progression
- Active player

---

## Card System

Responsible for:

- Decks
- Hands
- Drawing
- Discard
- Commander cards
- Rule cards

Rule Cards are **not** Entities.

---

## Victory System

Responsible for:

- Win conditions
- Player elimination
- Game end

---

# Communication Rules

Engine systems communicate through the Engine.

The Renderer never calls engine systems directly.

The Controller never changes Game State directly.

---

# Data Ownership

Game definitions belong in:

```text
data/
```

Examples:

```text
data/
    units/
    heroes/
    terrain/
    strongholds/
    commanders/
    cards/
    rules/
```

Definitions are immutable.

The Game State references definitions using IDs.

---

# Design Rules

These rules are mandatory.

1. Renderer never modifies Game State.
2. Controller never contains game rules.
3. Engine is the only layer allowed to change Game State.
4. Systems should have a single responsibility.
5. Definitions are immutable.
6. Game State contains only the current match.
7. Prefer data over hardcoded logic.
8. Prefer extending systems over adding special cases.
9. New game content should require modifying data whenever possible.
10. Every engine system should be testable without the Renderer.

---

# Long-Term Goal

The engine should support:

- Singleplayer
- Multiplayer
- AI opponents
- Additional factions
- Additional maps
- Additional cards
- Save / Load
- Replay system
- Future modding support

The architecture should allow new gameplay content without requiring major changes to existing engine systems.