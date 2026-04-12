import {
  DEFAULT_WORKING_VOICING,
  INTERVAL_LABELS,
  NOTE_COLOR_MAP,
  PITCH_CLASSES,
  PITCH_CLASS_TO_SEMITONE
} from "./constants";
import type {
  ChordDefinition,
  ChordVoicing,
  PitchClass,
  ResolvedChord,
  WorkingVoicing
} from "./types";

type ChordPattern = {
  suffix: string;
  qualityLabel: string;
  intervals: number[];
  priority: number;
};

export const NOTE_NAMES = PITCH_CLASSES;
export const NOTE_NAMES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
export const NOTE_COLORS = PITCH_CLASSES.map((pitchClass) => NOTE_COLOR_MAP[pitchClass]);

export const CHORD_TYPES = [
  { name: "Major", symbol: "", intervals: [0, 4, 7] },
  { name: "Minor", symbol: "m", intervals: [0, 3, 7] },
  { name: "Dim", symbol: "dim", intervals: [0, 3, 6] },
  { name: "Aug", symbol: "aug", intervals: [0, 4, 8] },
  { name: "Sus2", symbol: "sus2", intervals: [0, 2, 7] },
  { name: "Sus4", symbol: "sus4", intervals: [0, 5, 7] },
  { name: "Maj7", symbol: "maj7", intervals: [0, 4, 7, 11] },
  { name: "Min7", symbol: "m7", intervals: [0, 3, 7, 10] },
  { name: "Dom7", symbol: "7", intervals: [0, 4, 7, 10] },
  { name: "Dim7", symbol: "dim7", intervals: [0, 3, 6, 9] },
  { name: "Min Maj7", symbol: "mM7", intervals: [0, 3, 7, 11] },
  { name: "Add9", symbol: "add9", intervals: [0, 4, 7, 14] },
  { name: "Maj9", symbol: "maj9", intervals: [0, 4, 7, 11, 14] },
  { name: "6th", symbol: "6", intervals: [0, 4, 7, 9] },
  { name: "Min6", symbol: "m6", intervals: [0, 3, 7, 9] },
  { name: "Power", symbol: "5", intervals: [0, 7] }
] as const;

export const PRESET_PROGRESSIONS = [
  { name: "I - V - vi - IV", label: "Pop", degrees: [{ root: 0, type: "" }, { root: 7, type: "" }, { root: 9, type: "m" }, { root: 5, type: "" }] },
  { name: "ii - V - I", label: "Jazz", degrees: [{ root: 2, type: "m7" }, { root: 7, type: "7" }, { root: 0, type: "maj7" }] },
  { name: "I - IV - V - I", label: "Classic", degrees: [{ root: 0, type: "" }, { root: 5, type: "" }, { root: 7, type: "" }, { root: 0, type: "" }] },
  { name: "vi - IV - I - V", label: "Emotional", degrees: [{ root: 9, type: "m" }, { root: 5, type: "" }, { root: 0, type: "" }, { root: 7, type: "" }] },
  { name: "I - vi - IV - V", label: "50s", degrees: [{ root: 0, type: "" }, { root: 9, type: "m" }, { root: 5, type: "" }, { root: 7, type: "" }] },
  { name: "i - VI - III - VII", label: "Epic", degrees: [{ root: 0, type: "m" }, { root: 8, type: "" }, { root: 3, type: "" }, { root: 10, type: "" }] },
  { name: "I - V - vi - iii - IV", label: "Canon", degrees: [{ root: 0, type: "" }, { root: 7, type: "" }, { root: 9, type: "m" }, { root: 4, type: "m" }, { root: 5, type: "" }] },
  { name: "i - iv - v - i", label: "Minor Blues", degrees: [{ root: 0, type: "m7" }, { root: 5, type: "m7" }, { root: 7, type: "7" }, { root: 0, type: "m7" }] }
] as const;

const CHORD_PATTERNS: ChordPattern[] = [
  { suffix: "maj7", qualityLabel: "Major seventh", intervals: [0, 4, 7, 11], priority: 14 },
  { suffix: "7", qualityLabel: "Dominant seventh", intervals: [0, 4, 7, 10], priority: 13 },
  { suffix: "m7", qualityLabel: "Minor seventh", intervals: [0, 3, 7, 10], priority: 13 },
  { suffix: "mMaj7", qualityLabel: "Minor major seventh", intervals: [0, 3, 7, 11], priority: 12 },
  { suffix: "m7b5", qualityLabel: "Half diminished", intervals: [0, 3, 6, 10], priority: 12 },
  { suffix: "dim7", qualityLabel: "Diminished seventh", intervals: [0, 3, 6, 9], priority: 12 },
  { suffix: "6", qualityLabel: "Major sixth", intervals: [0, 4, 7, 9], priority: 11 },
  { suffix: "m6", qualityLabel: "Minor sixth", intervals: [0, 3, 7, 9], priority: 11 },
  { suffix: "add9", qualityLabel: "Added ninth", intervals: [0, 2, 4, 7], priority: 10 },
  { suffix: "m(add9)", qualityLabel: "Minor added ninth", intervals: [0, 2, 3, 7], priority: 10 },
  { suffix: "", qualityLabel: "Major triad", intervals: [0, 4, 7], priority: 9 },
  { suffix: "m", qualityLabel: "Minor triad", intervals: [0, 3, 7], priority: 9 },
  { suffix: "dim", qualityLabel: "Diminished triad", intervals: [0, 3, 6], priority: 8 },
  { suffix: "aug", qualityLabel: "Augmented triad", intervals: [0, 4, 8], priority: 8 },
  { suffix: "sus2", qualityLabel: "Suspended second", intervals: [0, 2, 7], priority: 8 },
  { suffix: "sus4", qualityLabel: "Suspended fourth", intervals: [0, 5, 7], priority: 8 },
  { suffix: "5", qualityLabel: "Power chord", intervals: [0, 7], priority: 7 }
];

