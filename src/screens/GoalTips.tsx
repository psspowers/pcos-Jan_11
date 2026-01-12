import React from 'react';
import { getProfile } from '@/lib/storage';
import { Lightbulb } from 'lucide-react';

const tipsByGoal: Record<string, string[]> = {
  cycle: [
    'Track your cycle consistently to identify patterns over 3-6 months',
    'Note any spotting or irregular bleeding - this data helps your doctor',
    'Stress and sleep significantly impact cycle regularity',
    'Consider tracking basal body temperature for more detailed insights',
  ],
  fertility: [
    'Track cervical mucus changes alongside your cycle',
    'Ovulation can be irregular with PCOS - patience is key',
    'Maintaining a healthy weight can improve ovulation',
    'Discuss fertility options with a reproductive endocrinologist',
  ],
  metabolic: [
    'Focus on low-glycemic foods to manage insulin levels',
    'Strength training can improve insulin sensitivity',
    'Even 5-10% weight loss can significantly improve symptoms',
    'Monitor your energy levels after meals for blood sugar clues',
  ],
  mood: [
    'Regular exercise is proven to improve mood with PCOS',
    'Sleep quality directly impacts emotional regulation',
    'Consider tracking mood patterns with your cycle',
    'Don\'t hesitate to seek mental health support - it\'s important',
  ],
};

export const GoalTips: React.FC = () => {
  const profile = getProfile();
  if (!profile) return null;

  const tips = tipsByGoal[profile.primaryGoal] || tipsByGoal.cycle;
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="bg-gradient-to-r from-sage-100 to-peach-100 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-sage-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-sage-800 mb-1">Daily Tip</p>
          <p className="text-sm text-sage-600">{randomTip}</p>
        </div>
      </div>
    </div>
  );
};
