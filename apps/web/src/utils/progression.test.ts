import { describe, expect, it } from "vitest";
import { buildChordDefinition } from "./chordTheory";
import { buildProgressionPlayback, totalProgressionDuration } from "./progression";

describe("buildProgressionPlayback", () => {
  it("computes event timings from beats and tempo", () => {
    const cMajor = buildChordDefinition(["C", "E", "G"]);
    const dMinor = buildChordDefinition(["D", "F", "A"]);

    const events = buildProgressionPlayback(
      [
        { id: "1", chordId: cMajor.id, beats: 4 },
        { id: "2", chordId: dMinor.id, beats: 2 }
      ],
      {
        [cMajor.id]: cMajor,
        [dMinor.id]: dMinor
      },
      120
    );

    expect(events[0].timeSeconds).toBe(0);
    expect(events[0].durationSeconds).toBe(2);
    expect(events[1].timeSeconds).toBe(2);
    expect(events[1].durationSeconds).toBe(1);
    expect(totalProgressionDuration(events)).toBe(3);
  });
});
