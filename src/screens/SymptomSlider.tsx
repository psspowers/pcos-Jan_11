import React from 'react';

interface Props {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (val: number) => void;
}

const severityLabels = ['None', 'Mild', 'Moderate', 'Strong', 'Severe'];
const severityColors = ['bg-sage-200', 'bg-sage-300', 'bg-amber-300', 'bg-orange-400', 'bg-red-400'];

export const SymptomSlider: React.FC<Props> = ({ label, icon, value, onChange }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-sage-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sage-500">{icon}</span>
          <span className="font-medium text-sage-800">{label}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${severityColors[value - 1]} text-white`}>
          {severityLabels[value - 1]}
        </span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(v => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`flex-1 h-8 rounded-lg transition-all ${
              v <= value ? severityColors[v - 1] : 'bg-sage-100 hover:bg-sage-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

interface ToggleProps {
  label: string;
  icon: React.ReactNode;
  options: { value: string; label: string }[];
  selected: string;
  onChange: (val: string) => void;
}

export const ToggleGroup: React.FC<ToggleProps> = ({ label, icon, options, selected, onChange }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-sage-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sage-500">{icon}</span>
        <span className="font-medium text-sage-800">{label}</span>
      </div>
      <div className="flex gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              selected === opt.value
                ? 'bg-sage-600 text-white'
                : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

interface SliderInputProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (val: number) => void;
}

export const SliderInput: React.FC<SliderInputProps> = ({ label, icon, value, min, max, unit, onChange }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-sage-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sage-500">{icon}</span>
          <span className="font-medium text-sage-800">{label}</span>
        </div>
        <span className="text-sage-600 font-semibold">{value} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full h-2 bg-sage-200 rounded-lg appearance-none cursor-pointer accent-sage-600"
      />
    </div>
  );
};
