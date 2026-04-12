import { useChordStore } from "../store/useChordStore";
import { audioEngine } from "../audio/engine";

export default function ProgressionBuilder() {
  const progressionDraft = useChordStore((state) => state.progressionDraft);
  const savedChords = useChordStore((state) => state.savedChords);
  const removeDraftStep = useChordStore((state) => state.removeDraftStep);
  const resetDraft = useChordStore((state) => state.resetDraft);
  const setDraftTempo = useChordStore((state) => state.setDraftTempo);
  const currentInstrument = useChordStore((state) => state.currentInstrument);
  const chordsById = Object.fromEntries(savedChords.map((chord) => [chord.id, chord]));

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-8 border-b border-sand-200 pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Timeline</h2>
          <p className="text-ink-950/50 text-sm font-medium">Arrange your harmonic sequence</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <label className="text-[10px] font-bold uppercase tracking-widest text-ink-950/40 mb-1">Tempo: {progressionDraft.tempo} BPM</label>
            <input 
              type="range" 
              min="60" max="180" 
              value={progressionDraft.tempo} 
              onChange={(e) => setDraftTempo(parseInt(e.target.value, 10))} 
              className="w-28 accent-ember-500 cursor-pointer"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className="interactive-press focus-ring px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest bg-ink-950 text-sand-50 shadow-md disabled:opacity-30 flex items-center gap-2" 
              onClick={() => {
                const playableChords = progressionDraft.steps
                  .map((st) => chordsById[st.chordId])
                  .filter(Boolean)
                  .map((c) => c!.voicing.midiNotes);
                if (playableChords.length === 0) return;
                audioEngine.setInstrument(currentInstrument);
                audioEngine.playProgression(playableChords, progressionDraft.tempo, () => {});
              }}
              disabled={progressionDraft.steps.length === 0}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Play
            </button>
            <button 
              className="interactive-press focus-ring px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest bg-ember-500 text-white shadow-md flex items-center gap-2" 
              onClick={() => audioEngine.stopProgression()}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
              Stop
            </button>
            <button 
              className="interactive-press focus-ring w-9 h-9 flex justify-center items-center rounded-full bg-sand-200 text-ink-950/60 disabled:opacity-30"
              onClick={resetDraft}
              disabled={progressionDraft.steps.length === 0}
              title="Clear Timeline"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-sand-200 p-6 shadow-sm overflow-x-auto min-h-[160px]">
        <div className="flex gap-4 items-center min-w-max">
          {progressionDraft.steps.length === 0 && (
            <div className="w-full h-full flex items-center justify-center py-8">
              <span className="text-ink-950/30 font-medium border-2 border-dashed rounded-xl px-12 py-6">
                Timeline is empty. Build chords or load a preset.
              </span>
            </div>
          )}
          
          {progressionDraft.steps.map((slot) => {
            const chord = chordsById[slot.chordId];
            if (!chord) {
              return null;
            }

            return (
            <div 
              key={slot.id} 
              className="relative flex-shrink-0 w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-colors group bg-sand-50 border-sand-200 hover:border-sand-300"
            >
              <button 
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ink-950 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 interactive-press"
                onClick={() => removeDraftStep(slot.id)}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              
              <span className="font-display font-bold text-lg mb-1 leading-tight text-ink-950">
                {chord.detectedName}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-ink-950/40 text-center px-1 truncate w-full">
                {slot.beats} beats
              </span>
            </div>
          )})}
          
          {progressionDraft.steps.length > 0 && (
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-sand-300 flex items-center justify-center text-sand-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
