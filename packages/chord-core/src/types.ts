export type PitchClass =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B";

export type InstrumentPreset = "piano" | "synthPad" | "guitar" | "strings";

export type ChordVoicing = {
  midiNotes: number[];
  inversion: 0 | 1 | 2 | 3;
  bassMidiNote: number | null;
  spread: "close" | "open";
  registerShift: -1 | 0 | 1;
};

export type ChordDefinition = {
  id: string;
  selectedPitchClasses: PitchClass[];
  voicing: ChordVoicing;
  detectedName: string;
  intervals: string[];
  colorToken: string;
  createdAt: string;
};

export type ProgressionStep = {
  id: string;
  chordId: string;
  beats: number;
};

export type ProgressionDefinition = {
  id: string;
  name: string;
  steps: ProgressionStep[];
  tempo: number;
  instrument: InstrumentPreset;
  loop: boolean;
  createdAt: string;
};

export type WorkingVoicing = {
  inversion: 0 | 1 | 2 | 3;
  spread: "close" | "open";
  registerShift: -1 | 0 | 1;
  bassPitchClass: PitchClass | "auto";
};

export type ResolvedChord = {
  root: PitchClass | null;
  qualityLabel: string;
  detectedName: string;
  intervals: string[];
  voicing: ChordVoicing;
  midiLabels: string[];
  colorToken: string;
};

export type ProgressionPlaybackEvent = {
  chordId: string;
  midiNotes: number[];
  beats: number;
  timeSeconds: number;
  durationSeconds: number;
};

export type PersistedChordState = {
  selectedPitchClasses: PitchClass[];
  workingVoicing: WorkingVoicing;
  currentInstrument: InstrumentPreset;
  savedChords: ChordDefinition[];
  savedProgressions: ProgressionDefinition[];
  progressionDraft: {
    id: string | null;
    name: string;
    steps: ProgressionStep[];
    tempo: number;
    instrument: InstrumentPreset;
    loop: boolean;
  };
};
