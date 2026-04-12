import { motion } from "framer-motion";
import { chordEngine } from "../audio/chordEngine";
import { INSTRUMENT_LABELS, PITCH_CLASSES } from "../constants/music";
import { useChordStore } from "../store/useChordStore";
import { analyzeChord, buildChordDefinition } from "../utils/chordTheory";

export const ChordDetailPanel = () => {
  const selectedPitchClasses = useChordStore((state) => state.selectedPitchClasses);
  const workingVoicing = useChordStore((state) => state.workingVoicing);
  const currentInstrument = useChordStore((state) => state.currentInstrument);
  const setInversion = useChordStore((state) => state.setInversion);
  const setSpread = useChordStore((state) => state.setSpread);
  const setRegisterShift = useChordStore((state) => state.setRegisterShift);
  const setBassPitchClass = useChordStore((state) => state.setBassPitchClass);
  const setCurrentInstrument = useChordStore((state) => state.setCurrentInstrument);
  const saveChord = useChordStore((state) => state.saveChord);
  const resolvedChord = analyzeChord(selectedPitchClasses, workingVoicing);

  const canSave = selectedPitchClasses.length >= 2;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="panel-surface rounded-[2.3rem] p-6 shadow-diffusion"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-ember-500">
            Chord Detail
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight text-ink-950">
            {resolvedChord.detectedName}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">
            {resolvedChord.qualityLabel}. The voicing view below updates the playable notes,
            inversion, register, and bass anchor in real time.
          </p>
        </div>

        <div
          className="rounded-[1.6rem] border border-white/70 px-4 py-3"
          style={{ backgroundColor: `${resolvedChord.colorToken}20` }}
        >
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.26em] text-stone-500">
            Live instrument
          </p>
          <p className="mt-1 font-display text-xl tracking-tight text-stone-900">
            {INSTRUMENT_LABELS[currentInstrument]}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        <div className="rounded-[1.8rem] border border-white/70 bg-white/70 p-5">
          <div className="flex flex-wrap gap-2">
            {resolvedChord.intervals.length > 0 ? (
              resolvedChord.intervals.map((interval) => (
                <span
                  key={interval}
                  className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-sm text-stone-700"
                >
                  {interval}
                </span>
              ))
            ) : (
              <span className="text-sm text-stone-500">
                Select at least two notes to reveal a chord quality.
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.26em] text-stone-500">
              Resolved voicing
            </p>
            <div className="mt-2 flex flex-wrap gap-2" data-testid="resolved-midi-notes">
              {resolvedChord.midiLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-stone-700"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[1.8rem] border border-white/70 bg-white/70 p-5">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.26em] text-stone-500">
              Voicing controls
            </p>
            <div className="mt-4 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Inversion</label>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3].map((inversion) => (
                    <button
                      key={inversion}
                      type="button"
                      className={`focus-ring interactive-press rounded-full border px-3 py-2 text-sm ${
                        workingVoicing.inversion === inversion
                          ? "border-ember-400 bg-ember-400 text-white"
                          : "border-stone-200 bg-white text-stone-700"
                      }`}
                      onClick={() => setInversion(inversion as 0 | 1 | 2 | 3)}
                    >
                      Inv {inversion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Spread</label>
                <div className="flex gap-2">
                  {(["close", "open"] as const).map((spread) => (
                    <button
                      key={spread}
                      type="button"
                      className={`focus-ring interactive-press rounded-full border px-3 py-2 text-sm capitalize ${
                        workingVoicing.spread === spread
                          ? "border-ember-400 bg-ember-400 text-white"
                          : "border-stone-200 bg-white text-stone-700"
                      }`}
                      onClick={() => setSpread(spread)}
                    >
                      {spread}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Register</label>
                <div className="flex gap-2">
                  {[
                    { value: -1, label: "Low" },
                    { value: 0, label: "Center" },
                    { value: 1, label: "High" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`focus-ring interactive-press rounded-full border px-3 py-2 text-sm ${
                        workingVoicing.registerShift === option.value
                          ? "border-ember-400 bg-ember-400 text-white"
                          : "border-stone-200 bg-white text-stone-700"
                      }`}
                      onClick={() => setRegisterShift(option.value as -1 | 0 | 1)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="bass-note" className="mb-2 block text-sm font-medium text-stone-700">
                  Bass note
                </label>
                <select
                  id="bass-note"
                  className="focus-ring w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700"
                  value={workingVoicing.bassPitchClass}
                  onChange={(event) =>
                    setBassPitchClass(event.target.value as typeof workingVoicing.bassPitchClass)
                  }
                >
                  <option value="auto">Auto</option>
                  {PITCH_CLASSES.map((pitchClass) => (
                    <option key={pitchClass} value={pitchClass}>
                      {pitchClass}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/70 bg-white/70 p-5">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.26em] text-stone-500">
              Instrument palette
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {(Object.keys(INSTRUMENT_LABELS) as Array<keyof typeof INSTRUMENT_LABELS>).map(
                (instrument) => (
                  <button
                    key={instrument}
                    type="button"
                    aria-pressed={currentInstrument === instrument}
                    className={`focus-ring interactive-press rounded-[1.4rem] border px-4 py-4 text-left ${
                      currentInstrument === instrument
                        ? "border-ember-400 bg-ember-400 text-white"
                        : "border-stone-200 bg-white text-stone-700"
                    }`}
                    onClick={() => setCurrentInstrument(instrument)}
                  >
                    <span className="block font-display text-lg tracking-tight">
                      {INSTRUMENT_LABELS[instrument]}
                    </span>
                    <span className="mt-2 block text-xs uppercase tracking-[0.22em] opacity-80">
                      {instrument}
                    </span>
                  </button>
                )
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="focus-ring interactive-press rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700"
                onClick={() => chordEngine.playChord(resolvedChord.voicing.midiNotes, currentInstrument)}
              >
                Play with {INSTRUMENT_LABELS[currentInstrument]}
              </button>
              <button
                type="button"
                disabled={!canSave}
                className="focus-ring interactive-press rounded-full border border-ember-500 bg-ember-500 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:border-stone-300 disabled:bg-stone-300"
                onClick={() => saveChord(buildChordDefinition(selectedPitchClasses, workingVoicing))}
              >
                Save chord
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
