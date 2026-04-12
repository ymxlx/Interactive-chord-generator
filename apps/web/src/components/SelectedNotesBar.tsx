import { useChordStore } from "../store/useChordStore";
import { analyzeChord, buildChordDefinition } from "../utils/chordTheory";
import { audioEngine } from "../audio/engine";

export default function SelectedNotesBar() {
  const selectedPitchClasses = useChordStore((state) => state.selectedPitchClasses);
  const workingVoicing = useChordStore((state) => state.workingVoicing);
  const currentInstrument = useChordStore((state) => state.currentInstrument);
  const togglePitchClass = useChordStore((state) => state.togglePitchClass);
  const clearSelection = useChordStore((state) => state.clearSelection);
  const saveChord = useChordStore((state) => state.saveChord);
  const addChordToDraft = useChordStore((state) => state.addChordToDraft);
  const resolvedChord = analyzeChord(selectedPitchClasses, workingVoicing);

  const handlePlay = () => {
    audioEngine.setInstrument(currentInstrument);
    audioEngine.playChord(resolvedChord.voicing.midiNotes, "2n");
  };

  const handleAddSlot = () => {
    const chord = buildChordDefinition(selectedPitchClasses, workingVoicing);
    saveChord(chord);
    addChordToDraft(chord.id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-sand-100/50 border border-sand-200 gap-4">
      <div className="flex gap-2 flex-wrap min-h-[36px] items-center">
        {selectedPitchClasses.length === 0 ? (
          <span className="text-sm font-medium text-ink-950/40 px-2">Awaiting harmony...</span>
        ) : (
          selectedPitchClasses.map((pitchClass) => (
            <span 
              key={pitchClass} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-mono bg-white text-ink-950 shadow-sm border border-sand-200"
            >
              {pitchClass}
              <button 
                className="text-ink-950/40 hover:text-ember-500 transition-colors" 
                onClick={() => togglePitchClass(pitchClass)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </span>
          ))
        )}
      </div>
      
      <div className="flex gap-2 shrink-0">
        <button 
          className="interactive-press focus-ring px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest bg-ink-950 text-sand-50 shadow-md disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2" 
          onClick={handlePlay}
          disabled={selectedPitchClasses.length === 0}
        >
          Play
        </button>
        <button 
          className="interactive-press focus-ring px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest bg-ember-500 text-white shadow-md disabled:opacity-30 disabled:pointer-events-none" 
          onClick={handleAddSlot}
          disabled={selectedPitchClasses.length < 2}
        >
          + Slot
        </button>
        <button 
          className="interactive-press focus-ring px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest bg-sand-200 text-ink-950 disabled:opacity-30 disabled:pointer-events-none" 
          onClick={clearSelection}
          disabled={selectedPitchClasses.length === 0}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
