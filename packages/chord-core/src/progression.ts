import type {
  ChordDefinition,
  ProgressionPlaybackEvent,
  ProgressionStep
} from "./types";

export const buildProgressionPlayback = (
  steps: ProgressionStep[],
  chordsById: Record<string, ChordDefinition>,
  tempo: number
) => {
  const beatsPerSecond = 60 / Math.max(tempo, 20);
  let elapsedSeconds = 0;

  return steps.reduce<ProgressionPlaybackEvent[]>((events, step) => {
    const chord = chordsById[step.chordId];
    if (!chord) {
      return events;
    }

    const durationSeconds = step.beats * beatsPerSecond;
    events.push({
      chordId: step.chordId,
      midiNotes: chord.voicing.midiNotes,
      beats: step.beats,
      timeSeconds: elapsedSeconds,
      durationSeconds
    });
    elapsedSeconds += durationSeconds;
    return events;
  }, []);
};

export const totalProgressionDuration = (events: ProgressionPlaybackEvent[]) => {
  if (events.length === 0) {
    return 0;
  }

  const lastEvent = events[events.length - 1];
  return lastEvent.timeSeconds + lastEvent.durationSeconds;
};
