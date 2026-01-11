import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles } from 'lucide-react';
import { db, DailyLog, getDefaultLog, updatePlantState } from '@/lib/db';
import { toast } from 'sonner';

interface LogSheetProps {
  isOpen: boolean;
  onClose: () => void;
  existingLog?: DailyLog;
  date: string;
}

const IntensityPills: React.FC<{
  value: number;
  onChange: (value: number) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const levels = [
    { value: 0, label: 'None' },
    { value: 1, label: 'Mild' },
    { value: 2, label: 'Moderate' },
    { value: 3, label: 'Severe' }
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-light text-white/70">{label}</label>
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => onChange(level.value)}
            className={`group relative flex-1 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
              value >= level.value
                ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-400/50 shadow-lg shadow-emerald-500/20'
                : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            {value >= level.value && (
              <motion.div
                layoutId={`intensity-${label}`}
                className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative">{level.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const QualityPills: React.FC<{
  value: number;
  onChange: (value: number) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const levels = [
    { value: 0, label: 'Poor', emoji: '😴' },
    { value: 1, label: 'Fair', emoji: '😐' },
    { value: 2, label: 'Good', emoji: '😊' },
    { value: 3, label: 'Great', emoji: '✨' }
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-light text-white/70">{label}</label>
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => onChange(level.value)}
            className={`relative flex-1 px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              value === level.value
                ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/50 shadow-lg shadow-blue-500/20'
                : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            {value === level.value && (
              <motion.div
                layoutId={`quality-${label}`}
                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative text-base">{level.emoji}</span>
            <span className="relative">{level.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const LogSheet: React.FC<LogSheetProps> = ({ isOpen, onClose, existingLog, date }) => {
  const [log, setLog] = useState<DailyLog>(existingLog || getDefaultLog(date));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await db.dailyLogs.put(log);
      await updatePlantState();
      toast.success('Log saved! Your companion is thriving.', {
        duration: 2000,
      });
      onClose();
    } catch (error) {
      toast.error('Failed to save log. Please try again.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 400 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-2xl rounded-t-[2rem] border-t border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/40"
          >
            <div className="sticky top-0 bg-gradient-to-b from-slate-900/98 to-slate-950/95 backdrop-blur-2xl px-6 py-5 border-b border-white/10 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-xl font-light text-white/90 tracking-tight">Daily Log</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-pink-400" />
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-[0.2em]">Cycle Status</h3>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { value: 'none', label: 'None', emoji: '○' },
                    { value: 'spotting', label: 'Spotting', emoji: '•' },
                    { value: 'light', label: 'Light', emoji: '●' },
                    { value: 'moderate', label: 'Moderate', emoji: '●●' },
                    { value: 'heavy', label: 'Heavy', emoji: '●●●' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLog({ ...log, cycleFlow: option.value as any })}
                      className={`relative px-3 py-3 rounded-xl text-xs font-medium transition-all ${
                        log.cycleFlow === option.value
                          ? 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-400/50 shadow-lg shadow-pink-500/20'
                          : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-sm mb-1">{option.emoji}</div>
                      <div className="text-[10px]">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-[0.2em]">Hyperandrogenism</h3>
                </div>
                <IntensityPills
                  label="Acne"
                  value={log.hyperandrogenism.acne}
                  onChange={(v) => setLog({ ...log, hyperandrogenism: { ...log.hyperandrogenism, acne: v } })}
                />
                <IntensityPills
                  label="Facial/Body Hair"
                  value={log.hyperandrogenism.hirsutism}
                  onChange={(v) => setLog({ ...log, hyperandrogenism: { ...log.hyperandrogenism, hirsutism: v } })}
                />
                <IntensityPills
                  label="Hair Loss"
                  value={log.hyperandrogenism.hairLoss}
                  onChange={(v) => setLog({ ...log, hyperandrogenism: { ...log.hyperandrogenism, hairLoss: v } })}
                />
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-[0.2em]">Metabolic</h3>
                </div>
                <IntensityPills
                  label="Bloating"
                  value={log.metabolic.bloating}
                  onChange={(v) => setLog({ ...log, metabolic: { ...log.metabolic, bloating: v } })}
                />
                <IntensityPills
                  label="Cravings"
                  value={log.metabolic.cravings}
                  onChange={(v) => setLog({ ...log, metabolic: { ...log.metabolic, cravings: v } })}
                />
                <div className="space-y-3">
                  <label className="text-sm font-light text-white/70">Eating Pattern</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'balanced', label: 'Balanced', emoji: '🥗' },
                      { value: 'binge', label: 'Overate', emoji: '🍕' },
                      { value: 'restrict', label: 'Restricted', emoji: '🚫' },
                      { value: 'not-tracked', label: 'Skip', emoji: '⏭️' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setLog({ ...log, metabolic: { ...log.metabolic, eatingPattern: option.value as any } })}
                        className={`relative px-3 py-3 rounded-xl text-xs font-medium transition-all ${
                          log.metabolic.eatingPattern === option.value
                            ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/50 shadow-lg shadow-amber-500/20'
                            : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-base mb-1">{option.emoji}</div>
                        <div className="text-[10px]">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-[0.2em]">Psychological</h3>
                </div>
                <IntensityPills
                  label="Anxiety"
                  value={log.psychological.anxiety}
                  onChange={(v) => setLog({ ...log, psychological: { ...log.psychological, anxiety: v } })}
                />
                <IntensityPills
                  label="Low Mood"
                  value={log.psychological.depression}
                  onChange={(v) => setLog({ ...log, psychological: { ...log.psychological, depression: v } })}
                />
                <IntensityPills
                  label="Stress"
                  value={log.psychological.stress}
                  onChange={(v) => setLog({ ...log, psychological: { ...log.psychological, stress: v } })}
                />
                <QualityPills
                  label="Sleep Quality"
                  value={log.psychological.sleepQuality}
                  onChange={(v) => setLog({ ...log, psychological: { ...log.psychological, sleepQuality: v } })}
                />
                <QualityPills
                  label="Body Image"
                  value={log.psychological.bodyImage}
                  onChange={(v) => setLog({ ...log, psychological: { ...log.psychological, bodyImage: v } })}
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gradient-to-t from-slate-950/98 to-slate-900/95 backdrop-blur-2xl px-6 py-5 border-t border-white/10">
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur-xl opacity-50"
                  animate={{
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="relative w-full py-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 text-white font-medium text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-emerald-500/30 border border-white/20"
                >
                  {saving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Save Log
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
