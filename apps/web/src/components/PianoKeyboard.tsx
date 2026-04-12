import { useChordStore } from "../store/useChordStore";
import { NOTE_COLOR_MAP } from "../constants/music";
import { isBlackKeyPitchClass, midiToLabel, midiToPitchClass } from "../utils/chordTheory";

const KEYBOARD_MIDI_NOTES = Array.from({ length: 24 }, (_, index) => 48 + index);

export default function PianoKeyboard() {
  const selectedPitchClasses = useChordStore((state) => state.selectedPitchClasses);
  const togglePitchClass = useChordStore((state) => state.togglePitchClass);

  return (
    <div className="grid grid-cols-12 gap-2 sm:grid-cols-24">
      {KEYBOARD_MIDI_NOTES.map((midiNote) => {
        const pitchClass = midiToPitchClass(midiNote);
        const selected = selectedPitchClasses.includes(pitchClass);
        const blackKey = isBlackKeyPitchClass(pitchClass);

        return (
          <button
            key={midiNote}
            type="button"
            data-testid={`keyboard-key-${midiToLabel(midiNote)}`}
            onClick={() => togglePitchClass(pitchClass)}
            className={`focus-ring interactive-press flex min-h-[6.5rem] flex-col justify-between rounded-[1.3rem] border px-2 py-3 text-left ${
              blackKey ? "translate-y-3" : ""
            }`}
            style={{
              background: selected
                ? `linear-gradient(180deg, ${NOTE_COLOR_MAP[pitchClass]}, ${NOTE_COLOR_MAP[pitchClass]}bb)`
                : blackKey
                  ? "linear-gradient(180deg, rgba(56, 43, 33, 0.96), rgba(29, 22, 17, 0.96))"
                  : "linear-gradient(180deg, rgba(255, 252, 247, 0.95), rgba(244, 238, 226, 0.95))",
              color: selected ? "#fffbf8" : blackKey ? "#f5ede0" : "#2e2318",
              borderColor: selected
                ? NOTE_COLOR_MAP[pitchClass]
                : blackKey
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(95, 71, 49, 0.12)"
            }}
            aria-pressed={selected}
          >
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] opacity-75">
              {midiToLabel(midiNote)}
            </span>
            <span className="font-display text-lg tracking-tight">{pitchClass}</span>
          </button>
        );
      })}
    </div>
  );
}
