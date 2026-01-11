import React, { useEffect, useState, useMemo } from 'react';
import {
  PLANT_FEATURES,
  getUnlockedFeatures,
  getNextMilestone,
  PlantFeature,
} from '../lib/plantEvolution';

interface OrganicPlantGrowthProps {
  streak: number;
  totalLogs: number;
  userId?: string;
  className?: string;
}

const Sparkle: React.FC<{ style: React.CSSProperties; color: string }> = ({ style, color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="absolute animate-sparkle"
    style={style}
  >
    <path
      d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
      fill={color}
    />
  </svg>
);

export const OrganicPlantGrowth: React.FC<OrganicPlantGrowthProps> = ({
  streak,
  totalLogs,
  userId = 'default',
  className = '',
}) => {
  const [animatingFeature, setAnimatingFeature] = useState<PlantFeature | null>(null);
  const [prevStreak, setPrevStreak] = useState(streak);

  const unlockedFeatures = getUnlockedFeatures(streak, totalLogs);
  const nextMilestone = getNextMilestone(streak, totalLogs);

  // Plant health is based on consistency (streak), not symptom quality
  const plantHealth = useMemo(() => {
    if (streak === 0) return 50;
    if (streak >= 90) return 100;
    if (streak >= 60) return 95;
    if (streak >= 30) return 85;
    if (streak >= 14) return 75;
    if (streak >= 7) return 65;
    if (streak >= 3) return 55;
    return 50 + (streak * 2);
  }, [streak]);

  useEffect(() => {
    if (streak > prevStreak) {
      const newFeatures = getUnlockedFeatures(streak, totalLogs);
      const oldFeatures = getUnlockedFeatures(prevStreak, totalLogs);

      const justUnlocked = newFeatures.find(f => !oldFeatures.includes(f));
      if (justUnlocked) {
        setAnimatingFeature(justUnlocked);
        setTimeout(() => setAnimatingFeature(null), 1000);
      }
    }
    setPrevStreak(streak);
  }, [streak, totalLogs, prevStreak]);

  const stemColor = useMemo(() => {
    if (plantHealth > 75) return '#65a30d';
    if (plantHealth > 50) return '#84cc16';
    if (plantHealth > 25) return '#a3e635';
    return '#d9f99d';
  }, [plantHealth]);

  const primaryFill = useMemo(() => {
    if (plantHealth > 75) return '#84cc16';
    if (plantHealth > 50) return '#a3e635';
    if (plantHealth > 25) return '#d9f99d';
    return '#9ca3af';
  }, [plantHealth]);

  const secondaryFill = useMemo(() => {
    if (plantHealth > 75) return '#bef264';
    if (plantHealth > 50) return '#d9f99d';
    return '#e5e7eb';
  }, [plantHealth]);

  const potColor = useMemo(() => {
    if (streak < 14) return '#92400e';
    if (streak < 30) return '#94a3b8';
    return '#facc15';
  }, [streak]);

  const leafCount = useMemo(() => {
    if (streak < 1) return 0;
    if (streak <= 3) return 2;
    if (streak <= 7) return 4;
    if (streak <= 14) return 6;
    if (streak <= 30) return 8;
    if (streak <= 60) return 10;
    return 12;
  }, [streak]);

  const showBranches = streak >= 14 && totalPoints >= 150;
  const showFlower = streak >= 30 && totalPoints >= 300;
  const showFruit = streak >= 60 && totalPoints >= 500;

  const growthPixels = Math.min(streak * 2.5, 180);
  const stemTipY = 240 - growthPixels;
  const stemBaseY = 240;

  const leafPositions = useMemo(() => {
    const positions: [number, number, number, number, number][] = [];

    if (leafCount === 0) return positions;

    const stemHeight = growthPixels;
    const stemStart = stemBaseY;

    const seedHash = userId ? String(userId).split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0;

    for (let i = 0; i < leafCount; i++) {
      const baseProgress = (i + 1) / (leafCount + 1);

      const offsetSeed = (seedHash + i * 13) % 100;
      const yOffset = (offsetSeed / 100) * 8 - 4;

      const progressAlongStem = Math.max(0.1, Math.min(0.95, baseProgress + (yOffset / stemHeight)));
      const yPosition = stemStart - (progressAlongStem * stemHeight);

      const isLeftSide = i % 2 === 0;
      const rotationVariation = ((seedHash + i * 7) % 20) - 10;
      const rotation = isLeftSide
        ? -145 + rotationVariation
        : -35 - rotationVariation;

      const scale = 0.6 + (progressAlongStem * 0.5);
      const delay = i * 0.15;

      positions.push([100, yPosition, rotation, scale, delay]);
    }

    return positions;
  }, [leafCount, growthPixels, stemBaseY, userId]);

  const flowers = useMemo(() => {
    const stemMidPoint = stemTipY + (growthPixels * 0.5);
    const stemUpperThird = stemTipY + (growthPixels * 0.3);

    return [
      { x: 100, y: stemTipY - 5, scale: 1.0, delay: 1.2, branch: null },
      {
        x: 70,
        y: stemMidPoint,
        scale: 0.8,
        delay: 1.4,
        branch: `M100,${stemMidPoint + 20} Q80,${stemMidPoint + 20} 70,${stemMidPoint}`,
      },
      {
        x: 130,
        y: stemUpperThird,
        scale: 0.8,
        delay: 1.6,
        branch: `M100,${stemUpperThird + 20} Q120,${stemUpperThird + 20} 130,${stemUpperThird}`,
      },
    ];
  }, [stemTipY, growthPixels]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-full h-[400px] flex items-end justify-center">
        {plantHealth > 75 && (
          <div className="absolute inset-0 pointer-events-none">
            <Sparkle style={{ top: '20%', left: '30%', animationDelay: '0s' }} color={primaryFill} />
            <Sparkle style={{ top: '15%', right: '25%', animationDelay: '1s' }} color={primaryFill} />
            <Sparkle style={{ top: '40%', left: '20%', animationDelay: '2s' }} color={primaryFill} />
            <Sparkle style={{ top: '35%', right: '20%', animationDelay: '1.5s' }} color={primaryFill} />
          </div>
        )}

        <svg viewBox="0 0 200 300" className="w-full h-full max-w-md drop-shadow-xl filter">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g transform="translate(0, 0)">
            <ellipse cx="100" cy="290" rx="50" ry="10" fill="black" opacity="0.15" />
            <path
              d="M65,240 L135,240 L125,290 L75,290 Z"
              fill={potColor}
              stroke="#00000020"
              strokeWidth="1"
              className="transition-colors duration-1000"
            />
            <path
              d="M60,240 L140,240 L140,250 L60,250 Z"
              fill={potColor}
              filter="brightness(1.1)"
              stroke="#00000020"
              strokeWidth="1"
              className="transition-colors duration-1000"
            />
            <path d="M70,265 L130,265" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          </g>

          {streak > 0 && (
            <path
              d={`M100,240 Q105,${240 - growthPixels / 2} 100,${stemTipY}`}
              stroke={stemColor}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-1000"
              style={{ transformOrigin: '100px 240px' }}
            />
          )}

          {showBranches && flowers.slice(1).map((flower, i) =>
            flower.branch && (
              <path
                key={`branch-${i}`}
                d={flower.branch}
                stroke={stemColor}
                strokeWidth="3"
                fill="none"
                className="transition-all duration-1000"
                style={{ animationDelay: `${flower.delay - 0.5}s` }}
              />
            )
          )}

          {leafPositions.map((pos, i) => (
            <g
              key={`leaf-${i}`}
              transform={`translate(${pos[0]}, ${pos[1]}) rotate(${pos[2]}) scale(${pos[3]})`}
            >
              <g
                className="animate-pop-leaf"
                style={{
                  animationDelay: `${pos[4]}s`,
                  transformOrigin: '0 0',
                }}
              >
                <path
                  d="M0,0 Q15,-15 30,0 Q15,15 0,0"
                  fill={secondaryFill}
                  stroke={primaryFill}
                  strokeWidth="2"
                  className="transition-colors duration-700"
                />
              </g>
            </g>
          ))}

          {showFlower &&
            flowers.map((flower, i) => {
              const flowerY = flower.y;
              return (
                <g key={`flower-${i}`} transform={`translate(${flower.x}, ${flowerY}) scale(${flower.scale})`}>
                  <g
                    className="animate-pop-leaf"
                    style={{
                      animationDelay: `${flower.delay}s`,
                      transformOrigin: 'center',
                      transformBox: 'fill-box',
                    }}
                  >
                    {[0, 60, 120, 180, 240, 300].map(angle => (
                      <circle
                        key={angle}
                        cx={Math.cos((angle * Math.PI) / 180) * 8}
                        cy={Math.sin((angle * Math.PI) / 180) * 8}
                        r="8"
                        fill={primaryFill}
                        className="transition-colors duration-700"
                      />
                    ))}
                    <circle cx="0" cy="0" r="5" fill="#fff7ed" />
                  </g>
                </g>
              );
            })}

          {showFruit && (
            <g
              transform={`translate(115, ${stemTipY + 40})`}
              className="animate-pop-leaf"
              style={{
                animationDelay: '2s',
                transformOrigin: 'center',
                transformBox: 'fill-box',
              }}
            >
              <circle cx="0" cy="0" r="10" fill="#ef4444" opacity="0.9" />
            </g>
          )}

          {streak === 0 && (
            <g transform="translate(100, 240)" opacity="0.5">
              <text x="0" y="30" textAnchor="middle" fontSize="12" fill="#94a3b8">
                Ready to grow
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-4 text-center space-y-2">
        <div className="flex flex-wrap justify-center gap-2">
          {PLANT_FEATURES.filter(f => unlockedFeatures.includes(f.feature)).map(feature => (
            <span
              key={feature.feature}
              className="text-xs px-2 py-1 bg-sage-100 text-sage-700 rounded-full"
            >
              {feature.icon} {feature.label}
            </span>
          ))}
        </div>

        {nextMilestone && (
          <p className="text-sm text-muted-foreground">
            Next: {nextMilestone.icon} {nextMilestone.label}
          </p>
        )}

        <p className="text-xs text-sage-600 font-medium">
          Health: {plantHealth.toFixed(0)}% • Features: {unlockedFeatures.length}/
          {PLANT_FEATURES.length}
        </p>
      </div>
    </div>
  );
};
