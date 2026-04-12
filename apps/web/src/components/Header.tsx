import { INSTRUMENT_LABELS } from "../constants/music";
import { useChordStore } from "../store/useChordStore";

export default function Header() {
  const currentInstrument = useChordStore((state) => state.currentInstrument);
  const setCurrentInstrument = useChordStore((state) => state.setCurrentInstrument);
  const selectedPitchClasses = useChordStore((state) => state.selectedPitchClasses);
  const savedChords = useChordStore((state) => state.savedChords);

  return (
    <header className="sticky top-0 w-full backdrop-blur-2xl bg-sand-50/60 border-b border-sand-200/50 py-4 px-8 flex flex-col sm:flex-row items-center justify-between gap-4 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-ember-400 to-sand-200 flex items-center justify-center p-[2px]">
          <div className="w-full h-full bg-sand-50 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-ember-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
        </div>
        <h1 className="font-display font-bold text-xl tracking-tight text-ink-950">
          Chord Architect
        </h1>
      </div>
      
      <div className="flex items-center gap-8">
        <label className="flex items-center gap-3 text-sm font-medium">
          <span className="text-ink-950/50 uppercase tracking-widest text-xs font-bold">Instrument</span>
          <select 
            value={currentInstrument} 
            onChange={(e) => setCurrentInstrument(e.target.value as keyof typeof INSTRUMENT_LABELS)}
            className="panel-surface border-none py-2 px-4 rounded-full font-mono text-xs text-ink-950 shadow-sm focus-ring cursor-pointer"
          >
            {Object.entries(INSTRUMENT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        
        <div className="flex items-center gap-4 rounded-full bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-widest text-ink-950/50">
          <span>{selectedPitchClasses.length} active tones</span>
          <span>{savedChords.length} saved chords</span>
        </div>
      </div>
    </header>
  );
}
