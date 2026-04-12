import { describe, expect, it } from "vitest";
import { analyzeChord, normalizePitchClasses, resolveChordVoicing } from "./chordTheory";

describe("normalizePitchClasses", () => {
  it("deduplicates and sorts pitch classes chromatically", () => {
    expect(normalizePitchClasses(["G", "C", "G", "D#"])).toEqual(["C", "D#", "G"]);
  });
});

describe("analyzeChord", () => {
  it("detects a major triad", () => {
    const chord = analyzeChord(["C", "E", "G"]);
    expect(chord.detectedName).toBe("C");
    expect(chord.qualityLabel).toBe("Major triad");
    expect(chord.intervals).toEqual(["1", "3", "5"]);
  });

  it("detects a minor seventh chord", () => {
    const chord = analyzeChord(["D", "F", "A", "C"]);
    expect(chord.detectedName).toBe("Dm7");
    expect(chord.intervals).toEqual(["1", "b3", "5", "b7"]);
  });

  it("falls back to a custom cluster for ambiguous note sets", () => {
    const chord = analyzeChord(["C", "C#", "G"]);
    expect(chord.detectedName).toBe("C custom");
    expect(chord.qualityLabel).toBe("Custom cluster");
  });
});

describe("resolveChordVoicing", () => {
  it("applies inversion and register shift when resolving midi notes", () => {
    const voicing = resolveChordVoicing("C", [0, 4, 7], {
      inversion: 1,
      spread: "close",
      registerShift: 1,
      bassPitchClass: "auto"
    });

    expect(voicing.midiNotes).toEqual([76, 79, 84]);
  });

  it("resolves explicit bass overrides into lower midi notes", () => {
    const voicing = resolveChordVoicing("C", [0, 4, 7], {
      inversion: 0,
      spread: "open",
      registerShift: 0,
      bassPitchClass: "G"
    });

    expect(voicing.bassMidiNote).toBe(43);
    expect(voicing.midiNotes[0]).toBe(43);
  });
});
