import React, { useState, useEffect } from 'react';
import { getProfile } from '@/lib/storage';
import { OnboardingWizard } from '@/screens/OnboardingWizard';
import { Dashboard } from '@/screens/Dashboard';
import { InsightsScreen } from '@/screens/InsightsScreen';
import { EducationScreen } from '@/screens/EducationScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

type Screen = 'home' | 'insights' | 'learn' | 'settings';

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
        return <Dashboard />;
      case 'insights':
        return <InsightsScreen />;
      case 'learn':
        return <EducationScreen />;
      case 'settings':
        return <SettingsScreen onDataDeleted={handleDataDeleted} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderScreen()}
    </div>
  );
};

export default AppLayout;
