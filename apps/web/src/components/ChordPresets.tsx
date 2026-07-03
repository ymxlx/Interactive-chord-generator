import { useChordStore } from "../store/useChordStore";
import { buildChordDefinition, midiToPitchClass } from "../utils/chordTheory";
import { PRESET_PROGRESSIONS, buildChordMidi, getNoteName } from "../utils/chord-logic";

export default function ChordPresets() {
  const saveChord = useChordStore((state) => state.saveChord);
  const addChordToDraft = useChordStore((state) => state.addChordToDraft);
  const resetDraft = useChordStore((state) => state.resetDraft);

  const loadPreset = (preset: (typeof PRESET_PROGRESSIONS)[number]) => {
    resetDraft();

    preset.degrees.forEach((degree) => {
      const midiNotes = buildChordMidi(degree.root, degree.type, 4);
      const chord = buildChordDefinition(midiNotes.map(midiToPitchClass));
      saveChord(chord);
      addChordToDraft(chord.id);
    });
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-display text-lg font-bold text-ink-950">Foundation Presets</h3>
        <p className="text-sm text-ink-950/50">Start with an established progression arc.</p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {PRESET_PROGRESSIONS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => loadPreset(preset)}
            className="focus-ring interactive-press group relative overflow-hidden rounded-xl border border-sand-200 bg-sand-100 px-4 py-2.5 text-left shadow-sm transition-colors hover:bg-white"
          >
            <span className="block text-sm font-bold text-ink-950">{preset.label}</span>
            <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-ink-950/40">
              {preset.degrees.map((degree) => `${getNoteName(degree.root)}${degree.type}`).join(" → ")}
            </span>
            <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent transition-colors group-hover:border-ember-200" />
          </button>
        ))}
      </div>
    </div>
  );
}
