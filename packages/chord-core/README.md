# chord-engine-core

Chord detection, MIDI utilities, voicing resolution, and Tone.js playback engines for music applications.

This package is the standalone logic layer extracted from the [Interactive Chord Generator](https://github.com/ymxlx/Interactive-chord-generator). It has **zero UI dependencies** — bring your own framework or use it headless.

## Install

```bash
npm install chord-engine-core tone
```

> `tone` is a peer dependency and must be installed alongside.

## Quick start

```ts
import {
  identifyChord,
  buildChordMidi,
  analyzeChord,
  ChordEngine,
  PITCH_CLASSES,
} from "chord-engine-core";

// Identify a chord from numeric pitch classes (0 = C, 4 = E, 7 = G)
identifyChord([0, 4, 7]);   // → "C Major"
identifyChord([9, 0, 4]);   // → "A Minor"

// Build MIDI note array from root + quality
buildChordMidi(0, "Major"); // → [48, 52, 55]
buildChordMidi(2, "Minor"); // → [50, 53, 57]

// Full chord analysis with voicing
const resolved = analyzeChord(["D", "F#", "A"], {
  inversion: 0,
  spread: "close",
  registerShift: "center",
  bassPitchClass: "auto",
});
// → { name: "D", quality: "Major", midiNotes: [50, 54, 57], ... }

// Play a chord through Tone.js
const engine = new ChordEngine();
engine.playChord([60, 64, 67], "piano", 1.5);
```

## API reference

### Chord detection

| Function | Signature | Description |
|----------|-----------|-------------|
| `identifyChord` | `(pitchClasses: number[]) → string` | Returns the chord name for a set of numeric pitch classes. |
| `analyzeChord` | `(pcs: PitchClass[], voicing: WorkingVoicing) → ResolvedChord` | Full analysis: name, quality, intervals, MIDI notes, labels, and colours. |
| `buildChordDefinition` | `(pcs: PitchClass[], voicing: WorkingVoicing) → ChordDefinition` | Builds a storable chord object with unique ID and timestamp. |

### MIDI utilities

| Function | Signature | Description |
|----------|-----------|-------------|
| `buildChordMidi` | `(root: number, quality: string) → number[]` | Generates MIDI note numbers for a root + quality combination. |
| `pitchClassesToMidi` | `(pcs: number[]) → number[]` | Converts numeric pitch classes to MIDI in octave 4, wrapping as needed. |
| `midiToPitchClass` | `(midi: number) → PitchClass` | Converts a MIDI note number to its pitch class name. |
| `midiToLabel` | `(midi: number) → string` | Converts a MIDI number to a human-readable label (e.g. `"C4"`). |
| `pitchClassToMidi` | `(pc: PitchClass, octave?: number) → number` | Converts a named pitch class to a MIDI number at a given octave. |

### Voicing

| Function | Signature | Description |
|----------|-----------|-------------|
| `resolveChordVoicing` | `(pcs: PitchClass[], voicing: WorkingVoicing) → ChordVoicing` | Applies inversion, spread, register shift, and bass note override to produce final MIDI voicing. |
| `normalizePitchClasses` | `(pcs: PitchClass[]) → PitchClass[]` | Deduplicates and sorts pitch classes chromatically. |
| `isBlackKeyPitchClass` | `(pc: PitchClass) → boolean` | Returns `true` for sharps/flats. |

### Progression scheduling

| Function | Signature | Description |
|----------|-----------|-------------|
| `buildProgressionPlayback` | `(steps: ProgressionStep[]) → ProgressionPlaybackEvent[]` | Converts progression steps with beat counts into timed playback events. |
| `totalProgressionDuration` | `(events: ProgressionPlaybackEvent[]) → number` | Returns the total duration of a progression in seconds. |

### Audio engines

#### `ChordEngine`

High-level engine for playing chords and progressions with typed instrument presets.

```ts
const engine = new ChordEngine();
engine.playChord(midiNotes, "synthPad", 2.0);
engine.playProgression(events, "piano", 120, true); // tempo 120, loop on
engine.stopProgression();
```

**Instrument presets:** `"piano"` | `"synthPad"` | `"guitar"` | `"strings"`

#### `AudioEngine`

Lower-level engine with volume control and seven instrument presets.

```ts
const engine = new AudioEngine();
await engine.init();
engine.setInstrument("organ");
engine.playChord([60, 64, 67], 1.5);
engine.playProgression(chordArray, 100, onChordCallback);
engine.stopAll();
```

**Instrument presets:** `"piano"` | `"strings"` | `"organ"` | `"synth"` | `"guitar"` | `"brass"` | `"marimba"`

### Constants

| Export | Description |
|--------|-------------|
| `PITCH_CLASSES` | `["C", "C#", "D", ..., "B"]` — all 12 pitch classes |
| `PITCH_CLASS_TO_SEMITONE` | Map from pitch class name to semitone number |
| `NOTE_COLOR_MAP` | Unique hex colour for each pitch class |
| `INTERVAL_LABELS` | Human-readable interval names (unison, minor 2nd, etc.) |
| `INSTRUMENT_LABELS` | Display names for the four instrument presets |
| `CHORD_TYPES` | Array of 16 chord type definitions with intervals |
| `PRESET_PROGRESSIONS` | 8 built-in progressions (Pop, Jazz, Classic, etc.) |

### Types

All TypeScript types are exported for use in your own projects:

`PitchClass` · `InstrumentPreset` · `ChordVoicing` · `ChordDefinition` · `ProgressionStep` · `ProgressionDefinition` · `WorkingVoicing` · `ResolvedChord` · `ProgressionPlaybackEvent`

## Peer dependencies

| Package | Version |
|---------|---------|
| `tone`  | `^15.0.0` |

## Author

**Yehuda Levy**

## License

CC BY 4.0 — see [LICENSE](./LICENSE) for details.