const BLACK_KEY_SEMITONES = new Set([1, 3, 6, 8, 10]);

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export function getNoteName(pc: number) {
  return NOTE_NAMES[(pc + 120) % 12];
}

export function getNoteColor(pc: number) {
  return NOTE_COLORS[(pc + 120) % 12];
}

export const normalizePitchClasses = (pitchClasses: PitchClass[]) => {
  return [...new Set(pitchClasses)].sort(
    (left, right) => PITCH_CLASS_TO_SEMITONE[left] - PITCH_CLASS_TO_SEMITONE[right]
  );
};

export const isBlackKeyPitchClass = (pitchClass: PitchClass) =>
  BLACK_KEY_SEMITONES.has(PITCH_CLASS_TO_SEMITONE[pitchClass]);

export const midiToPitchClass = (midiNote: number): PitchClass => {
  const normalized = ((midiNote % 12) + 12) % 12;
  return PITCH_CLASSES[normalized];
};

export const midiToLabel = (midiNote: number) => {
  const pitchClass = midiToPitchClass(midiNote);
  const octave = Math.floor(midiNote / 12) - 1;
  return `${pitchClass}${octave}`;
};

export const pitchClassToMidi = (pitchClass: PitchClass, octave: number) =>
  12 * (octave + 1) + PITCH_CLASS_TO_SEMITONE[pitchClass];

export function pitchClassesToMidi(pitchClasses: number[], baseOctave = 4) {
  if (pitchClasses.length === 0) return [];
  const sorted = [...pitchClasses].sort((a, b) => a - b);
  const midi: number[] = [];
  const baseMidi = 12 * (baseOctave + 1);
  sorted.forEach((pc) => {
    let note = baseMidi + pc;
    if (midi.length > 0 && note <= midi[midi.length - 1]) {
      note += 12;
    }
    midi.push(note);
  });
  if (midi.length > 0 && midi[midi.length - 1] > 84) {
    return midi.map((m) => m - 12);
  }
  return midi;
}

export function buildChordMidi(rootPc: number, typeSymbol: string, baseOctave = 4) {
  const chordType = CHORD_TYPES.find((item) => item.symbol === typeSymbol);
  if (!chordType) return [];
  const baseMidi = 12 * (baseOctave + 1) + rootPc;
  return chordType.intervals.map((interval) => baseMidi + interval);
}

export function identifyChord(pitchClasses: number[]) {
  if (pitchClasses.length < 2) return null;
  const sorted = [...new Set(pitchClasses)].sort((a, b) => a - b);
  for (const root of sorted) {
    const intervals = sorted.map((pc) => (pc - root + 12) % 12).sort((a, b) => a - b);
    for (const chordType of CHORD_TYPES) {
      const chordIntervals = chordType.intervals.map((interval) => interval % 12).sort((a, b) => a - b);
      const uniqueChord = [...new Set(chordIntervals)];
      const uniqueInput = [...new Set(intervals)];
      if (
        uniqueChord.length === uniqueInput.length &&
        uniqueChord.every((value, index) => value === uniqueInput[index])
      ) {
        return {
          root,
          rootName: getNoteName(root),
          type: chordType,
          name: getNoteName(root) + chordType.symbol,
          fullName: `${getNoteName(root)} ${chordType.name}`
        };
      }
    }
  }
  return {
    root: sorted[0],
    rootName: getNoteName(sorted[0]),
    type: null,
    name: sorted.map((pc) => getNoteName(pc)).join("/"),
    fullName: "Custom voicing"
  };
}

const signatureForIntervals = (intervals: number[]) => [...intervals].sort((a, b) => a - b).join("-");

