import { useState } from "react";
import { motion } from "framer-motion";
import { chordEngine } from "../audio/chordEngine";
import { INSTRUMENT_LABELS, NOTE_COLOR_MAP } from "../constants/music";
import { useChordStore } from "../store/useChordStore";
import { buildProgressionPlayback } from "../utils/progression";
import ChordPresets from "./ChordPresets";

export const ProgressionPanel = () => {
  const [draggedStepId, setDraggedStepId] = useState<string | null>(null);

  const savedChords = useChordStore((state) => state.savedChords);
  const savedProgressions = useChordStore((state) => state.savedProgressions);
  const progressionDraft = useChordStore((state) => state.progressionDraft);
  const addChordToDraft = useChordStore((state) => state.addChordToDraft);
  const updateDraftStepBeats = useChordStore((state) => state.updateDraftStepBeats);
  const moveDraftStep = useChordStore((state) => state.moveDraftStep);
  const removeDraftStep = useChordStore((state) => state.removeDraftStep);
  const setDraftTempo = useChordStore((state) => state.setDraftTempo);
  const setDraftInstrument = useChordStore((state) => state.setDraftInstrument);
  const setDraftLoop = useChordStore((state) => state.setDraftLoop);
  const setDraftName = useChordStore((state) => state.setDraftName);
  const saveDraftProgression = useChordStore((state) => state.saveDraftProgression);
  const loadProgression = useChordStore((state) => state.loadProgression);
  const removeProgression = useChordStore((state) => state.removeProgression);
  const resetDraft = useChordStore((state) => state.resetDraft);

  const chordsById = Object.fromEntries(savedChords.map((chord) => [chord.id, chord]));
  const playbackEvents = buildProgressionPlayback(
    progressionDraft.steps,
    chordsById,
    progressionDraft.tempo
  );

  const playDraft = async () => {
    await chordEngine.playProgression(
      playbackEvents,
      progressionDraft.instrument,
      progressionDraft.tempo,
      progressionDraft.loop
    );
  };

  const playSavedProgression = async (progressionId: string) => {
    const progression = savedProgressions.find((item) => item.id === progressionId);
    if (!progression) {
      return;
    }

    const events = buildProgressionPlayback(progression.steps, chordsById, progression.tempo);
    await chordEngine.playProgression(events, progression.instrument, progression.tempo, progression.loop);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.08 }}
      className="panel-surface rounded-[2.3rem] p-6 shadow-diffusion"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-ember-500">
            Progression Builder
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight text-ink-950">
            Reuse your palette as a song sketch.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
            Save voicings into your chord library, drag them into the timeline, and audition the
            whole phrase with tempo and ensemble control.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="focus-ring interactive-press rounded-full border border-stone-200 bg-white/70 px-4 py-2 text-sm text-stone-700"
            onClick={playDraft}
          >
            Play progression
          </button>
          <button
            type="button"
            className="focus-ring interactive-press rounded-full border border-stone-200 bg-white/60 px-4 py-2 text-sm text-stone-700"
            onClick={() => chordEngine.stopProgression()}
          >
            Stop
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-6">
          <div className="rounded-[1.8rem] border border-white/70 bg-white/70 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl tracking-tight text-stone-900">Saved chords</h3>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-stone-500">
                {savedChords.length} stored
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {savedChords.length > 0 ? (
                savedChords.map((chord) => (
                  <div
                    key={chord.id}
                    className="rounded-[1.4rem] border border-stone-200 bg-white p-4"
                    style={{
                      boxShadow: `inset 3px 0 0 ${chord.colorToken}`
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-xl tracking-tight text-stone-900">
                          {chord.detectedName}
                        </p>
                        <p className="mt-1 text-sm text-stone-600">{chord.intervals.join(" • ")}</p>
                      </div>
                      <button
                        type="button"
                        className="focus-ring interactive-press rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-sm text-stone-700"
                        onClick={() => addChordToDraft(chord.id)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-stone-300 px-4 py-6 text-sm text-stone-500">
                  Save a few chords from the lab and they’ll appear here ready for progression work.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/70 bg-white/70 p-5">
            <ChordPresets />
          </div>

          <div className="rounded-[1.8rem] border border-white/70 bg-white/70 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl tracking-tight text-stone-900">Progression library</h3>
              <button
                type="button"
                className="focus-ring interactive-press rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-stone-700"
                onClick={resetDraft}
              >
                New draft
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {savedProgressions.length > 0 ? (
                savedProgressions.map((progression) => (
                  <div key={progression.id} className="rounded-[1.4rem] border border-stone-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-xl tracking-tight text-stone-900">
                          {progression.name}
                        </p>
                        <p className="mt-1 text-sm text-stone-600">
                          {progression.steps.length} steps · {progression.tempo} BPM ·{" "}
                          {INSTRUMENT_LABELS[progression.instrument]}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="focus-ring interactive-press rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-sm text-stone-700"
                          onClick={() => loadProgression(progression.id)}
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          className="focus-ring interactive-press rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-sm text-stone-700"
                          onClick={() => playSavedProgression(progression.id)}
                        >
                          Play
                        </button>
                        <button
                          type="button"
                          className="focus-ring interactive-press rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-sm text-stone-700"
                          onClick={() => removeProgression(progression.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-stone-300 px-4 py-6 text-sm text-stone-500">
                  Save a draft progression to keep reusable chord ideas in your local library.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-white/70 bg-white/70 p-5">
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <label htmlFor="draft-name" className="mb-2 block text-sm font-medium text-stone-700">
                Progression name
              </label>
              <input
                id="draft-name"
                value={progressionDraft.name}
                onChange={(event) => setDraftName(event.target.value)}
                className="focus-ring w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700"
                placeholder="Name this idea"
              />
            </div>
            <div>
              <label htmlFor="tempo-input" className="mb-2 block text-sm font-medium text-stone-700">
                Tempo
              </label>
              <input
                id="tempo-input"
                aria-label="Tempo"
                type="number"
                min={40}
                max={180}
                value={progressionDraft.tempo}
                onChange={(event) => setDraftTempo(Number(event.target.value))}
                className="focus-ring w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Ensemble</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(INSTRUMENT_LABELS) as Array<keyof typeof INSTRUMENT_LABELS>).map(
                  (instrument) => (
                    <button
                      key={instrument}
                      type="button"
                      className={`focus-ring interactive-press rounded-[1.2rem] border px-4 py-3 text-left ${
                        progressionDraft.instrument === instrument
                          ? "border-ember-400 bg-ember-400 text-white"
                          : "border-stone-200 bg-white text-stone-700"
                      }`}
                      onClick={() => setDraftInstrument(instrument)}
                    >
                      <span className="block text-sm font-medium">
                        {INSTRUMENT_LABELS[instrument]}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={progressionDraft.loop}
                onChange={(event) => setDraftLoop(event.target.checked)}
              />
              Loop playback
            </label>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl tracking-tight text-stone-900">Arrangement lane</h3>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-stone-500">
                Drag cards to reorder
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {progressionDraft.steps.length > 0 ? (
                progressionDraft.steps.map((step, index) => {
                  const chord = chordsById[step.chordId];
                  if (!chord) {
                    return null;
                  }

                  const rootPitch = chord.selectedPitchClasses[0];
                  const accentColor = rootPitch
                    ? NOTE_COLOR_MAP[rootPitch]
                    : NOTE_COLOR_MAP.C;

                  return (
                    <div
                      key={step.id}
                      draggable
                      data-testid={`progression-step-${step.id}`}
                      onDragStart={() => setDraggedStepId(step.id)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        if (!draggedStepId || draggedStepId === step.id) {
                          return;
                        }

                        const fromIndex = progressionDraft.steps.findIndex(
                          (item) => item.id === draggedStepId
                        );
                        const toIndex = progressionDraft.steps.findIndex((item) => item.id === step.id);
                        if (fromIndex < 0 || toIndex < 0) {
                          return;
                        }
                        moveDraftStep(fromIndex, toIndex);
                        setDraggedStepId(null);
                      }}
                      onDragEnd={() => setDraggedStepId(null)}
                      className="rounded-[1.5rem] border border-stone-200 bg-white p-4"
                      style={{
                        boxShadow: `inset 4px 0 0 ${accentColor}`
                      }}
                    >
                      <div className="grid gap-4 md:grid-cols-[auto_1fr_auto_auto] md:items-center">
                        <span className="font-mono text-xs uppercase tracking-[0.24em] text-stone-400">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-display text-xl tracking-tight text-stone-900">
                            {chord.detectedName}
                          </p>
                          <p className="mt-1 text-sm text-stone-600">
                            {chord.intervals.join(" • ")}
                          </p>
                        </div>
                        <label className="text-sm text-stone-600">
                          Beats
                          <input
                            data-testid={`step-beats-${step.id}`}
                            type="number"
                            min={1}
                            max={8}
                            value={step.beats}
                            onChange={(event) =>
                              updateDraftStepBeats(step.id, Number(event.target.value))
                            }
                            className="focus-ring mt-2 block w-20 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700"
                          />
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="focus-ring interactive-press rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-sm text-stone-700"
                            onClick={() => removeDraftStep(step.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-stone-300 px-4 py-8 text-sm text-stone-500">
                  Add saved chords to begin a progression. Each step can have its own beat length.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="focus-ring interactive-press rounded-full border border-ember-500 bg-ember-500 px-4 py-2 text-sm text-white"
              onClick={() => saveDraftProgression()}
            >
              Save progression
            </button>
            <div className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600">
              {playbackEvents.length} playable events · {progressionDraft.tempo} BPM
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
