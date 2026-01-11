import React, { useState, useEffect } from 'react';
import { getProfile } from '@/lib/storage';
import { OnboardingWizard } from '@/screens/OnboardingWizard';
import { Header, BottomNav, Screen } from '@/screens/Navigation';
import { DailyLogMultiStep } from '@/screens/DailyLogMultiStep';
import { InsightsScreen } from '@/screens/InsightsScreen';
import { EducationScreen } from '@/screens/EducationScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Shield } from 'lucide-react';

const AppLayout: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  useEffect(() => {
    const profile = getProfile();
    if (profile?.onboardingComplete) {
      setShowOnboarding(false);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleDataDeleted = () => {
    setShowOnboarding(true);
    setCurrentScreen('home');
  };

  if (showOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <DailyLogMultiStep />;
      case 'insights':
        return <InsightsScreen />;
      case 'learn':
        return <EducationScreen />;
      case 'settings':
        return <SettingsScreen onDataDeleted={handleDataDeleted} />;
      default:
        return <DailyLogMultiStep />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />
      <main className="max-w-lg mx-auto px-4 py-3 pb-32 relative z-10">
        {renderScreen()}
      </main>
      <div className="fixed bottom-16 left-0 right-0 bg-amber-50/95 dark:bg-amber-900/40 backdrop-blur-sm border-t border-amber-200 dark:border-amber-800 px-4 py-2 text-center z-40">
        <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" />
          Not medical advice – consult your healthcare provider
        </p>
      </div>
      <BottomNav current={currentScreen} onChange={setCurrentScreen} />
    </div>
  );
};

export default AppLayout;
