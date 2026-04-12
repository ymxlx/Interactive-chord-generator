import { motion } from "framer-motion";
import { NOTE_COLOR_MAP, PITCH_CLASSES } from "../constants/music";
import { useChordStore } from "../store/useChordStore";

export const NotePad = () => {
  const selectedPitchClasses = useChordStore((state) => state.selectedPitchClasses);
  const togglePitchClass = useChordStore((state) => state.togglePitchClass);

  return (
    <div className="grid grid-cols-3 gap-3 lg:grid-cols-4">
      {PITCH_CLASSES.map((pitchClass, index) => {
        const active = selectedPitchClasses.includes(pitchClass);

        return (
          <motion.button
            key={pitchClass}
            type="button"
            data-testid={`note-pad-${pitchClass}`}
            onClick={() => togglePitchClass(pitchClass)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * index, duration: 0.22 }}
            className={`focus-ring interactive-press relative overflow-hidden rounded-[1.6rem] border px-4 py-5 text-left ${
              active ? "shadow-panel" : ""
            }`}
            style={{
              borderColor: active ? NOTE_COLOR_MAP[pitchClass] : "rgba(84, 59, 39, 0.12)",
              background: active
                ? `linear-gradient(145deg, ${NOTE_COLOR_MAP[pitchClass]}ee, ${NOTE_COLOR_MAP[pitchClass]}aa)`
                : "rgba(255, 252, 247, 0.9)",
              color: active ? "#fffaf6" : "#302219"
            }}
            aria-pressed={active}
          >
            <span className="font-display text-2xl tracking-tight">{pitchClass}</span>
            <span className="mt-2 block text-xs uppercase tracking-[0.22em] opacity-80">
              {active ? "Active tone" : "Tap to add"}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
