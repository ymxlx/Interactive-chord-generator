import { beforeEach, describe, expect, it } from "vitest";
import { STORAGE_KEY, defaultPersistedState, loadStoredState, parseStoredState, saveStoredState } from "./persist";
import type { PersistedChordState } from "../types/music";

describe("persist helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns defaults for malformed state", () => {
    expect(parseStoredState("{bad json")).toEqual(defaultPersistedState);
  });

  it("saves and hydrates persisted state from localStorage", () => {
    const nextState: PersistedChordState = {
      ...defaultPersistedState,
      selectedPitchClasses: ["C", "E", "G"],
      progressionDraft: {
        ...defaultPersistedState.progressionDraft,
        name: "Golden loop",
        tempo: 110
      }
    };

    saveStoredState(nextState);

    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();
    expect(loadStoredState()).toMatchObject({
      selectedPitchClasses: ["C", "E", "G"],
      progressionDraft: {
        name: "Golden loop",
        tempo: 110
      }
    });
  });
});