const detectPattern = (pitchClasses: PitchClass[]) => {
  const normalized = normalizePitchClasses(pitchClasses);
  const candidates = normalized
    .map((root) => {
      const intervals = normalized
        .map((pitchClass) => {
          const difference =
            PITCH_CLASS_TO_SEMITONE[pitchClass] - PITCH_CLASS_TO_SEMITONE[root];
          return (difference + 12) % 12;
        })
        .sort((left, right) => left - right);

      const pattern = CHORD_PATTERNS.find(
        (candidate) => signatureForIntervals(candidate.intervals) === signatureForIntervals(intervals)
      );

      if (!pattern) {
        return null;
      }

      const rootBias = root === normalized[0] ? 0.25 : 0;
      return {
        root,
        intervals,
        pattern,
        score: pattern.priority + rootBias
      };
    })
    .filter((value): value is NonNullable<typeof value> => value !== null)
    .sort((left, right) => right.score - left.score);

  return candidates[0] ?? null;
};

export const resolveChordVoicing = (
  root: PitchClass,
  intervals: number[],
  workingVoicing: WorkingVoicing = DEFAULT_WORKING_VOICING
): ChordVoicing => {
  const baseMidi = pitchClassToMidi(root, 4);
  const normalizedIntervals = [...intervals].sort((left, right) => left - right);
  let midiNotes = normalizedIntervals.map((interval) => baseMidi + interval);

  const maxInversion = Math.min(workingVoicing.inversion, Math.max(midiNotes.length - 1, 0)) as
    | 0
    | 1
    | 2
    | 3;

  for (let index = 0; index < maxInversion; index += 1) {
    midiNotes[index] += 12;
  }

  midiNotes = midiNotes.sort((left, right) => left - right);

  if (workingVoicing.spread === "open" && midiNotes.length >= 3) {
    midiNotes = midiNotes.map((note, index) => {
      if (index === 1 || (midiNotes.length >= 4 && index === 2)) {
        return note + 12;
      }

      return note;
    });
  }

  midiNotes = midiNotes
    .map((note) => note + workingVoicing.registerShift * 12)
    .sort((left, right) => left - right);

  const bassMidiNote =
    workingVoicing.bassPitchClass === "auto"
      ? midiNotes[0] ?? null
      : pitchClassToMidi(workingVoicing.bassPitchClass, 2);

  const finalMidiNotes = [...midiNotes];
  if (bassMidiNote !== null && !finalMidiNotes.includes(bassMidiNote)) {
    finalMidiNotes.unshift(bassMidiNote);
  }

  return {
    midiNotes: [...new Set(finalMidiNotes)].sort((left, right) => left - right),
    inversion: maxInversion,
    bassMidiNote,
    spread: workingVoicing.spread,
    registerShift: workingVoicing.registerShift
  };
};

const getFallbackIntervals = (pitchClasses: PitchClass[]) => {
  const normalized = normalizePitchClasses(pitchClasses);

  if (normalized.length === 0) {
    return [];
  }

  const root = normalized[0];
  return normalized
    .map((pitchClass) => {
      const difference =
        PITCH_CLASS_TO_SEMITONE[pitchClass] - PITCH_CLASS_TO_SEMITONE[root];
      return (difference + 12) % 12;
    })
    .sort((left, right) => left - right);
};

export const analyzeChord = (
  pitchClasses: PitchClass[],
  workingVoicing: WorkingVoicing = DEFAULT_WORKING_VOICING
): ResolvedChord => {
  const normalized = normalizePitchClasses(pitchClasses);

  if (normalized.length === 0) {
    return {
      root: null,
      qualityLabel: "No chord selected",
      detectedName: "Build a chord",
      intervals: [],
      voicing: {
        midiNotes: [],
        inversion: 0,
        bassMidiNote: null,
        spread: workingVoicing.spread,
        registerShift: workingVoicing.registerShift
      },
      midiLabels: [],
      colorToken: NOTE_COLOR_MAP.C
    };
  }

  const detected = detectPattern(normalized);
  const root = detected?.root ?? normalized[0];
  const intervals = detected?.intervals ?? getFallbackIntervals(normalized);
  const voicing = resolveChordVoicing(root, intervals, workingVoicing);
  const qualityLabel = detected?.pattern.qualityLabel ?? "Custom cluster";
  const detectedName =
    detected?.pattern !== undefined
      ? `${root}${detected.pattern.suffix}`
      : `${root} custom`;

  return {
    root,
    qualityLabel,
    detectedName,
    intervals: intervals.map((interval) => INTERVAL_LABELS[interval] ?? `${interval}`),
    voicing,
    midiLabels: voicing.midiNotes.map(midiToLabel),
    colorToken: NOTE_COLOR_MAP[root]
  };
};

export const buildChordDefinition = (
  pitchClasses: PitchClass[],
  workingVoicing: WorkingVoicing = DEFAULT_WORKING_VOICING
): ChordDefinition => {
  const analysis = analyzeChord(pitchClasses, workingVoicing);

  return {
    id: createId(),
    selectedPitchClasses: normalizePitchClasses(pitchClasses),
    voicing: analysis.voicing,
    detectedName: analysis.detectedName,
    intervals: analysis.intervals,
    colorToken: analysis.colorToken,
    createdAt: new Date().toISOString()
  };
};
