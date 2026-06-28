export const gameState = {
  mapId: "test_map",
  players: [
    {
      id: "player-1",
      name: "Player 1",
    },
  ],
  currentPlayerId: "player-1",
  turnNumber: 1,
  entities: [
    {
      id: "entity-1",
      definitionId: "test-warden",
      type: "hero",
      ownerId: "player-1",
      position: { q: 0, r: 0 },
      state: {},
    },
  ],
  selectedHex: null,
  selectedEntityId: null,
};

export function exportGameState() {
  return JSON.stringify(gameState, null, 2);
}
