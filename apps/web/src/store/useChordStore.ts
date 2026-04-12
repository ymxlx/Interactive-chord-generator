import { create } from "zustand";
import { DEFAULT_PROGRESSION_NAME } from "../constants/music";
import type {
  ChordDefinition,
  InstrumentPreset,
  PersistedChordState,
  PitchClass,
  ProgressionDefinition
} from "../types/music";
import { defaultPersistedState, loadStoredState, saveStoredState } from "./persist";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

type ChordStoreState = {
  selectedPitchClasses: PitchClass[];
  togglePitchClass: (pc: PitchClass) => void;
  clearSelection: () => void;
  workingVoicing: PersistedChordState["workingVoicing"];
  setInversion: (inv: 0 | 1 | 2 | 3) => void;
  setSpread: (spread: "close" | "open") => void;
  setRegisterShift: (shift: -1 | 0 | 1) => void;
  setBassPitchClass: (pc: PitchClass | "auto") => void;
  currentInstrument: InstrumentPreset;
  setCurrentInstrument: (inst: InstrumentPreset) => void;
  savedChords: ChordDefinition[];
  saveChord: (chord: ChordDefinition) => void;
  removeChord: (id: string) => void;
  savedProgressions: ProgressionDefinition[];
  progressionDraft: PersistedChordState["progressionDraft"];
  addChordToDraft: (chordId: string) => void;
  removeDraftStep: (stepId: string) => void;
  updateDraftStepBeats: (stepId: string, beats: number) => void;
  moveDraftStep: (from: number, to: number) => void;
  setDraftName: (name: string) => void;
  setDraftTempo: (tempo: number) => void;
  setDraftInstrument: (inst: InstrumentPreset) => void;
  setDraftLoop: (loop: boolean) => void;
  saveDraftProgression: () => string | null;
  loadProgression: (progressionId: string) => void;
  removeProgression: (progressionId: string) => void;
  resetDraft: () => void;
  clearDraftSteps: () => void;
  playingStepIndex: number;
  setPlayingStepIndex: (i: number) => void;
  resetStore: () => void;
};

const hydratedState = loadStoredState();

const pickPersistedState = (state: ChordStoreState): PersistedChordState => ({
  selectedPitchClasses: state.selectedPitchClasses,
  workingVoicing: state.workingVoicing,
  currentInstrument: state.currentInstrument,
  savedChords: state.savedChords,
  savedProgressions: state.savedProgressions,
  progressionDraft: state.progressionDraft
});

