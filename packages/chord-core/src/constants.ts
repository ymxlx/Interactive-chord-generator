import type { InstrumentPreset, PitchClass, WorkingVoicing } from "./types";

export const PITCH_CLASSES: PitchClass[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
];

export const PITCH_CLASS_TO_SEMITONE: Record<PitchClass, number> = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11
};

export const NOTE_COLOR_MAP: Record<PitchClass, string> = {
  C: "#e87a5d",
  "C#": "#de6b66",
  D: "#d8753a",
  "D#": "#d8a03a",
  E: "#bfaa44",
  F: "#8fb14d",
  "F#": "#5fa979",
  G: "#3f998f",
  "G#": "#4087b7",
  A: "#556ed1",
  "A#": "#8264d4",
  B: "#b564c8"
};

export const INTERVAL_LABELS: Record<number, string> = {
  0: "1",
  1: "b2",
  2: "2",
  3: "b3",
  4: "3",
  5: "4",
  6: "b5",
  7: "5",
  8: "#5",
  9: "6",
  10: "b7",
  11: "7"
};

export const INSTRUMENT_LABELS: Record<InstrumentPreset, string> = {
  piano: "Studio Piano",
  synthPad: "Warm Pad",
  guitar: "Velvet Pluck",
  strings: "String Bloom"
};

export const DEFAULT_WORKING_VOICING: WorkingVoicing = {
  inversion: 0,
  spread: "close",
  registerShift: 0,
  bassPitchClass: "auto"
};

export const DEFAULT_PROGRESSION_NAME = "Untitled progression";
