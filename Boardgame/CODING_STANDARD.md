# Coding Standard

## Purpose

This document defines the coding standards used throughout the project.

The purpose is not to enforce formatting preferences, but to ensure that the architecture remains consistent as the project grows.

These rules apply to both human developers and AI assistants.

Whenever a rule conflicts with convenience, the rule takes priority.

---

# Core Philosophy

Code should be:

- Easy to understand
- Easy to modify
- Easy to extend
- Easy to debug

Prefer simplicity over cleverness.

Readable code is more valuable than short code.

---

# Single Responsibility

Every object, function and system should have one clear responsibility.

If a function needs "and" in its description, it should probably be split.

Good:

- Calculate movement.
- Render entities.
- Validate combat.

Bad:

- Calculate movement and update the UI.
- Render entities and determine combat.

---

# Engine First

Gameplay always belongs in the Engine.

The Engine owns:

- Rules
- Validation
- State changes
- Turn progression

No gameplay rules may exist inside:

- Renderer
- Controller
- UI
- HTML
- CSS

---

# Renderer Rules

The Renderer is read-only.

The Renderer may:

- Draw
- Animate
- Highlight
- Display information

The Renderer must NEVER:

- Modify Game State
- Execute gameplay rules
- Validate player actions

The Renderer always reflects the current Game State.

---

# Controller Rules

The Controller translates user actions into Engine requests.

The Controller must never:

- Execute gameplay rules
- Modify Game State directly

Example:

User clicks hex

↓

Controller

↓

Engine

↓

Game State

↓

Renderer

---

# Game State Rules

Game State is the only source of truth.

Never duplicate gameplay information elsewhere.

Everything currently happening in a match belongs inside Game State.

Game State must never contain:

- HTML
- DOM references
- CSS
- Rendering data

---

# Data Driven Design

Game content should exist as data.

Avoid hardcoded values.

Examples of data:

- Units
- Heroes
- Strongholds
- Terrain
- Cards
- Commander abilities

Whenever possible, adding new gameplay content should only require changing data files.

---

# Definitions

Definitions are immutable.

Definitions describe:

- What something is.

Game State describes:

- What is happening to it.

Never modify Definitions during gameplay.

---

# Entities

Everything placed on the board is an Entity.

Examples:

- Units
- Heroes
- Strongholds
- Terrain

Rule Cards are not Entities.

Commander Cards are not Entities.

---

# Systems

Each Engine System should have one responsibility.

Systems should remain as independent as possible.

Avoid circular dependencies.

Systems communicate through the Engine whenever possible.

---

# Public APIs

Every public function should exist for a reason.

Keep public APIs small.

Private helper functions should remain private.

---

# Functions

Functions should:

- Have a single purpose.
- Return predictable results.
- Avoid side effects whenever possible.

Prefer:

```javascript
calculateDamage()
```

over:

```javascript
calculateDamageAndUpdateUI()
```

---

# Dependencies

Prefer loose coupling.

Systems should depend on interfaces and shared data rather than implementation details.

Avoid deep dependency chains.

---

# Hardcoded Logic

Avoid hardcoded gameplay logic.

Bad:

```javascript
if (entity.id === "royalKnight")
```

Good:

```javascript
if (entity.definitionId === ...)
```

Better:

```javascript
if (entity.hasKeyword("Heavy Cavalry"))
```

Gameplay should be driven by Definitions.

---

# Reuse

Never duplicate gameplay logic.

If two systems perform similar work, create a shared utility or move the logic into an existing Engine System.

---

# Performance

Readability comes before optimization.

Only optimize code after identifying an actual performance problem.

Do not sacrifice maintainability for theoretical performance gains.

---

# Error Handling

Fail clearly.

Errors should provide useful information.

Avoid silent failures.

Unexpected states should be easy to diagnose.

---

# Documentation

Complex systems should have their own specification document.

Update documentation whenever architecture changes.

Documentation is considered part of the project.

---

# AI Development Guidelines

AI-generated code should:

- Follow all architecture documents.
- Preserve existing patterns.
- Avoid introducing duplicate systems.
- Avoid unnecessary abstraction.
- Avoid unnecessary dependencies.
- Keep implementations simple.

When uncertain, prefer consistency with the existing architecture over introducing a new pattern.

---

# Before Writing Code

Before implementing a new feature, ask:

1. Does a system already exist that should own this responsibility?
2. Does this belong in the Engine?
3. Can this be data instead of code?
4. Does this duplicate existing functionality?
5. Will this make future content easier to add?

If any answer indicates duplication or misplaced responsibility, redesign before implementing.

---

# Decision Log

## 2026-06-28

- Renderer is read-only.
- Game State is the single source of truth.
- Everything on the board is an Entity.
- Rule Cards are not Entities.
- Definitions are immutable.
- Gameplay belongs in Engine Systems.
- Data-driven design is preferred over hardcoded logic.