import { DEFAULT_PROGRESSION_NAME, DEFAULT_WORKING_VOICING } from "../constants/music";
import type { PersistedChordState } from "../types/music";

export const STORAGE_KEY = "chromatic-canvas/v1";

export const defaultPersistedState: PersistedChordState = {
  selectedPitchClasses: [],
  workingVoicing: DEFAULT_WORKING_VOICING,
  currentInstrument: "piano",
  savedChords: [],
  savedProgressions: [],
  progressionDraft: {
    id: null,
    name: DEFAULT_PROGRESSION_NAME,
    steps: [],
    tempo: 92,
    instrument: "piano",
    loop: true
  }
};

export const parseStoredState = (raw: string | null): PersistedChordState => {
  if (!raw) {
    return defaultPersistedState;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedChordState>;
    return {
      ...defaultPersistedState,
      ...parsed,
      workingVoicing: {
        ...defaultPersistedState.workingVoicing,
        ...parsed.workingVoicing
      },
      progressionDraft: {
        ...defaultPersistedState.progressionDraft,
        ...parsed.progressionDraft
      }
    };
  } catch {
    return defaultPersistedState;
  }
};

export const loadStoredState = () => {
  if (typeof window === "undefined") {
    return defaultPersistedState;
  }

  return parseStoredState(window.localStorage.getItem(STORAGE_KEY));
};

export const saveStoredState = (state: PersistedChordState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