export const useChordStore = create<ChordStoreState>((set, get) => ({
  ...hydratedState,
  togglePitchClass: (pc) =>
    set((s) => ({
      selectedPitchClasses: s.selectedPitchClasses.includes(pc)
        ? s.selectedPitchClasses.filter((p) => p !== pc)
        : [...s.selectedPitchClasses, pc],
    })),
  clearSelection: () => set({ selectedPitchClasses: [] }),

  setInversion: (inv) =>
    set((s) => ({ workingVoicing: { ...s.workingVoicing, inversion: inv } })),
  setSpread: (spread) =>
    set((s) => ({ workingVoicing: { ...s.workingVoicing, spread } })),
  setRegisterShift: (shift) =>
    set((s) => ({ workingVoicing: { ...s.workingVoicing, registerShift: shift } })),
  setBassPitchClass: (pc) =>
    set((s) => ({ workingVoicing: { ...s.workingVoicing, bassPitchClass: pc } })),
  setCurrentInstrument: (inst) => set({ currentInstrument: inst }),
  saveChord: (chord) =>
    set((s) => ({
      savedChords: [chord, ...s.savedChords.filter((c) => c.id !== chord.id)],
    })),
  removeChord: (id) =>
    set((s) => ({
      savedChords: s.savedChords.filter((c) => c.id !== id),
      progressionDraft: {
        ...s.progressionDraft,
        steps: s.progressionDraft.steps.filter((st) => st.chordId !== id),
      },
      savedProgressions: s.savedProgressions.map((progression) => ({
        ...progression,
        steps: progression.steps.filter((step) => step.chordId !== id)
      }))
    })),
  addChordToDraft: (chordId) =>
    set((s) => ({
      progressionDraft: {
        ...s.progressionDraft,
        steps: [
          ...s.progressionDraft.steps,
          { id: createId(), chordId, beats: 4 },
        ],
      },
    })),
  removeDraftStep: (stepId) =>
    set((s) => ({
      progressionDraft: {
        ...s.progressionDraft,
        steps: s.progressionDraft.steps.filter((st) => st.id !== stepId),
      },
    })),
  updateDraftStepBeats: (stepId, beats) =>
    set((s) => ({
      progressionDraft: {
        ...s.progressionDraft,
        steps: s.progressionDraft.steps.map((st) =>
          st.id === stepId ? { ...st, beats: Math.max(1, Math.min(8, Math.round(beats))) } : st
        ),
      },
    })),
  moveDraftStep: (from, to) =>
    set((s) => {
      const steps = [...s.progressionDraft.steps];
      if (from < 0 || to < 0 || from >= steps.length) {
        return s;
      }
      const target = Math.max(0, Math.min(to, steps.length - 1));
      const [moved] = steps.splice(from, 1);
      if (!moved) return s;
      steps.splice(target, 0, moved);
      return { progressionDraft: { ...s.progressionDraft, steps } };
    }),
  setDraftName: (name) =>
    set((s) => ({ progressionDraft: { ...s.progressionDraft, name } })),
  setDraftTempo: (tempo) =>
    set((s) => ({ progressionDraft: { ...s.progressionDraft, tempo } })),
  setDraftInstrument: (inst) =>
    set((s) => ({ progressionDraft: { ...s.progressionDraft, instrument: inst } })),
  setDraftLoop: (loop) =>
    set((s) => ({ progressionDraft: { ...s.progressionDraft, loop } })),
  saveDraftProgression: () => {
    const state = get();
    if (state.progressionDraft.steps.length === 0) {
      return null;
    }

    const progressionId = state.progressionDraft.id ?? createId();
    const progression: ProgressionDefinition = {
      id: progressionId,
      name: state.progressionDraft.name.trim() || DEFAULT_PROGRESSION_NAME,
      steps: state.progressionDraft.steps,
      tempo: state.progressionDraft.tempo,
      instrument: state.progressionDraft.instrument,
      loop: state.progressionDraft.loop,
      createdAt: new Date().toISOString()
    };

    set((current) => ({
      savedProgressions: [
        progression,
        ...current.savedProgressions.filter((item) => item.id !== progressionId)
      ],
      progressionDraft: {
        ...current.progressionDraft,
        id: progressionId
      }
    }));

    return progressionId;
  },
  loadProgression: (progressionId) =>
    set((state) => {
      const progression = state.savedProgressions.find((item) => item.id === progressionId);
      if (!progression) {
        return state;
      }

      return {
        progressionDraft: {
          id: progression.id,
          name: progression.name,
          steps: progression.steps,
          tempo: progression.tempo,
          instrument: progression.instrument,
          loop: progression.loop
        }
      };
    }),
  removeProgression: (progressionId) =>
    set((state) => ({
      savedProgressions: state.savedProgressions.filter((item) => item.id !== progressionId),
      progressionDraft:
        state.progressionDraft.id === progressionId
          ? {
              ...defaultPersistedState.progressionDraft
            }
          : state.progressionDraft
    })),
  resetDraft: () =>
    set((state) => ({
      progressionDraft: {
        ...defaultPersistedState.progressionDraft,
        tempo: state.progressionDraft.tempo,
        instrument: state.progressionDraft.instrument,
        loop: state.progressionDraft.loop
      }
    })),
  clearDraftSteps: () =>
    set((s) => ({ progressionDraft: { ...s.progressionDraft, steps: [] } })),
  playingStepIndex: -1,
  setPlayingStepIndex: (i) => set({ playingStepIndex: i }),
  resetStore: () =>
    set({
      ...defaultPersistedState,
      playingStepIndex: -1
    })
}));

useChordStore.subscribe((state) => {
  saveStoredState(pickPersistedState(state));
});
