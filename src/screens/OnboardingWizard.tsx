import React, { useState } from 'react';
import { UserProfile, saveProfile } from '@/lib/storage';
import { Shield, Heart, Moon, Sparkles, ChevronRight, ChevronLeft, Baby, Activity, Leaf } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface Props { onComplete: () => void; }

const goals = [
  { id: 'cycle', icon: Moon, label: 'Cycle Regularity', desc: 'Track and understand your menstrual patterns', color: 'from-purple-400 to-purple-600' },
  { id: 'fertility', icon: Baby, label: 'Fertility Support', desc: 'Monitor symptoms related to conception', color: 'from-pink-400 to-pink-600' },
  { id: 'metabolic', icon: Activity, label: 'Metabolic Health', desc: 'Focus on weight, energy, and blood sugar', color: 'from-green-400 to-green-600' },
  { id: 'mood', icon: Heart, label: 'Mood & Wellness', desc: 'Track emotional patterns and stress', color: 'from-orange-400 to-orange-600' },
];

const suggestedPlantNames = [
  'Bloom', 'Sage', 'Luna', 'Iris', 'Willow', 'Ivy', 'Hazel', 'Clover', 'Fern', 'Rose'
];

export const OnboardingWizard: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({ primaryGoal: 'cycle', reminderEnabled: true });
  const [plantName, setPlantName] = useState('');
  const { setPlantName: setContextPlantName } = useAppContext();

  const handleComplete = () => {
    saveProfile({ ...profile, onboardingComplete: true } as UserProfile);
    if (plantName.trim()) {
      setContextPlantName(plantName.trim());
    }
    onComplete();
  };

  const steps = [
    <div key="welcome" className="text-center space-y-6">
      <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden bg-cream-100 p-6">
        <img src="/logo-icon.png" alt="Blossom Logo" className="w-full h-full object-contain" />
      </div>
      <h1 className="text-3xl font-bold text-sage-800">Welcome to<br/>Blossom</h1>
      <p className="text-sage-500 font-medium">Your PCOS Buddy</p>
      <p className="text-sage-600 max-w-md mx-auto">Your private, supportive space to understand your body, discover patterns, and learn what works for you.</p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-left">
        <div className="flex items-start gap-2">
          <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Important Disclaimer</strong>
            <p className="mt-1">This app is not medical advice or a diagnostic tool. Always consult your healthcare provider for medical concerns.</p>
          </div>
        </div>
      </div>
    </div>,
    <div key="profile" className="space-y-6">
      <h2 className="text-2xl font-bold text-sage-800 text-center">Tell us about yourself</h2>
      <p className="text-sage-500 text-center text-sm">Share what you're comfortable with - everything is optional and stays private on your device.</p>
      <div className="grid gap-4">
        <div><label className="block text-sm font-medium text-sage-700 mb-1">Age</label>
          <input type="number" placeholder="e.g. 28" value={profile.age || ''} className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:ring-2 focus:ring-sage-400 focus:outline-none" onChange={e => setProfile({...profile, age: +e.target.value || undefined})} /></div>
        <div><label className="block text-sm font-medium text-sage-700 mb-1">Year of PCOS Diagnosis</label>
          <input type="number" placeholder="e.g. 2020" value={profile.diagnosisYear || ''} className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:ring-2 focus:ring-sage-400 focus:outline-none" onChange={e => setProfile({...profile, diagnosisYear: +e.target.value || undefined})} /></div>
      </div>
    </div>,
    <div key="plant" className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-sage-400 to-peach-400 flex items-center justify-center shadow-lg">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-sage-800">Meet Your Growth Companion</h2>
        <p className="text-sage-500 text-sm max-w-md mx-auto">As you track your journey, a plant will grow alongside you. Each day you log is a day of growth.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-2">Name your companion</label>
          <input
            type="text"
            placeholder="e.g. Bloom, Sage, Luna..."
            value={plantName}
            onChange={e => setPlantName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:ring-2 focus:ring-sage-400 focus:outline-none"
            maxLength={20}
          />
        </div>
        <div>
          <p className="text-xs text-sage-500 mb-2">Or choose a suggestion:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPlantNames.map(name => (
              <button
                key={name}
                onClick={() => setPlantName(name)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                  plantName === name
                    ? 'bg-sage-100 border-sage-400 text-sage-800 font-medium'
                    : 'border-sage-200 text-sage-600 hover:border-sage-300 hover:bg-sage-50'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    <div key="goal" className="space-y-6">
      <h2 className="text-2xl font-bold text-sage-800 text-center">What matters most to you right now?</h2>
      <p className="text-sage-500 text-center text-sm">We'll personalize your experience based on what you choose</p>
      <div className="grid gap-3">
        {goals.map(g => (
          <button key={g.id} onClick={() => setProfile({...profile, primaryGoal: g.id as any})}
            className={`p-4 rounded-xl border-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2 ${profile.primaryGoal === g.id ? 'border-sage-500 bg-sage-50 shadow-md' : 'border-sage-200 hover:border-sage-300'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${g.color} flex items-center justify-center`}>
                <g.icon className="w-5 h-5 text-white" />
              </div>
              <div><div className="font-semibold text-sage-800">{g.label}</div><div className="text-sm text-sage-500">{g.desc}</div></div>
            </div>
          </button>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-peach-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <div className="flex gap-2 mb-8 justify-center">
          {steps.map((_, i) => <div key={i} className={`h-2 w-12 rounded-full transition-all ${i <= step ? 'bg-sage-500' : 'bg-sage-200'}`} />)}
        </div>
        {steps[step]}
        <div className="flex justify-between mt-8">
          {step > 0 ? <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sage-600 hover:text-sage-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2 rounded-lg"><ChevronLeft className="w-5 h-5" />Back</button> : <div />}
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="flex items-center gap-1 bg-sage-600 text-white px-6 py-2 rounded-xl hover:bg-sage-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2">Next<ChevronRight className="w-5 h-5" /></button>
          ) : (
            <button onClick={handleComplete} className="bg-sage-600 text-white px-6 py-2 rounded-xl hover:bg-sage-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2">Get Started</button>
          )}
        </div>
        {step === 0 && <button onClick={handleComplete} className="w-full mt-4 text-sage-500 hover:text-sage-700 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2 rounded-lg">Skip & Start as Guest</button>}
      </div>
    </div>
  );
};
