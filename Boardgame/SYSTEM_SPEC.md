# System Specification Standard

## Purpose

This document defines the standard used when documenting Engine Systems.

Every Engine System in the project should have its own specification document. The goal is to ensure consistency, clearly define responsibilities, and provide guidance for both developers and AI assistants.

This document describes **how** system specifications should be written. It is **not** a template to be copied.

---

## Naming Convention

Each Engine System should have its own Markdown document.

Examples:

- `ENTITY_SYSTEM.md`
- `MAP_SYSTEM.md`
- `MOVEMENT_SYSTEM.md`
- `COMBAT_SYSTEM.md`
- `ABILITY_SYSTEM.md`
- `TURN_SYSTEM.md`
- `CARD_SYSTEM.md`
- `VICTORY_SYSTEM.md`

---

## Required Sections

Every Engine System specification should contain the following sections.

### Purpose

Describe **why the system exists**.

### Responsibilities

Describe everything the system is responsible for.

### Does NOT Handle

Describe responsibilities intentionally owned by other systems.

This section is mandatory.

### Reads

Describe which data the system reads.

Typical examples include:

- Game State
- Entity Definitions
- Terrain Definitions
- Card Definitions

### Writes

Describe which data the system modifies.

In most cases this should only be changes to the Game State performed through the Engine.

### Public API

Document all public functions that other systems are allowed to call.

Private helper functions should not be documented here.

### Dependencies

List any Engine Systems this system depends on.

Dependencies should be kept to a minimum.

Circular dependencies should always be avoided.

### Decision Log

Record important architectural decisions.

Do **not** use this as a changelog. Explain **why** important decisions were made.

---

## Documentation Guidelines

A complete system specification should answer:

1. Why does this system exist?
2. What is it responsible for?
3. What is it explicitly **not** responsible for?
4. What data does it read?
5. What data does it modify?
6. Which systems does it interact with?
7. What public functions does it expose?

---

## Design Principles

Every Engine System should:

- Have a single responsibility.
- Remain independent whenever possible.
- Avoid unnecessary dependencies.
- Never manipulate the Renderer.
- Never manipulate the DOM.
- Never contain UI logic.
- Never contain hardcoded gameplay content.
- Prefer reusable systems over special-case solutions.
- Keep the public API as small as possible.

---

## Relationship to Other Documentation

System specifications complement the project's architecture documentation.

- `ENGINE_ARCHITECTURE.md` defines the engine architecture.
- `ENTITY_MODEL.md` defines how game objects are represented.
- `CODING_STANDARD.md` defines implementation rules.
- Individual system specifications define the behaviour of each Engine System.

---

## Philosophy

A good system specification describes **behaviour**, not implementation.

It should explain:

- What the system is expected to do.
- What its responsibilities are.
- What its boundaries are.
- How it interacts with the rest of the engine.

It should **not** describe implementation details unless they are part of the system's public contract.