import { motion } from "framer-motion";
import { PITCH_CLASSES } from "../constants/music";
import { useChordStore } from "../store/useChordStore";
import { analyzeChord } from "../utils/chordTheory";

export default function ChromaticCircle() {
  const selectedPitchClasses = useChordStore((state) => state.selectedPitchClasses);
  const togglePitchClass = useChordStore((state) => state.togglePitchClass);
  const workingVoicing = useChordStore((state) => state.workingVoicing);
  const chordInfo = analyzeChord(selectedPitchClasses, workingVoicing);
  
  return (
    <div className="flex justify-center my-6 relative">
      <div className="relative w-[340px] h-[340px]">
        {/* Magic aura */}
        {selectedPitchClasses.length > 0 && (
          <div className="absolute inset-0 bg-gradient-to-tr from-ember-300/10 to-transparent rounded-full blur-3xl animate-drift pointer-events-none"></div>
        )}
        
        {/* Inner ring */}
        <div className="absolute inset-8 rounded-full border border-sand-300/30"></div>
        <div className="absolute inset-10 rounded-full border border-sand-200/20 shadow-inner"></div>

        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {selectedPitchClasses.map((pc1, i) => {
            return selectedPitchClasses.slice(i + 1).map((pc2) => {
              const ang1 = (PITCH_CLASSES.indexOf(pc1) * 30 - 90) * (Math.PI / 180);
              const ang2 = (PITCH_CLASSES.indexOf(pc2) * 30 - 90) * (Math.PI / 180);
              const r = 145; // radius for connection
              const cx = 170, cy = 170;
              const x1 = cx + r * Math.cos(ang1);
              const y1 = cy + r * Math.sin(ang1);
              const x2 = cx + r * Math.cos(ang2);
              const y2 = cy + r * Math.sin(ang2);
              return (
                <motion.line 
                  key={`${pc1}-${pc2}`} 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke="#d96d2d" strokeWidth="1.5" strokeDasharray="4 2"
                />
              );
            });
          })}
        </svg>

        {/* Note Buttons */}
        {PITCH_CLASSES.map((pitchClass, index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180);
          const r = 145;
          const px = 170 + r * Math.cos(angle);
          const py = 170 + r * Math.sin(angle);
          const isSelected = selectedPitchClasses.includes(pitchClass);
          const isRoot = chordInfo.root === pitchClass;
          
          return (
            <motion.button
              key={pitchClass}
              className={`absolute flex items-center justify-center font-display font-bold w-[48px] h-[48px] rounded-full border-2 transition-all duration-300 z-20 shadow-sm
                ${isSelected 
                  ? 'bg-gradient-to-br from-sand-50 to-sand-200 text-ink-950 border-ember-400' 
                  : 'bg-sand-50/80 border-sand-200 text-ink-950/60 hover:border-ember-300 hover:text-ink-950'
                }
                ${isRoot ? 'ring-4 ring-ember-400/30' : ''}
              `}
              style={{
                left: `calc(${px}px - 24px)`,
                top: `calc(${py}px - 24px)`
              }}
              onClick={() => togglePitchClass(pitchClass)}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
            >
              {pitchClass}
            </motion.button>
          );
        })}

        {/* Central Display */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10 w-48">
          {selectedPitchClasses.length > 0 ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <span className="block font-display text-4xl font-bold tracking-tight text-ink-950 leading-none mb-1 text-shadow-sm">{chordInfo.detectedName}</span>
              <span className="block font-mono text-xs uppercase tracking-widest text-ember-500 font-bold">{chordInfo.qualityLabel}</span>
            </motion.div>
          ) : (
            <div className="opacity-40">
              <span className="block font-display text-3xl font-bold tracking-tight mb-1">...</span>
              <span className="block font-body text-xs font-medium uppercase tracking-widest">Select Notes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
