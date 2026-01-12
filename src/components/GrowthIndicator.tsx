import React, { useState } from 'react';
import { Sprout, Leaf, TreeDeciduous, Sparkles, CircleDot, Info, TrendingUp, Flame, Heart, Moon } from 'lucide-react';
import {
  calculateGrowthMetrics,
  getCurrentGrowthStage,
  getNextMilestone,
  getPersonalizedMessage,
  getProgressToNextMilestone
} from '@/lib/growthIntelligence';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';

interface GrowthIndicatorProps {
  className?: string;
}

const STAGE_ICONS = {
  seed: CircleDot,
  sprout: Sprout,
  plant: Leaf,
  bloom: Sparkles,
  tree: TreeDeciduous
};

export const GrowthIndicator: React.FC<GrowthIndicatorProps> = ({ className = '' }) => {
  const [showDetails, setShowDetails] = useState(false);

  const metrics = calculateGrowthMetrics();
  const currentStage = getCurrentGrowthStage(metrics);
  const nextMilestone = getNextMilestone(metrics);
  const progress = getProgressToNextMilestone(metrics);
  const personalMessage = getPersonalizedMessage(metrics);

  const Icon = STAGE_ICONS[currentStage.stage];

  return (
    <div className={className}>
      <Card className={`border-2 shadow-lg transition-all hover:shadow-xl ${currentStage.bg} border-sage-200`}>
        <CardContent className="p-6">
          {/* Main Growth Display */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`relative p-4 rounded-full bg-white/90 shadow-md transition-all hover:scale-110 ${
              metrics.isDormant ? 'opacity-60' : 'animate-in zoom-in duration-500'
            }`}>
              <Icon className={`w-10 h-10 ${currentStage.color}`} />
              {metrics.isDormant && (
                <div className="absolute -top-1 -right-1 p-1 bg-blue-100 rounded-full">
                  <Moon className="w-4 h-4 text-blue-600" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-2xl font-bold text-sage-800 mb-1">
                    {currentStage.label}
                  </h3>
                  <p className="text-sm text-sage-600 italic">
                    {currentStage.narrative}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sage-600 hover:text-sage-800"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>

              {/* Growth Points Display */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 px-3 py-1 bg-white/70 rounded-full">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-lg font-bold text-sage-700">
                    {metrics.totalPoints}
                  </span>
                  <span className="text-xs text-sage-500">points</span>
                </div>
                {metrics.currentStreak > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-white/70 rounded-full">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-bold text-sage-700">
                      {metrics.currentStreak}
                    </span>
                    <span className="text-xs text-sage-500">day streak</span>
                  </div>
                )}
              </div>

              {/* Progress to Next Milestone */}
              {nextMilestone && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-sage-600">
                    <span className="font-medium">Growing to: {nextMilestone.label}</span>
                    <span className="font-mono">
                      {metrics.totalPoints} / {nextMilestone.pointsRequired}
                    </span>
                  </div>
                  <div className="h-2 bg-sage-200/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sage-500 via-peach-500 to-amber-500 rounded-full transition-all duration-700 ease-out shadow-sm"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {!nextMilestone && (
                <div className="flex items-center gap-2 text-sm text-sage-600 bg-white/60 rounded-lg px-3 py-2">
                  <TreeDeciduous className="w-4 h-4 text-sage-700" />
                  <span className="font-medium">Maximum growth achieved!</span>
                </div>
              )}
            </div>
          </div>

          {/* Personalized Message */}
          <div className={`rounded-xl p-4 ${
            metrics.isDormant
              ? 'bg-blue-50/80 border border-blue-200'
              : 'bg-white/60 border border-sage-200'
          }`}>
            <p className="text-sm text-sage-700 leading-relaxed">
              {personalMessage}
            </p>
          </div>

          {/* Detailed Breakdown */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-sage-200 space-y-3 animate-in slide-in-from-top-2 duration-300">
              <div className="bg-white/60 rounded-lg p-3 space-y-2">
                <h4 className="text-sm font-bold text-sage-800 mb-2">Growth Breakdown</h4>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-sage-600 flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Consistency
                  </span>
                  <span className="font-mono font-bold text-sage-700">
                    +{metrics.consistencyBonus} pts
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-sage-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Health Improvements
                  </span>
                  <span className={`font-mono font-bold ${
                    metrics.improvementBonus >= 0 ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {metrics.improvementBonus >= 0 ? '+' : ''}{metrics.improvementBonus} pts
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-sage-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Lifestyle Habits
                  </span>
                  <span className="font-mono font-bold text-sage-700">
                    +{metrics.lifestyleBonus} pts
                  </span>
                </div>
              </div>

              <div className="bg-peach-50/60 rounded-lg p-3">
                <p className="text-xs text-sage-700 leading-relaxed">
                  <span className="font-bold">Wisdom:</span> {currentStage.wisdom}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
