import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Plant from '../components/Plant';
import { calculateGrowthMetrics } from '../lib/growthIntelligence';
import { getLogs } from '../lib/storage';
import { Badge } from '../ui/badge';
import { ArrowLeft, Sparkles, Leaf, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

export default function GrowthComparison() {
  const navigate = useNavigate();
  const metrics = calculateGrowthMetrics();
  const streak = metrics.currentStreak;
  const totalPoints = metrics.totalPoints;
  const logs = getLogs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-peach-50 pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sage-900 mb-2">
            Plant Growth Evolution
          </h1>
          <p className="text-muted-foreground">
            Understanding your plant's organic growth system
          </p>
        </div>

        <Tabs defaultValue="preview" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">
              <Sparkles className="w-4 h-4 mr-2" />
              Your Plant
            </TabsTrigger>
            <TabsTrigger value="techniques">
              <Code2 className="w-4 h-4 mr-2" />
              Techniques
            </TabsTrigger>
            <TabsTrigger value="evolution">
              <Leaf className="w-4 h-4 mr-2" />
              Milestones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-sage-600" />
                  Your Growing Companion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-6">
                  <Plant
                    streak={streak}
                    mood="Okay"
                  />
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Progressive feature unlocking based on your achievements</p>
                  <p>✓ Smooth organic growth with Bézier curves</p>
                  <p>✓ Procedural generation creates natural variation</p>
                  <p>✓ Mood-driven colors reflect your well-being</p>
                  <p>✓ Branches and flowers appear as you progress</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Current Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-sage-50 rounded-lg">
                    <p className="text-2xl font-bold text-sage-700">{streak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                  <div className="text-center p-4 bg-peach-50 rounded-lg">
                    <p className="text-2xl font-bold text-peach-700">{totalPoints}</p>
                    <p className="text-xs text-muted-foreground">Total Points</p>
                  </div>
                  <div className="text-center p-4 bg-sage-50 rounded-lg">
                    <p className="text-2xl font-bold text-sage-700">
                      {streak >= 7 ? '🌿' : streak >= 3 ? '🌱' : '🌰'}
                    </p>
                    <p className="text-xs text-muted-foreground">Plant Stage</p>
                  </div>
                  <div className="text-center p-4 bg-peach-50 rounded-lg">
                    <p className="text-2xl font-bold text-peach-700">{logs.length}</p>
                    <p className="text-xs text-muted-foreground">Total Logs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="techniques" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Techniques from MIT Simulation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Badge variant="secondary">1</Badge>
                    Event-Driven Growth Architecture
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Instead of animating everything at once, the stem fires progress events
                    as it grows, and leaves listen for these events to appear at the right
                    time.
                  </p>
                  <div className="bg-slate-50 p-3 rounded font-mono text-xs">
                    <code className="text-sage-700">
                      // Stem fires events during growth
                      <br />
                      onUpdate: () =&gt; events.fire(stemId, progress)
                      <br />
                      <br />
                      // Leaves listen and appear at thresholds
                      <br />
                      if (growth &gt;= threshold) showLeaf()
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Badge variant="secondary">2</Badge>
                    Smooth Bézier Curve Generation
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Mathematical curve smoothing creates organic, natural-looking growth
                    instead of rigid straight lines.
                  </p>
                  <div className="bg-slate-50 p-3 rounded font-mono text-xs">
                    <code className="text-sage-700">
                      // Calculate control points for smooth curves
                      <br />
                      cp1x = (-x0 + 6*x1 + x2) / 6
                      <br />
                      cp2x = (x1 + 6*x2 - x3) / 6
                      <br />
                      <br />
                      // Creates cubic Bézier path
                      <br />
                      path += `C$&#123;cp1x&#125;,$&#123;cp1y&#125;,$&#123;cp2x&#125;,$&#123;cp2y&#125;,$&#123;x2&#125;,$&#123;y2&#125;`
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Badge variant="secondary">3</Badge>
                    Progressive Feature Revelation
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Features unlock sequentially as you progress, creating a sense of
                    achievement and narrative progression.
                  </p>
                  <div className="bg-slate-50 p-3 rounded text-sm">
                    <div className="space-y-1 text-muted-foreground">
                      <p>• Day 1: Stem appears</p>
                      <p>• Day 3: First leaves emerge</p>
                      <p>• Day 7: More leaves grow</p>
                      <p>• Day 14: Branches develop</p>
                      <p>• Day 30: Flowers bloom</p>
                      <p>• Day 60: Fruit appears</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Badge variant="secondary">4</Badge>
                    Controlled Randomness
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Small random variations make each plant unique while maintaining overall
                    structure and beauty.
                  </p>
                  <div className="bg-slate-50 p-3 rounded font-mono text-xs">
                    <code className="text-sage-700">
                      // Stem "wanders" naturally as it grows
                      <br />
                      x += random(-drift, drift) * (i * 0.05)
                      <br />
                      y += 5 + random(0, 2)
                      <br />
                      <br />
                      // Each user gets consistent variation
                      <br />
                      seed = hash(userId)
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolution" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Evolution System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Feature Milestones</h3>
                    <div className="space-y-3">
                      {[
                        { icon: '🌱', label: 'Strong Stem', streak: 1, points: 0 },
                        { icon: '🍃', label: 'First Leaf', streak: 3, points: 0 },
                        { icon: '🌿', label: 'Second Leaf', streak: 7, points: 0 },
                        { icon: '🌳', label: 'Branches', streak: 14, points: 150 },
                        { icon: '🌸', label: 'First Flower', streak: 30, points: 300 },
                        { icon: '🍎', label: 'Fruit', streak: 60, points: 500 },
                      ].map((milestone, i) => {
                        const unlocked =
                          streak >= milestone.streak &&
                          totalPoints >= milestone.points;
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                              unlocked
                                ? 'bg-sage-100 border-2 border-sage-300'
                                : 'bg-slate-50 opacity-50'
                            }`}
                          >
                            <span className="text-2xl">{milestone.icon}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">
                                {milestone.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {milestone.streak} day streak
                                {milestone.points > 0 && ` • ${milestone.points} points`}
                              </p>
                            </div>
                            {unlocked && (
                              <Badge variant="secondary" className="text-xs">
                                ✓ Unlocked
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-sage-50 p-4 rounded-lg border border-sage-200">
                    <h3 className="font-semibold text-sm mb-3">How It Works</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        <strong>Streak-Based:</strong> Features unlock as you maintain
                        consecutive daily logs
                      </p>
                      <p>
                        <strong>Points-Based:</strong> Some features require both streak
                        AND total points (quality + quantity)
                      </p>
                      <p>
                        <strong>Health Score:</strong> Your recent mood and energy levels
                        affect plant vitality
                      </p>
                      <p>
                        <strong>Unique Growth:</strong> Each user's plant has slightly
                        different curves and variations
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
