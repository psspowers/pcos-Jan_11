import React, { useState, useEffect } from 'react';
import { DailyLog as DailyLogType, saveLog, getLogByDate, getLogs } from '@/lib/storage';
import { determineInterfaceMode, getModeMessage, MODE_CONFIGS } from '@/lib/interfaceMode';
import { triggerHaptic } from '@/lib/haptics';
import { Celebration } from '@/components/Celebration';
import { PlantContainer } from '@/components/PlantContainer';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import { Progress } from '@/ui/progress';
import {
  Smile, Meh, Frown, ArrowRight, ArrowLeft, Sparkles,
  TrendingUp, TrendingDown, Minus, Check, Droplet,
  Heart, Wind, Cookie, Brain, Zap, Moon, Activity, Coffee, Scissors
} from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];

const defaultLog = (): DailyLogType => ({
  date: today(),
  cycleStatus: 'none',
  symptoms: {
    cramps: 0, acne: 0, hairLoss: 0, facialHair: 0,
    bloating: 0, cravings: 0, moodSwings: 0, energy: 5, sleepQuality: 5
  },
  lifestyle: {
    sleepHours: 7, activity: 'light', sugarIntake: 'medium',
    hydrationMet: false, stressLevel: 3
  }
});

type MoodType = 'great' | 'okay' | 'rough';

interface EnhancedSliderProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (val: number) => void;
  isPositive?: boolean;
}

