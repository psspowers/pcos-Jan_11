import React, { useState, useEffect } from 'react';
import { DailyLog, saveLog, getLogByDate } from '@/lib/storage';
import { X } from 'lucide-react';

interface VelocityLoggerProps {
  onClose: () => void;
}

const today = () => new Date().toISOString().split('T')[0];

const PillSelector: React.FC<{
  label: string;
  options: { value: number | string; label: string }[];
  value: number | string;
  onChange: (val: number | string) => void;
}> = ({ label, options, value, onChange }) => (
  <div className="space-y-2">
    <div className="text-xs text-white/50 uppercase tracking-wider">{label}</div>
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-full text-sm font-light tracking-tight transition-all ${
            value === opt.value
              ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
              : 'glass text-white/70 hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

export const VelocityLogger: React.FC<VelocityLoggerProps> = ({ onClose }) => {
  const [log, setLog] = useState<DailyLog>({
    date: today(),
    cycleStatus: 'none',
    symptoms: {
      cramps: 0,
      acne: 0,
      hairLoss: 0,
      facialHair: 0,
      bloating: 0,
      cravings: 0,
      moodSwings: 5,
      energy: 5,
      sleepQuality: 5,
    },
    lifestyle: {
      sleepHours: 7,
      activity: 'light',
      sugarIntake: 'medium',
      hydrationMet: false,
      stressLevel: 3,
    },
  });

  useEffect(() => {
    const existing = getLogByDate(today());
    if (existing) {
      setLog(existing);
    }
  }, []);

  const handleSave = () => {
    saveLog(log);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass rounded-t-3xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 glass border-b border-white/10 p-4 flex items-center justify-between">
          <h2 className="text-xl font-light tracking-tighter text-white">Log Entry</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <PillSelector
            label="Cycle Status"
            options={[
              { value: 'none', label: 'None' },
              { value: 'spotting', label: 'Spotting' },
              { value: 'period', label: 'Period' },
            ]}
            value={log.cycleStatus}
            onChange={(val) => setLog({ ...log, cycleStatus: val as 'none' | 'spotting' | 'period' })}
          />

          <PillSelector
            label="Energy"
            options={[
              { value: 2, label: 'Low' },
              { value: 5, label: 'Med' },
              { value: 8, label: 'High' },
            ]}
            value={log.symptoms.energy}
            onChange={(val) =>
              setLog({ ...log, symptoms: { ...log.symptoms, energy: val as number } })
            }
          />

          <PillSelector
            label="Mood"
            options={[
              { value: 8, label: 'Good' },
              { value: 5, label: 'Okay' },
              { value: 2, label: 'Low' },
            ]}
            value={10 - log.symptoms.moodSwings}
            onChange={(val) =>
              setLog({ ...log, symptoms: { ...log.symptoms, moodSwings: 10 - (val as number) } })
            }
          />

          <PillSelector
            label="Cramps"
            options={[
              { value: 0, label: 'None' },
              { value: 3, label: 'Mild' },
              { value: 7, label: 'Strong' },
            ]}
            value={log.symptoms.cramps}
            onChange={(val) =>
              setLog({ ...log, symptoms: { ...log.symptoms, cramps: val as number } })
            }
          />

          <PillSelector
            label="Bloating"
            options={[
              { value: 0, label: 'None' },
              { value: 4, label: 'Some' },
              { value: 8, label: 'High' },
            ]}
            value={log.symptoms.bloating}
            onChange={(val) =>
              setLog({ ...log, symptoms: { ...log.symptoms, bloating: val as number } })
            }
          />

          <PillSelector
            label="Sleep Hours"
            options={[
              { value: 5, label: '5h' },
              { value: 7, label: '7h' },
              { value: 9, label: '9h' },
            ]}
            value={log.lifestyle.sleepHours}
            onChange={(val) =>
              setLog({ ...log, lifestyle: { ...log.lifestyle, sleepHours: val as number } })
            }
          />

          <PillSelector
            label="Activity"
            options={[
              { value: 'none', label: 'Rest' },
              { value: 'light', label: 'Light' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'intense', label: 'Intense' },
            ]}
            value={log.lifestyle.activity}
            onChange={(val) =>
              setLog({
                ...log,
                lifestyle: { ...log.lifestyle, activity: val as 'none' | 'light' | 'moderate' | 'intense' },
              })
            }
          />

          <PillSelector
            label="Stress Level"
            options={[
              { value: 1, label: 'Low' },
              { value: 5, label: 'Med' },
              { value: 8, label: 'High' },
            ]}
            value={log.lifestyle.stressLevel}
            onChange={(val) =>
              setLog({ ...log, lifestyle: { ...log.lifestyle, stressLevel: val as number } })
            }
          />

          <button
            onClick={handleSave}
            className="w-full glass rounded-2xl p-4 neon-glow-cyan hover:bg-neon-cyan/10 transition-all text-white font-light tracking-tight"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
