import React, { useMemo } from 'react';
import { discoverCorrelations, Correlation } from '@/lib/correlations';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Lightbulb, TrendingDown, AlertCircle } from 'lucide-react';

export const CorrelationsScreen: React.FC = () => {
  const correlations = useMemo(() => discoverCorrelations(), []);

  const getStrengthBadge = (strength: Correlation['strength']) => {
    const config = {
      strong: { label: 'Strong Pattern', className: 'bg-green-100 text-green-700 border-green-300' },
      moderate: { label: 'Moderate Pattern', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      weak: { label: 'Weak Pattern', className: 'bg-gray-100 text-gray-700 border-gray-300' }
    };
    return config[strength];
  };

  if (correlations.length === 0) {
    return (
      <div className="space-y-4">
        <Card className="border-sage-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-sage-800 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              Pattern Discovery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8 space-y-3">
              <div className="text-6xl">🔍</div>
              <h3 className="text-lg font-semibold text-sage-800">Keep Logging to Discover Patterns</h3>
              <p className="text-sage-600 max-w-md mx-auto">
                After 14 days of consistent tracking, we'll analyze your data to find connections between
                your lifestyle choices and symptoms.
              </p>
            </div>

            <div className="bg-sage-50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sage-800 text-sm">What We'll Discover:</h4>
              <ul className="space-y-1 text-sm text-sage-700">
                <li className="flex items-start gap-2">
                  <span>💤</span>
                  <span>How sleep affects your symptoms and energy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🏃‍♀️</span>
                  <span>Impact of exercise on symptom severity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>💧</span>
                  <span>Hydration's effect on bloating and energy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>😌</span>
                  <span>Stress levels and mood patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>📅</span>
                  <span>Cycle phase symptom variations</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-sage-200 shadow-md bg-gradient-to-br from-sage-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-sage-800 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Your Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-sage-700">
            <TrendingDown className="w-5 h-5 text-green-600" />
            <span>
              We found <strong>{correlations.length}</strong> {correlations.length === 1 ? 'pattern' : 'patterns'} in your data
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {correlations.map((correlation) => {
          const badge = getStrengthBadge(correlation.strength);

          return (
            <Card
              key={correlation.id}
              className="border-sage-200 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">{correlation.icon}</span>
                    <div>
                      <h3 className="font-bold text-sage-800 mb-1">{correlation.title}</h3>
                      <p className="text-sm text-sage-600">{correlation.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={badge.className}>
                    {badge.label}
                  </Badge>
                  <span className="text-xs text-sage-500">
                    Based on {correlation.dataPoints} days of data
                  </span>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Action Step</p>
                      <p className="text-sm text-blue-800">{correlation.actionable}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-sage-200 shadow-sm bg-sage-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="text-sm text-sage-700 space-y-1">
              <p className="font-semibold">How to use this information:</p>
              <p>
                These patterns are unique to your body. Use them to make informed decisions about your
                daily habits and lifestyle choices. Small, consistent changes often lead to the biggest improvements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
