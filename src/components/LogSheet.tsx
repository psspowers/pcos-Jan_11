import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
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
    <div className="space-y-2">
      <label className="text-sm font-light text-white/70">{label}</label>
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => onChange(level.value)}
            className={`flex-1 px-3 py-2 rounded-full text-xs font-medium transition-all ${
              value >= level.value
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'
            }`}
          >
            {level.label}
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
    <div className="space-y-2">
      <label className="text-sm font-light text-white/70">{label}</label>
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => onChange(level.value)}
            className={`flex-1 px-3 py-2 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-1 ${
              value === level.value
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'
            }`}
          >
            <span>{level.emoji}</span>
            <span>{level.label}</span>
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
      toast.success('Log saved! Your plant is thriving.', {
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-slate-900 rounded-t-3xl border-t border-white/10 max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-light text-white/90">Log Today</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Cycle Status</h3>
                <div className="flex gap-2">
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
                      className={`flex-1 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                        log.cycleFlow === option.value
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50'
                          : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>{option.emoji}</div>
                      <div>{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Hyperandrogenism</h3>
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

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Metabolic</h3>
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
                <div className="space-y-2">
                  <label className="text-sm font-light text-white/70">Eating Pattern</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'balanced', label: 'Balanced' },
                      { value: 'binge', label: 'Overate' },
                      { value: 'restrict', label: 'Restricted' },
                      { value: 'not-tracked', label: 'Skip' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setLog({ ...log, metabolic: { ...log.metabolic, eatingPattern: option.value as any } })}
                        className={`flex-1 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                          log.metabolic.eatingPattern === option.value
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                            : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Psychological</h3>
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

            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl px-6 py-4 border-t border-white/10">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Log'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
