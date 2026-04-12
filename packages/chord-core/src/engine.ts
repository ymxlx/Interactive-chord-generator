import * as Tone from "tone";
import type { InstrumentPreset, ProgressionPlaybackEvent } from "./types";
import { midiToLabel } from "./chord-logic";
import { totalProgressionDuration } from "./progression";

type PolyVoice = Tone.PolySynth<any>;

export class ChordEngine {
  private started = false;

  private activePart: Tone.Part<{ labels: string[]; duration: number }> | null = null;

  private instruments: Partial<Record<InstrumentPreset, PolyVoice>> = {};

  private async ensureStarted() {
    if (!this.started) {
      await Tone.start();
      this.started = true;
    }
  }

  private getInstrument(preset: InstrumentPreset) {
    if (this.instruments[preset]) {
      return this.instruments[preset]!;
    }

    let instrument: PolyVoice;

    if (preset === "piano") {
      instrument = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle4" },
        envelope: { attack: 0.008, decay: 0.22, sustain: 0.2, release: 1.2 }
      }).toDestination();
    } else if (preset === "synthPad") {
      instrument = new Tone.PolySynth(Tone.AMSynth, {
        harmonicity: 1.5,
        envelope: { attack: 0.25, decay: 0.4, sustain: 0.8, release: 1.8 }
      }).toDestination();
    } else if (preset === "guitar") {
      instrument = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle2" },
        envelope: { attack: 0.005, decay: 0.18, sustain: 0.08, release: 0.9 }
      }).toDestination();
    } else {
      instrument = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 2.1,
        envelope: { attack: 0.14, decay: 0.3, sustain: 0.72, release: 1.6 }
      }).toDestination();
    }

    instrument.volume.value = preset === "synthPad" ? -11 : -8;
    this.instruments[preset] = instrument;
    return instrument;
  }

  async playChord(midiNotes: number[], preset: InstrumentPreset, durationSeconds = 1.8) {
    if (midiNotes.length === 0) {
      return;
    }

    await this.ensureStarted();
    this.stopProgression();
    const instrument = this.getInstrument(preset);
    instrument.triggerAttackRelease(
      midiNotes.map(midiToLabel),
      durationSeconds,
      Tone.now(),
      0.92
    );
  }

  async playProgression(
    events: ProgressionPlaybackEvent[],
    preset: InstrumentPreset,
    tempo: number,
    loop: boolean
  ) {
    if (events.length === 0) {
      return;
    }

    await this.ensureStarted();
    this.stopProgression();
    const instrument = this.getInstrument(preset);
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.bpm.value = tempo;

    this.activePart = new Tone.Part((time, value) => {
      instrument.triggerAttackRelease(value.labels, value.duration, time, 0.92);
    });

    events.forEach((event) => {
      this.activePart?.add(event.timeSeconds, {
        labels: event.midiNotes.map(midiToLabel),
        duration: Math.max(0.18, event.durationSeconds * 0.92)
      });
    });

    this.activePart.loop = loop;
    this.activePart.loopEnd = totalProgressionDuration(events);
    this.activePart.start(0);
    Tone.Transport.start();
  }

  stopProgression() {
    if (this.activePart) {
      this.activePart.stop();
      this.activePart.dispose();
      this.activePart = null;
    }

    Tone.Transport.stop();
    Tone.Transport.cancel();
  }
}

const LEGACY_INSTRUMENT_MAP: Record<string, InstrumentPreset> = {
  piano: "piano",
  strings: "strings",
  organ: "synthPad",
  synth: "synthPad",
  guitar: "guitar",
  brass: "strings",
  marimba: "guitar"
};

export class AudioEngine {
  private currentInstrument: InstrumentPreset = "piano";

  private volume = 0.82;

  constructor(private readonly internalEngine: ChordEngine = new ChordEngine()) {}

  async init() {
    return Promise.resolve();
  }

  setVolume(volume: number) {
    this.volume = volume;
  }

  setInstrument(name: string) {
    this.currentInstrument = LEGACY_INSTRUMENT_MAP[name] ?? "piano";
  }

  async playNote(midi: number, duration: string | number = 0.4) {
    const seconds = typeof duration === "number" ? duration : 0.4;
    await this.internalEngine.playChord([midi], this.currentInstrument, seconds * this.volume);
  }

  async playChord(midiNotes: number[], duration: string | number = 1.4) {
    const seconds = typeof duration === "number" ? duration : 1.4;
    await this.internalEngine.playChord(midiNotes, this.currentInstrument, seconds * this.volume);
  }

  async playProgression(
    chords: number[][],
    bpm = 100,
    onChordStart: (index: number) => void
  ) {
    const secondsPerChord = 240 / bpm;
    const events = chords.map((chord, index) => ({
      chordId: `legacy-${index}`,
      midiNotes: chord,
      beats: 4,
      timeSeconds: index * secondsPerChord,
      durationSeconds: secondsPerChord
    }));

    onChordStart(0);
    await this.internalEngine.playProgression(events, this.currentInstrument, bpm, false);
    onChordStart(-1);
  }

  stopProgression() {
    this.internalEngine.stopProgression();
  }

  stopAll() {
    this.internalEngine.stopProgression();
  }
}

export const chordEngine = new ChordEngine();
export const audioEngine = new AudioEngine(chordEngine);
