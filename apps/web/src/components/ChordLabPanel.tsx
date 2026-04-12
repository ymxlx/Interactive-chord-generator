import { motion } from "framer-motion";
import { chordEngine } from "../audio/chordEngine";
import { useChordStore } from "../store/useChordStore";
import { analyzeChord } from "../utils/chordTheory";
import ChromaticCircle from "./ChromaticCircle";
import { NotePad } from "./NotePad";
import PianoKeyboard from "./PianoKeyboard";

export const ChordLabPanel = () => {
  const selectedPitchClasses = useChordStore((state) => state.selectedPitchClasses);
  const workingVoicing = useChordStore((state) => state.workingVoicing);
  const currentInstrument = useChordStore((state) => state.currentInstrument);
  const clearSelection = useChordStore((state) => state.clearSelection);
  const resolvedChord = analyzeChord(selectedPitchClasses, workingVoicing);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="panel-surface rounded-[2.3rem] p-6 shadow-diffusion"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-ember-500">
            Chord Lab
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight text-ink-950">
            Build with color, hear with intent.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
            Select notes from the chromatic pad or the keyboard. Both surfaces shape the same chord,
            so you can move fluidly between theory and touch.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="focus-ring interactive-press rounded-full border border-stone-300 bg-white/70 px-4 py-2 text-sm font-medium text-stone-700"
            onClick={() => chordEngine.playChord(resolvedChord.voicing.midiNotes, currentInstrument)}
          >
            Preview chord
          </button>
          <button
            type="button"
            className="focus-ring interactive-press rounded-full border border-stone-300 bg-white/60 px-4 py-2 text-sm text-stone-600"
            onClick={clearSelection}
          >
            Clear notes
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_1.1fr]">
        <div className="grid gap-6">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl tracking-tight text-stone-900">Chromatic pad</h3>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-stone-500">
                {selectedPitchClasses.length} tones selected
              </span>
            </div>
            <NotePad />
          </div>

          <div className="rounded-[1.8rem] border border-white/70 bg-white/50 p-4">
            <ChromaticCircle />
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl tracking-tight text-stone-900">Two-octave keyboard</h3>
            <span className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs text-stone-600">
              Mirrors the pad selection live
            </span>
          </div>
          <PianoKeyboard />
        </div>
      </div>
    </motion.section>
  );
};
