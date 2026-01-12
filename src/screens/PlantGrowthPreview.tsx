import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import Plant from '@/components/Plant';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { ArrowLeft, Sparkles, Meh, Frown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { MoodType } from '@/types';

const milestones = [
  { days: 1, label: 'Day 1', points: 0 },
  { days: 3, label: 'Day 3', points: 0 },
  { days: 7, label: '1 Week', points: 0 },
  { days: 14, label: '2 Weeks', points: 150 },
  { days: 30, label: '30 Days', points: 300 },
  { days: 60, label: '60 Days', points: 500 },
  { days: 90, label: '90 Days', points: 1000 }
];

export default function PlantGrowthPreview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-peach-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Plant Evolution Timeline
            </CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Watch your plant grow organically across 90 days with different moods
            </p>
          </CardHeader>
        </Card>

        <Tabs defaultValue="growth" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="growth">Growth Stages</TabsTrigger>
            <TabsTrigger value="moods">Mood Effects</TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {milestones.map(({ days, label, points }) => (
                <Card key={days} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
                      {label}
                      {points > 0 && <Badge variant="secondary" className="text-xs">{points}pts</Badge>}
                    </CardTitle>
                    <p className="text-sm text-center text-muted-foreground">
                      {days} {days === 1 ? 'day' : 'days'} streak
                    </p>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-8">
                    <div className="w-full h-64 flex items-center justify-center">
                      <Plant
                        streak={days}
                        mood="Okay"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="moods" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="overflow-hidden border-2 border-lime-200 bg-lime-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-lime-600" />
                    Great Mood
                  </CardTitle>
                  <p className="text-sm text-center text-muted-foreground">
                    Breathing animation + glow effect
                  </p>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-8">
                  <div className="w-full h-96 flex items-center justify-center">
                    <Plant
                      streak={30}
                      mood="Great"
                    />
                  </div>
                </CardContent>
                <div className="px-4 pb-4">
                  <div className="text-xs text-center space-y-1 text-muted-foreground">
                    <p>✨ Gentle breathing pulse</p>
                    <p>✨ Sparkle particles</p>
                    <p>✨ Glowing leaves & flowers</p>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden border-2 border-blue-200 bg-blue-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
                    <Meh className="w-5 h-5 text-blue-600" />
                    Okay Mood
                  </CardTitle>
                  <p className="text-sm text-center text-muted-foreground">
                    Neutral, steady state
                  </p>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-8">
                  <div className="w-full h-96 flex items-center justify-center">
                    <Plant
                      streak={30}
                      mood="Okay"
                    />
                  </div>
                </CardContent>
                <div className="px-4 pb-4">
                  <div className="text-xs text-center space-y-1 text-muted-foreground">
                    <p>🌿 Normal growth</p>
                    <p>🌿 Standard colors</p>
                    <p>🌿 Stable posture</p>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden border-2 border-orange-200 bg-orange-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
                    <Frown className="w-5 h-5 text-orange-600" />
                    Rough Mood
                  </CardTitle>
                  <p className="text-sm text-center text-muted-foreground">
                    Position-aware wilting
                  </p>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-8">
                  <div className="w-full h-96 flex items-center justify-center">
                    <Plant
                      streak={30}
                      mood="Rough"
                    />
                  </div>
                </CardContent>
                <div className="px-4 pb-4">
                  <div className="text-xs text-center space-y-1 text-muted-foreground">
                    <p>🍂 Top leaves droop more</p>
                    <p>🍂 Desaturated colors</p>
                    <p>🍂 Realistic wilting physics</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3 text-center">Enhanced Visual Effects</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="font-semibold text-lime-700">Great Mood Features</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Subtle breathing animation (4s cycle)</li>
                      <li>• SVG glow filter with saturation boost</li>
                      <li>• Sparkle particle effects</li>
                      <li>• Vibrant, saturated colors</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-blue-700">Okay Mood Features</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• No special effects</li>
                      <li>• Natural color palette</li>
                      <li>• Upright leaf positioning</li>
                      <li>• Clean, standard appearance</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-orange-700">Rough Mood Features</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Position-aware droop (top droops more)</li>
                      <li>• Desaturation SVG filter</li>
                      <li>• Scale reduction toward top</li>
                      <li>• Gravity-based rotation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Evolution System</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Progressive Unlocking:</strong> Features appear as you reach milestones</p>
                  <p><strong>Organic Growth:</strong> Smooth Bézier curves create natural stem movement</p>
                  <p><strong>Unique Variation:</strong> Each user's plant has slightly different curves</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Feature Milestones</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Day 1:</strong> 🌱 Strong stem emerges</p>
                  <p><strong>Day 3:</strong> 🍃 First leaves appear</p>
                  <p><strong>Day 7:</strong> 🌿 Second set of leaves</p>
                  <p><strong>Day 14 + 150pts:</strong> 🌳 Branches develop</p>
                  <p><strong>Day 30 + 300pts:</strong> 🌸 Flowers bloom</p>
                  <p><strong>Day 60 + 500pts:</strong> 🍎 Fruit appears</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Key Design Principles</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ <strong>Milestone Celebrations:</strong> Visual feedback when unlocking features</p>
                  <p>✓ <strong>Health Integration:</strong> Recent logs affect plant vitality and color</p>
                  <p>✓ <strong>Event-Driven:</strong> Features unlock at specific achievements</p>
                  <p>✓ <strong>Progressive Revelation:</strong> Creates narrative progression</p>
                  <p>✓ <strong>Controlled Randomness:</strong> Consistent variation per user</p>
                </div>
              </div>

              <div className="bg-sage-50 p-4 rounded-lg border border-sage-200">
                <h3 className="font-semibold text-sm mb-2 text-sage-900">Technical Highlights</h3>
                <div className="space-y-1 text-xs text-sage-700">
                  <p>• Cubic Bézier curves for smooth, organic stem growth</p>
                  <p>• Seeded randomness ensures consistent plant per user</p>
                  <p>• Feature-based rendering with animation triggers</p>
                  <p>• Health score affects stem color and vibrancy</p>
                  <p>• Points + streak = dual progression system</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
