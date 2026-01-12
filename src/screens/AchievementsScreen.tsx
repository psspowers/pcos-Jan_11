import React, { useMemo, useState, useEffect } from 'react';
import { checkAchievements, Achievement } from '@/lib/achievements';
import { Celebration } from '@/components/Celebration';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Progress } from '@/ui/progress';
import { Lock, Sparkles } from 'lucide-react';

export const AchievementsScreen: React.FC = () => {
  const achievements = useMemo(() => checkAchievements(), []);
  const [showCelebration, setShowCelebration] = useState(false);

  const stats = useMemo(() => {
    const unlocked = achievements.filter(a => a.unlocked).length;
    const total = achievements.length;
    const percentage = Math.round((unlocked / total) * 100);

    const byTier = {
      tier1: achievements.filter(a => a.tier === 1),
      tier2: achievements.filter(a => a.tier === 2),
      tier3: achievements.filter(a => a.tier === 3)
    };

    return { unlocked, total, percentage, byTier };
  }, [achievements]);

  useEffect(() => {
    const hasNewAchievement = achievements.some(
      a => a.unlocked && a.unlockedAt &&
      new Date(a.unlockedAt).getTime() > Date.now() - 10000
    );

    if (hasNewAchievement) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [achievements]);

  const renderAchievement = (achievement: Achievement) => {
    const progressPercentage = (achievement.progress / achievement.total) * 100;

    return (
      <Card
        key={achievement.id}
        className={`border transition-all duration-300 ${
          achievement.unlocked
            ? 'border-sage-300 bg-gradient-to-br from-sage-50 to-peach-50 shadow-md hover:shadow-lg hover:border-sage-400 hover:scale-[1.01] cursor-pointer'
            : 'border-gray-200 bg-gray-50 opacity-60 hover:opacity-70'
        }`}
      >
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={`text-4xl ${achievement.unlocked ? 'scale-100' : 'scale-90 grayscale'} transition-all`}>
              {achievement.unlocked ? achievement.icon : <Lock className="w-10 h-10 text-gray-400" />}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-bold ${achievement.unlocked ? 'text-sage-800' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${achievement.unlocked ? 'text-sage-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.tier === 3 && achievement.unlocked && (
                  <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                )}
              </div>

              {!achievement.unlocked && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>{achievement.progress} / {achievement.total}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}

              {achievement.unlocked && achievement.unlockedAt && (
                <p className="text-xs text-sage-500">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Celebration
        trigger={showCelebration}
        type="confetti"
        color="rainbow"
        particleCount={100}
        duration={4000}
      />
      <div className="space-y-6">
        <Card className="border-sage-200 shadow-lg bg-gradient-to-br from-sage-100 to-peach-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-sage-800 flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-sage-700 font-medium">Overall Progress</span>
              <span className="text-sage-800 font-bold">
                {stats.unlocked} / {stats.total} ({stats.percentage}%)
              </span>
            </div>
            <Progress value={stats.percentage} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-white/80 rounded-lg p-3 text-center">
              <p className="text-xs text-sage-600 mb-1">Tier 1</p>
              <p className="text-lg font-bold text-sage-800">
                {stats.byTier.tier1.filter(a => a.unlocked).length} / {stats.byTier.tier1.length}
              </p>
            </div>
            <div className="bg-white/80 rounded-lg p-3 text-center">
              <p className="text-xs text-sage-600 mb-1">Tier 2</p>
              <p className="text-lg font-bold text-sage-800">
                {stats.byTier.tier2.filter(a => a.unlocked).length} / {stats.byTier.tier2.length}
              </p>
            </div>
            <div className="bg-white/80 rounded-lg p-3 text-center">
              <p className="text-xs text-sage-600 mb-1">Tier 3</p>
              <p className="text-lg font-bold text-sage-800">
                {stats.byTier.tier3.filter(a => a.unlocked).length} / {stats.byTier.tier3.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-sage-800 flex items-center gap-2">
          <span>🌱</span>
          Planting Seeds
        </h2>
        {stats.byTier.tier1.map(renderAchievement)}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-sage-800 flex items-center gap-2">
          <span>🌿</span>
          Growing Wisdom
        </h2>
        {stats.byTier.tier2.map(renderAchievement)}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-sage-800 flex items-center gap-2">
          <span>🌳</span>
          Full Bloom
        </h2>
        {stats.byTier.tier3.map(renderAchievement)}
      </div>
      </div>
    </>
  );
};
