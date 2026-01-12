import React from 'react';
import { DailyLog } from '@/lib/storage';
import { ToggleGroup, SliderInput } from './SymptomSlider';
import { Moon, Activity, Coffee, Droplets, Brain, Check } from 'lucide-react';

interface Props {
  log: DailyLog;
  onUpdate: (key: keyof DailyLog['lifestyle'], val: any) => void;
}

export const LifestyleSection: React.FC<Props> = ({ log, onUpdate }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sage-700">Lifestyle</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <SliderInput 
          label="Sleep Hours" 
          icon={<Moon className="w-5 h-5" />}
          value={log.lifestyle.sleepHours}
          min={0}
          max={12}
          unit="hrs"
          onChange={v => onUpdate('sleepHours', v)}
        />
        
        <ToggleGroup 
          label="Physical Activity" 
          icon={<Activity className="w-5 h-5" />}
          options={[
            { value: 'none', label: 'None' },
            { value: 'light', label: 'Light' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'intense', label: 'Intense' }
          ]}
          selected={log.lifestyle.activity}
          onChange={v => onUpdate('activity', v)}
        />
        
        <ToggleGroup 
          label="Sugar Intake" 
          icon={<Coffee className="w-5 h-5" />}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' }
          ]}
          selected={log.lifestyle.sugarIntake}
          onChange={v => onUpdate('sugarIntake', v)}
        />
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-sage-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sage-500" />
              <span className="font-medium text-sage-800">Hydration Goal</span>
            </div>
            <button
              onClick={() => onUpdate('hydrationMet', !log.lifestyle.hydrationMet)}
              className={`w-12 h-7 rounded-full transition-all ${
                log.lifestyle.hydrationMet ? 'bg-sage-600' : 'bg-sage-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                log.lifestyle.hydrationMet ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          {log.lifestyle.hydrationMet && (
            <div className="mt-2 flex items-center gap-1 text-sage-600 text-sm">
              <Check className="w-4 h-4" /> Goal met!
            </div>
          )}
        </div>
        
        <SliderInput 
          label="Stress Level" 
          icon={<Brain className="w-5 h-5" />}
          value={log.lifestyle.stressLevel}
          min={1}
          max={5}
          unit="/5"
          onChange={v => onUpdate('stressLevel', v)}
        />
      </div>
    </div>
  );
};