const EnhancedSlider: React.FC<EnhancedSliderProps> = ({
  label, icon, value, onChange, isPositive = false
}) => {
  const getColor = (v: number) => {
    if (isPositive) {
      if (v >= 7) return 'from-green-400 to-green-500';
      if (v >= 4) return 'from-yellow-400 to-yellow-500';
      return 'from-red-400 to-red-500';
    } else {
      if (v <= 3) return 'from-green-400 to-green-500';
      if (v <= 6) return 'from-yellow-400 to-yellow-500';
      return 'from-red-400 to-red-500';
    }
  };

  const getMessage = () => {
    if (isPositive) {
      if (value >= 7) return '✨ That\'s wonderful!';
      if (value >= 4) return '👍 You\'re doing well';
      return '💪 Taking it one day at a time';
    } else {
      if (value <= 3) return '✨ This is great!';
      if (value <= 6) return '👍 You\'re managing';
      return '💚 You\'re not alone';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sage-600">{icon}</span>
          <span className="font-medium text-sage-800">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-sage-700">{value}</span>
          <span className="text-sm text-sage-500">/10</span>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={e => {
          triggerHaptic('selection');
          onChange(+e.target.value);
        }}
        className="w-full h-3 rounded-full appearance-none cursor-pointer transition-all hover:h-4 focus:h-4"
        style={{
          background: `linear-gradient(to right,
            rgb(134, 239, 172) 0%,
            rgb(252, 211, 77) 50%,
            rgb(248, 113, 113) 100%)`
        }}
      />

      <div className="flex justify-between text-xs text-sage-500">
        <span>{isPositive ? 'Low' : 'None'}</span>
        <span className={`font-medium px-2 py-1 rounded-full bg-gradient-to-r ${getColor(value)} text-white`}>
          {getMessage()}
        </span>
        <span>{isPositive ? 'High' : 'Severe'}</span>
      </div>
    </div>
  );
};

export const DailyLogMultiStep: React.FC = () => {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<MoodType>('okay');
  const [log, setLog] = useState<DailyLogType>(defaultLog());
  const [streak, setStreak] = useState(0);
  const [showInsight, setShowInsight] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'confetti' | 'sparkles' | 'hearts'>('confetti');
  const [showMoodCelebration, setShowMoodCelebration] = useState(false);
  const interfaceMode = determineInterfaceMode();
  const modeConfig = MODE_CONFIGS[interfaceMode];
  const { plantData } = useAppContext();

  useEffect(() => {
    const existing = getLogByDate(today());
    if (existing) {
      setLog(existing);
      const avgSymptoms = Object.values(existing.symptoms).reduce((a, b) => a + b, 0) / 9;
      if (avgSymptoms <= 3) setMood('great');
      else if (avgSymptoms <= 6) setMood('okay');
      else setMood('rough');
    }

    const logs = getLogs();
    let currentStreak = 0;
    const dates = logs.map(l => l.date).sort().reverse();
    const todayStr = today();

    for (let i = 0; i < dates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expected = expectedDate.toISOString().split('T')[0];

      if (dates[i] === expected || (i === 0 && dates[i] === todayStr)) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, []);

  useEffect(() => {
    if (mood === 'great') {
      setLog(prev => ({
        ...prev,
        symptoms: {
          cramps: 1, acne: 1, hairLoss: 1, facialHair: 1,
          bloating: 1, cravings: 2, moodSwings: 2, energy: 7, sleepQuality: 7
        }
      }));
    } else if (mood === 'rough') {
      setLog(prev => ({
        ...prev,
        symptoms: {
          cramps: 6, acne: 5, hairLoss: 4, facialHair: 4,
          bloating: 6, cravings: 7, moodSwings: 6, energy: 3, sleepQuality: 3
        }
      }));
    }
  }, [mood]);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const saveAndContinue = () => {
    saveLog(log);
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      triggerHaptic('success');

      if (mood === 'great') {
        setCelebrationType('sparkles');
      } else if (streak >= 7) {
        setCelebrationType('confetti');
      } else {
        setCelebrationType('hearts');
      }

      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setShowInsight(true);
      }, 2000);
    }
  };

  const getInsight = () => {
    const logs = getLogs();
    if (logs.length < 7) {
      return {
        title: "You're Off to a Great Start",
        message: `You've logged ${logs.length} ${logs.length === 1 ? 'day' : 'days'}! Keep going to unlock meaningful pattern insights.`,
        icon: <Sparkles className="w-8 h-8 text-yellow-500" />
      };
    }

    const recent7 = logs.slice(0, 7);
    const avgEnergy = recent7.reduce((sum, l) => sum + l.symptoms.energy, 0) / 7;
    const avgSleep = recent7.reduce((sum, l) => sum + l.lifestyle.sleepHours, 0) / 7;
    const avgCramps = recent7.reduce((sum, l) => sum + l.symptoms.cramps, 0) / 7;

    if (avgEnergy > 6) {
      return {
        title: "Look at That Energy",
        message: `You've been feeling energized this week - averaging ${avgEnergy.toFixed(1)}/10. That's wonderful!`,
        icon: <TrendingUp className="w-8 h-8 text-peach-500" />
      };
    }

    if (avgSleep >= 7.5) {
      return {
        title: "Your Sleep is On Point",
        message: `You're getting ${avgSleep.toFixed(1)} hours on average. Quality rest like this can really help with symptoms.`,
        icon: <Moon className="w-8 h-8 text-peach-500" />
      };
    }

    if (avgCramps < 3) {
      return {
        title: "You're Managing So Well",
        message: `Cramps have been mild this week (${avgCramps.toFixed(1)}/10). Whatever you're doing is working.`,
        icon: <Heart className="w-8 h-8 text-peach-500" />
      };
    }

    return {
      title: "You're Showing Up for Yourself",
      message: `${streak} day streak! This kind of consistency helps reveal meaningful patterns.`,
      icon: <Sparkles className="w-8 h-8 text-purple-500" />
    };
  };

  if (showInsight) {
    const insight = getInsight();
    return (
      <>
        <Celebration trigger={showCelebration} type={celebrationType} color={mood === 'great' || streak >= 7 ? 'lavender' : 'sage'} particleCount={60} />
        <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
        <Card className={`border-2 ${mood === 'great' || streak >= 7 ? 'border-lavender-300 bg-gradient-to-br from-white/90 via-lavender-50/40 to-peach-50/30' : 'border-sage-200 bg-gradient-to-br from-white/90 to-sage-50/30'} dark:border-gray-700 dark:bg-gray-800 shadow-2xl backdrop-blur-xl`}>
          <CardContent className="pt-8 pb-6 text-center space-y-6">
            <div className="flex justify-center">
              {insight.icon}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-sage-800 dark:text-sage-200">{insight.title}</h2>
              <p className="text-sage-600 dark:text-sage-300 text-lg">{insight.message}</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sage-700">
              <div className="flex items-center gap-1">
                <Check className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Day {streak} logged!</span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className={`w-full shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-95 transition-all duration-300 ${
                  mood === 'great' || streak >= 7
                    ? 'bg-gradient-to-r from-lavender-500 via-lavender-600 to-peach-500 hover:from-lavender-600 hover:via-lavender-700 hover:to-peach-600'
                    : 'bg-gradient-to-r from-sage-600 via-olive-600 to-moss-600 hover:from-sage-700 hover:via-olive-700 hover:to-moss-700'
                }`}
              >
                View Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowInsight(false);
                  setStep(1);
                }}
                className="w-full"
              >
                Edit Today's Log
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-sage-50 to-peach-50 dark:from-sage-900 dark:to-peach-900 rounded-xl p-6 space-y-3 transition-all hover:shadow-md border border-sage-200/50">
          <h3 className="font-semibold text-sage-800 dark:text-sage-200">💡 Daily Tip</h3>
          <p className="text-sage-700 dark:text-sage-300 text-sm">
            {log.lifestyle.sleepHours < 7
              ? "Try getting 7-9 hours of sleep tonight. Rest helps balance hormones and reduce PCOS symptoms."
              : "Your sleep looks good! Pair it with regular exercise to amplify the benefits."}
          </p>
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Celebration trigger={showCelebration} type={celebrationType} color="sage" particleCount={60} />
      <div className="max-w-2xl mx-auto space-y-2">
      {interfaceMode !== 'steady' && (
        <div className={`rounded-xl p-2.5 backdrop-blur-sm ${
          interfaceMode === 'nurture'
            ? 'bg-gradient-to-r from-moss-100/80 to-sage-100/80 dark:from-moss-900/40 dark:to-sage-900/40 border border-moss-300/50 dark:border-moss-700/40 shadow-sm'
            : 'bg-gradient-to-r from-amber-100/80 to-moss-100/80 dark:from-amber-900/40 dark:to-moss-900/40 border border-amber-300/50 dark:border-amber-700/40 shadow-sm'
        } animate-in fade-in duration-500`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{modeConfig.icon}</span>
            <div className="flex-1">
              <h3 className={`font-bold text-sm text-sage-800 dark:text-sage-200`}>{modeConfig.name}</h3>
              <p className="text-xs text-sage-700 dark:text-sage-300">{modeConfig.message}</p>
            </div>
          </div>
        </div>
      )}

      <Progress value={progress} className="h-2" />

      {step === 1 && (
        <Card className="border-sage-300/40 dark:border-gray-700/40 bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 animate-slide-up overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sage-100/30 via-transparent to-lavender-100/20 dark:from-sage-900/20 dark:via-transparent dark:to-lavender-900/10 pointer-events-none" />
          <CardContent className="pt-4 space-y-4 relative z-10">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-sage-900 dark:text-sage-100 tracking-tight bg-clip-text">How are you feeling today?</h2>
              <p className="text-xs text-sage-600 dark:text-sage-400">Your garden reflects your journey</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  setMood('great');
                  setShowMoodCelebration(true);
                  setTimeout(() => setShowMoodCelebration(false), 1500);
                }}
                className={`group p-4 rounded-3xl transition-all duration-500 transform hover:scale-105 active:scale-95 relative overflow-hidden backdrop-blur-xl ${
                  mood === 'great'
                    ? 'bg-gradient-to-br from-lavender-200/80 via-lavender-100/70 to-white/60 dark:from-lavender-900/60 dark:via-lavender-800/40 dark:to-gray-800/60 shadow-2xl shadow-lavender-400/40 dark:shadow-lavender-900/30 scale-105 border-2 border-lavender-400/70 dark:border-lavender-600/50'
                    : 'bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg border-2 border-lavender-200/30 dark:border-gray-700/30 hover:bg-lavender-50/60 dark:hover:bg-lavender-900/20 hover:border-lavender-300/60 hover:shadow-xl hover:shadow-lavender-200/20'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-lavender-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <Smile className={`w-10 h-10 mx-auto mb-2 text-lavender-600 dark:text-lavender-300 transition-all duration-500 ${
                  mood === 'great' ? 'animate-bounce scale-125 drop-shadow-lg' : 'group-hover:scale-110 group-hover:rotate-6'
                }`} />
                <p className="font-bold text-lavender-900 dark:text-lavender-100 text-sm relative z-10">Great</p>
                <p className="text-xs text-lavender-700 dark:text-lavender-300 mt-0.5 relative z-10">Feeling wonderful</p>
              </button>
              {mood === 'great' && showMoodCelebration && (
                <Celebration trigger={true} type="sparkles" color="peach" particleCount={30} duration={1500} />
              )}

              <button
                onClick={() => {
                  triggerHaptic('medium');
                  setMood('okay');
                }}
                className={`group p-4 rounded-3xl transition-all duration-500 transform hover:scale-105 active:scale-95 relative overflow-hidden backdrop-blur-xl ${
                  mood === 'okay'
                    ? 'bg-gradient-to-br from-olive-300/80 via-olive-200/70 to-white/60 dark:from-olive-800/60 dark:via-olive-900/40 dark:to-gray-800/60 shadow-2xl shadow-olive-400/40 dark:shadow-olive-900/30 scale-105 border-2 border-olive-400/70 dark:border-olive-600/50'
                    : 'bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg border-2 border-olive-200/30 dark:border-gray-700/30 hover:bg-olive-50/60 dark:hover:bg-olive-900/20 hover:border-olive-300/60 hover:shadow-xl hover:shadow-olive-200/20'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-olive-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <Meh className={`w-10 h-10 mx-auto mb-2 text-olive-600 dark:text-olive-300 transition-all duration-500 ${
                  mood === 'okay' ? 'scale-125 drop-shadow-lg' : 'group-hover:scale-110'
                }`} />
                <p className="font-bold text-olive-900 dark:text-olive-100 text-sm relative z-10">Okay</p>
                <p className="text-xs text-olive-700 dark:text-olive-300 mt-0.5 relative z-10">Doing alright</p>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('medium');
                  setMood('rough');
                }}
                className={`group p-4 rounded-3xl transition-all duration-500 transform hover:scale-105 active:scale-95 relative overflow-hidden backdrop-blur-xl ${
                  mood === 'rough'
                    ? 'bg-gradient-to-br from-terracotta-300/80 via-terracotta-200/70 to-white/60 dark:from-terracotta-800/60 dark:via-terracotta-900/40 dark:to-gray-800/60 shadow-2xl shadow-terracotta-400/40 dark:shadow-terracotta-900/30 scale-105 border-2 border-terracotta-400/70 dark:border-terracotta-600/50'
                    : 'bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg border-2 border-terracotta-200/30 dark:border-gray-700/30 hover:bg-terracotta-50/60 dark:hover:bg-terracotta-900/20 hover:border-terracotta-300/60 hover:shadow-xl hover:shadow-terracotta-200/20'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-terracotta-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <Frown className={`w-10 h-10 mx-auto mb-2 text-terracotta-600 dark:text-terracotta-300 transition-all duration-500 ${
                  mood === 'rough' ? 'scale-125 drop-shadow-lg' : 'group-hover:scale-110'
                }`} />
                <p className="font-bold text-terracotta-900 dark:text-terracotta-100 text-sm relative z-10">Rough</p>
                <p className="text-xs text-terracotta-700 dark:text-terracotta-300 mt-0.5 relative z-10">Need support</p>
              </button>
            </div>

            <div className="relative bg-gradient-to-b from-sage-50/70 via-lavender-50/30 to-peach-50/40 dark:from-sage-950/40 dark:via-lavender-950/20 dark:to-peach-950/30 rounded-3xl p-4 backdrop-blur-md border-2 border-sage-200/40 dark:border-sage-800/40 shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(167,197,164,0.15),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_100%,rgba(107,143,78,0.1),transparent_70%)] pointer-events-none" />
              <div className="relative z-10">
                <PlantContainer streak={streak} mood={mood} plantName={plantData.name} />
              </div>
            </div>

            <Button
              onClick={() => {
                triggerHaptic('light');
                setStep(2);
              }}
              className="w-full bg-gradient-to-r from-sage-600 via-olive-600 to-moss-600 hover:from-sage-700 hover:via-olive-700 hover:to-moss-700 shadow-xl hover:shadow-2xl transition-all duration-300 text-base font-semibold transform hover:scale-[1.02] active:scale-95"
              size="lg"
            >
              Continue <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-sage-200 dark:border-gray-700 dark:bg-gray-800 shadow-md animate-in slide-in-from-right duration-300 hover:border-sage-300">
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-sage-800 dark:text-sage-200">How's your body feeling?</h2>
              <p className="text-sm text-sage-600 dark:text-sage-400">Take your time - there are no right or wrong answers</p>
            </div>

            <div className="space-y-4">
              <EnhancedSlider
                label="Cramps"
                icon={<Heart className="w-5 h-5" />}
                value={log.symptoms.cramps}
                onChange={v => setLog({...log, symptoms: {...log.symptoms, cramps: v}})}
              />
              <EnhancedSlider
                label="Energy Level"
                icon={<Zap className="w-5 h-5" />}
                value={log.symptoms.energy}
                onChange={v => setLog({...log, symptoms: {...log.symptoms, energy: v}})}
                isPositive
              />
              <EnhancedSlider
                label="Mood"
                icon={<Brain className="w-5 h-5" />}
                value={10 - log.symptoms.moodSwings}
                onChange={v => setLog({...log, symptoms: {...log.symptoms, moodSwings: 10 - v}})}
                isPositive
              />
              <EnhancedSlider
                label="Bloating"
                icon={<Wind className="w-5 h-5" />}
                value={log.symptoms.bloating}
                onChange={v => setLog({...log, symptoms: {...log.symptoms, bloating: v}})}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  triggerHaptic('light');
                  setStep(1);
                }}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
              </Button>
              <Button
                onClick={() => {
                  triggerHaptic('light');
                  saveAndContinue();
                }}
                className="flex-1 bg-sage-600 hover:bg-sage-700"
              >
                Next Step (2/4) <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="border-sage-200 dark:border-gray-700 dark:bg-gray-800 shadow-md animate-in slide-in-from-right duration-300 hover:border-sage-300">
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-sage-800">A few more things</h2>
              <p className="text-sm text-sage-600">Only if you'd like to share - feel free to skip</p>
            </div>

            <div className="space-y-4">
              <EnhancedSlider
                label="Acne"
                icon={<Sparkles className="w-5 h-5" />}
                value={log.symptoms.acne}
                onChange={v => setLog({...log, symptoms: {...log.symptoms, acne: v}})}
              />
              <EnhancedSlider
                label="Cravings"
                icon={<Cookie className="w-5 h-5" />}
                value={log.symptoms.cravings}
                onChange={v => setLog({...log, symptoms: {...log.symptoms, cravings: v}})}
              />
              <EnhancedSlider
                label="Hair Loss"
                icon={<Wind className="w-5 h-5" />}
                value={log.symptoms.hairLoss}
                onChange={v => setLog({...log, symptoms: {...log.symptoms, hairLoss: v}})}
              />
              <EnhancedSlider
                label="Facial Hair"
                icon={<Scissors className="w-5 h-5" />}
                value={log.symptoms.facialHair}
                onChange={v => setLog({...log, symptoms: {...log.symptoms, facialHair: v}})}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  triggerHaptic('light');
                  setStep(2);
                }}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
              </Button>
              <Button
                onClick={() => {
                  triggerHaptic('light');
                  saveAndContinue();
                }}
                variant="outline"
                className="flex-1"
              >
                Skip
              </Button>
              <Button
                onClick={() => {
                  triggerHaptic('light');
                  saveAndContinue();
                }}
                className="flex-1 bg-sage-600 hover:bg-sage-700"
              >
                Next Step (3/4) <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="border-sage-200 dark:border-gray-700 dark:bg-gray-800 shadow-md animate-in slide-in-from-right duration-300 hover:border-sage-300">
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-sage-800">Let's talk about today's habits</h2>
              <p className="text-sm text-sage-600">Small daily choices can make a big difference</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-sage-600" />
                    <span className="font-medium text-sage-800">Sleep</span>
                  </div>
                  <span className="text-2xl font-bold text-sage-700">{log.lifestyle.sleepHours}h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={log.lifestyle.sleepHours}
                  onChange={e => {
                    triggerHaptic('selection');
                    setLog({...log, lifestyle: {...log.lifestyle, sleepHours: +e.target.value}});
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-sage-800">Activity Level</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'none', label: 'Rest' },
                    { value: 'light', label: 'Light' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'intense', label: 'Intense' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        triggerHaptic('light');
                        setLog({...log, lifestyle: {...log.lifestyle, activity: opt.value as any}});
                      }}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all transform active:scale-95 ${
                        log.lifestyle.activity === opt.value
                          ? 'bg-sage-600 text-white shadow-md hover:shadow-lg'
                          : 'bg-sage-100 text-sage-600 hover:bg-sage-200 hover:shadow-sm'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-sage-800">Cycle Status</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'period', label: 'Period' },
                    { value: 'spotting', label: 'Spotting' },
                    { value: 'none', label: 'None' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        triggerHaptic('light');
                        setLog({...log, cycleStatus: opt.value as any});
                      }}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all transform active:scale-95 ${
                        log.cycleStatus === opt.value
                          ? 'bg-peach-500 text-white shadow-md hover:shadow-lg'
                          : 'bg-peach-100 text-peach-600 hover:bg-peach-200 hover:shadow-sm'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  triggerHaptic('light');
                  setStep(3);
                }}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
              </Button>
              <Button
                onClick={() => {
                  triggerHaptic('light');
                  saveAndContinue();
                }}
                className="flex-1 bg-gradient-to-r from-sage-600 to-peach-500 hover:from-sage-700 hover:to-peach-600 text-white shadow-lg"
                size="lg"
              >
                Save Today's Check-In <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );
};
