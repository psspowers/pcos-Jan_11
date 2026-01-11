import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { db, LogEntry } from '../lib/db';
import { format } from 'date-fns';

interface DailyLogProps {
  onClose: () => void;
}

type CyclePhase = 'follicular' | 'ovulatory' | 'luteal' | 'menstrual' | 'unknown';

export function DailyLog({ onClose }: DailyLogProps) {
  const [cyclePhase, setCyclePhase] = useState<CyclePhase>('unknown');
  const [symptoms, setSymptoms] = useState({
    acne: 0,
    hirsutism: 0,
    hairLoss: 0,
    bloat: 0,
    cramps: 0
  });
  const [psych, setPsych] = useState({
    stress: 0,
    bodyImage: 5,
    mood: 5,
    anxiety: 0
  });
  const [lifestyle, setLifestyle] = useState({
    sleepHours: 7,
    waterIntake: 8,
    exerciseIntensity: 5,
    dietQuality: 5
  });

  const handleSave = async () => {
    const entry: LogEntry = {
      date: format(new Date(), 'yyyy-MM-dd'),
      cyclePhase,
      symptoms,
      psych,
      lifestyle
    };

    await db.logs.add(entry);
    onClose();
    window.location.reload();
  };

  const PillSelector = ({
    label,
    value,
    onChange,
    max = 10
  }: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    max?: number;
  }) => (
    <div className="mb-6">
      <label className="block text-sm text-slate-300 mb-3">{label}</label>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: max + 1 }, (_, i) => i).map(val => (
          <button
            key={val}
            onClick={() => onChange(val)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              value === val
                ? 'bg-teal-400 text-slate-950 shadow-lg'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-full max-h-[85vh] bg-slate-900/95 backdrop-blur-xl rounded-t-3xl border-t border-white/10 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Daily Check-in</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 pb-32" style={{ maxHeight: 'calc(85vh - 80px)' }}>
            <section className="mb-8">
              <h3 className="text-sm font-medium text-teal-400 uppercase tracking-wide mb-4">
                Cycle Phase
              </h3>
              <div className="flex flex-wrap gap-2">
                {(['menstrual', 'follicular', 'ovulatory', 'luteal', 'unknown'] as CyclePhase[]).map(phase => (
                  <button
                    key={phase}
                    onClick={() => setCyclePhase(phase)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium capitalize transition-all ${
                      cyclePhase === phase
                        ? 'bg-teal-400 text-slate-950 shadow-lg'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {phase}
                  </button>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-sm font-medium text-rose-400 uppercase tracking-wide mb-4">
                Hyperandrogenism Symptoms
              </h3>
              <PillSelector
                label="Acne Severity"
                value={symptoms.acne}
                onChange={val => setSymptoms({ ...symptoms, acne: val })}
              />
              <PillSelector
                label="Hirsutism (Excess Hair)"
                value={symptoms.hirsutism}
                onChange={val => setSymptoms({ ...symptoms, hirsutism: val })}
              />
              <PillSelector
                label="Hair Loss"
                value={symptoms.hairLoss}
                onChange={val => setSymptoms({ ...symptoms, hairLoss: val })}
              />
              <PillSelector
                label="Bloating"
                value={symptoms.bloat}
                onChange={val => setSymptoms({ ...symptoms, bloat: val })}
              />
              <PillSelector
                label="Cramps"
                value={symptoms.cramps}
                onChange={val => setSymptoms({ ...symptoms, cramps: val })}
              />
            </section>

            <section className="mb-8">
              <h3 className="text-sm font-medium text-violet-400 uppercase tracking-wide mb-4">
                Psychological Wellness
              </h3>
              <PillSelector
                label="Stress Level"
                value={psych.stress}
                onChange={val => setPsych({ ...psych, stress: val })}
              />
              <PillSelector
                label="Body Image"
                value={psych.bodyImage}
                onChange={val => setPsych({ ...psych, bodyImage: val })}
              />
              <PillSelector
                label="Mood"
                value={psych.mood}
                onChange={val => setPsych({ ...psych, mood: val })}
              />
              <PillSelector
                label="Anxiety Level"
                value={psych.anxiety}
                onChange={val => setPsych({ ...psych, anxiety: val })}
              />
            </section>

            <section className="mb-8">
              <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wide mb-4">
                Lifestyle
              </h3>
              <PillSelector
                label="Sleep (hours)"
                value={lifestyle.sleepHours}
                onChange={val => setLifestyle({ ...lifestyle, sleepHours: val })}
                max={12}
              />
              <PillSelector
                label="Water Intake (glasses)"
                value={lifestyle.waterIntake}
                onChange={val => setLifestyle({ ...lifestyle, waterIntake: val })}
                max={15}
              />
              <PillSelector
                label="Exercise Intensity"
                value={lifestyle.exerciseIntensity}
                onChange={val => setLifestyle({ ...lifestyle, exerciseIntensity: val })}
              />
              <PillSelector
                label="Diet Quality"
                value={lifestyle.dietQuality}
                onChange={val => setLifestyle({ ...lifestyle, dietQuality: val })}
              />
            </section>
          </div>

          <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-6">
            <button
              onClick={handleSave}
              className="w-full py-4 bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold rounded-2xl transition-all shadow-lg hover:shadow-xl"
            >
              Save Today's Log
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
