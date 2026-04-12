import { motion } from "framer-motion";
import { ChordDetailPanel } from "./components/ChordDetailPanel";
import { ChordLabPanel } from "./components/ChordLabPanel";
import { ProgressionPanel } from "./components/ProgressionPanel";
import { useChordStore } from "./store/useChordStore";

export default function App() {
  const savedChords = useChordStore((state) => state.savedChords);
  const savedProgressions = useChordStore((state) => state.savedProgressions);
  const selectedPitchClasses = useChordStore((state) => state.selectedPitchClasses);

  return (
    <main className="grain-overlay min-h-[100dvh] px-4 py-6 text-ink-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-6">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="panel-surface overflow-hidden rounded-[2.8rem] px-6 py-8 shadow-diffusion lg:px-8"
        >
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.36em] text-ember-500">
                Chromatic Canvas
              </p>
              <h1 className="mt-4 max-w-4xl font-display text-5xl tracking-[-0.05em] text-ink-950 md:text-7xl">
                A colorful chord generator that behaves like an instrument, not a form.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 md:text-lg">
                Shape harmonies from note combinations, audition them through curated ensembles,
                and build loopable progressions from the chords you discover.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Current notes",
                  value: `${selectedPitchClasses.length}`,
                  detail: "Active tones in the workbench"
                },
                {
                  label: "Saved chords",
                  value: `${savedChords.length}`,
                  detail: "Reusable voicings in your local library"
                },
                {
                  label: "Progressions",
                  value: `${savedProgressions.length}`,
                  detail: "Playable sketches stored in-browser"
                }
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.8rem] border border-white/70 bg-white/60 p-4 shadow-panel"
                >
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-stone-500">
                    {item.label}
                  </p>
                  <p className="mt-3 font-display text-4xl tracking-tight text-ink-950">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.header>

        <ChordLabPanel />

        <div className="grid gap-6 2xl:grid-cols-[0.82fr_1.18fr]">
          <ChordDetailPanel />
          <ProgressionPanel />
        </div>
      </div>
    </main>
  );
}
