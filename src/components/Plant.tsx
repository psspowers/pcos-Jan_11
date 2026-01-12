import React, { useMemo } from 'react';
import { MoodType } from '../types';
import { MOODS } from '../constants';

interface PlantProps {
  streak: number;
  mood: MoodType;
}

const Plant: React.FC<PlantProps> = ({ streak, mood }) => {
  const activeMood = mood ? MOODS[mood] : MOODS['Okay'];
  const primaryFill = mood ? activeMood.fillColor : '#9ca3af';
  const secondaryFill = mood ? activeMood.accentColor : '#e5e7eb';
  const stemColor = mood ? '#4b5563' : '#9ca3af';

  const potColor = useMemo(() => {
    if (streak < 14) return '#92400e';
    if (streak < 30) return '#94a3b8';
    return '#facc15';
  }, [streak]);

  const { plantPaths, allLeaves, allFlowers, allFruits } = useMemo(() => {
    const paths: { d: string, id: string, width: number }[] = [];
    const leaves: any[] = [];
    const flowers: any[] = [];
    const fruits: any[] = [];

    const startX = 100;
    const startY = 285;
    const maxMainSegments = 8;

    const maturity = Math.min(streak / 30, 1.2);

    const getGrowthScale = (age: number) => {
        if (age < 0) return 0;
        if (age === 0) return 0.3;
        if (age === 1) return 0.6;
        if (age === 2) return 0.8;
        return 1.0;
    };

    const mainPoints: number[] = [startX, startY];
    let currentX = startX;
    let currentY = startY;

    const activeSegments = Math.max(2, Math.ceil(maturity * maxMainSegments));

    for (let i = 1; i <= activeSegments; i++) {
        const segHeight = 25;
        currentY -= segHeight;
        currentX = startX + Math.sin(i * 0.7) * (8 + i);
        mainPoints.push(currentX, currentY);
    }

    paths.push({ d: solve(mainPoints), id: 'main', width: 6 });

    const branchConfigs = [
        { index: 2, dirX: -55, dirY: -35, minStreak: 3, curveStrength: -25 },
        { index: 3, dirX: 55, dirY: -45, minStreak: 6, curveStrength: 25 },
        { index: 4, dirX: -60, dirY: -50, minStreak: 10, curveStrength: -30 },
        { index: 5, dirX: 50, dirY: -55, minStreak: 15, curveStrength: 30 },
        { index: 6, dirX: -45, dirY: -45, minStreak: 20, curveStrength: -20 },
    ];

    const generatedBranches: { p0: {x:number, y:number}, p1: {x:number, y:number}, p2: {x:number, y:number}, id: string }[] = [];

    branchConfigs.forEach((config, i) => {
        const pIndex = config.index * 2;
        if (streak >= config.minStreak && pIndex + 1 < mainPoints.length) {
            const bx = mainPoints[pIndex];
            const by = mainPoints[pIndex + 1];

            const branchAge = streak - config.minStreak;
            const branchMaturity = Math.min(Math.max(branchAge, 0.2) / 5, 1);

            const endX = bx + (config.dirX * branchMaturity);
            const endY = by + (config.dirY * branchMaturity);

            const cpX = bx + (config.curveStrength * branchMaturity);
            const cpY = by - (20 * branchMaturity);

            const d = `M${bx},${by} Q${cpX},${cpY} ${endX},${endY}`;
            paths.push({ d, id: `branch-${i}`, width: 4 * branchMaturity });

            generatedBranches.push({
                p0: {x: bx, y: by},
                p1: {x: cpX, y: cpY},
                p2: {x: endX, y: endY},
                id: `branch-${i}`
            });
        }
    });

    const addLeaf = (x: number, y: number, rotation: number, scale: number, delay: number, heightRatio: number) => {
        leaves.push({ x, y, rotation, scale, delay, heightRatio });
    };

    for (let i = 4; i < (mainPoints.length / 2) - 1; i++) {
        const birthStreak = i * 2;

        if (streak >= birthStreak) {
            const pIdx = i * 2;
            const x = mainPoints[pIdx];
            const y = mainPoints[pIdx + 1];

            const prevX = mainPoints[pIdx - 2];
            const prevY = mainPoints[pIdx - 1];
            const nextX = mainPoints[pIdx + 2];
            const nextY = mainPoints[pIdx + 3];
            const angleRad = Math.atan2(nextY - prevY, nextX - prevX);
            const angleDeg = angleRad * (180 / Math.PI);

            const isLeft = i % 2 !== 0;
            const rotation = angleDeg + (isLeft ? -90 - 20 : 90 + 20);

            const age = streak - birthStreak;
            const growthScale = getGrowthScale(age);

            const heightRatio = (startY - y) / (startY - currentY);

            addLeaf(x, y, rotation, growthScale, i * 0.1, heightRatio);
        }
    }

    generatedBranches.forEach((branch, bIdx) => {
        const config = branchConfigs[bIdx];

        [0.4, 0.7].forEach((t, tIdx) => {
             const leafDelayDays = tIdx === 0 ? 1 : 3;
             const birthStreak = config.minStreak + leafDelayDays;

             if (streak >= birthStreak) {
                 const mt = 1 - t;
                 const x = (mt * mt * branch.p0.x) + (2 * mt * t * branch.p1.x) + (t * t * branch.p2.x);
                 const y = (mt * mt * branch.p0.y) + (2 * mt * t * branch.p1.y) + (t * t * branch.p2.y);

                 const tx = 2 * mt * (branch.p1.x - branch.p0.x) + 2 * t * (branch.p2.x - branch.p1.x);
                 const ty = 2 * mt * (branch.p1.y - branch.p0.y) + 2 * t * (branch.p2.y - branch.p1.y);
                 const angleDeg = Math.atan2(ty, tx) * (180 / Math.PI);

                 const sideOffset = (bIdx + tIdx) % 2 === 0 ? 90 : -90;
                 const tilt = sideOffset > 0 ? 15 : -15;

                 const age = streak - birthStreak;
                 const growthScale = getGrowthScale(age);
                 const finalScale = growthScale * 0.9;

                 const heightRatio = (startY - y) / (startY - currentY);

                 addLeaf(x, y, angleDeg + sideOffset + tilt, finalScale, 1 + bIdx * 0.2 + tIdx * 0.1, heightRatio);
             }
        });

        const flowerBirthStreak = config.minStreak + 4;

        if (streak >= flowerBirthStreak) {
             const age = streak - flowerBirthStreak;
             const growthScale = getGrowthScale(age);

             const finalScale = 0.2 + (growthScale * 0.7);

             flowers.push({ x: branch.p2.x, y: branch.p2.y, scale: finalScale, delay: 1.5 + bIdx * 0.2 });
        }
    });

    const topFlowerBirth = 4;
    if (streak >= topFlowerBirth) {
        const len = mainPoints.length;
        const age = streak - topFlowerBirth;
        const growthScale = getGrowthScale(age);
        const finalScale = 0.2 + (growthScale * 1.1);

        flowers.push({
            x: mainPoints[len - 2],
            y: mainPoints[len - 1],
            scale: finalScale,
            delay: 2.2
        });
    }

    generatedBranches.forEach((branch, bIdx) => {
        const config = branchConfigs[bIdx];
        const fruitBirthStreak = Math.max(60, config.minStreak + 15);

        if (streak >= fruitBirthStreak) {
            const age = streak - fruitBirthStreak;
            const growthScale = getGrowthScale(age);
            const finalScale = 0.3 + (growthScale * 0.5);

            const t = 0.6;
            const mt = 1 - t;
            const x = (mt * mt * branch.p0.x) + (2 * mt * t * branch.p1.x) + (t * t * branch.p2.x);
            const y = (mt * mt * branch.p0.y) + (2 * mt * t * branch.p1.y) + (t * t * branch.p2.y);

            fruits.push({
                x,
                y: y + 8,
                scale: finalScale,
                delay: 2.5 + bIdx * 0.2
            });
        }
    });

    return { plantPaths: paths, allLeaves: leaves, allFlowers: flowers, allFruits: fruits };
  }, [streak]);

  return (
    <div className="relative w-full h-[400px] flex items-end justify-center overflow-visible">
       {mood === 'Great' && (
        <div className="absolute inset-0 pointer-events-none">
          <Sparkle style={{ top: '20%', left: '10%', animationDelay: '0s' }} color="#D7C9E8" />
          <Sparkle style={{ top: '15%', right: '15%', animationDelay: '1s' }} color="#c5b3df" />
          <Sparkle style={{ top: '40%', left: '80%', animationDelay: '1.5s' }} color="#b39dd6" />
          <Sparkle style={{ top: '60%', left: '20%', animationDelay: '2s' }} color="#e8dff1" />
        </div>
      )}

      <svg viewBox="0 0 200 300" className={`w-full h-full max-w-md drop-shadow-xl filter overflow-visible ${mood === 'Great' ? 'animate-breathe' : ''}`}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" type="saturate" values="1.5" result="saturated" />
            <feMerge>
              <feMergeNode in="saturated" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="wilt-desaturate" x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix type="saturate" values="0.3" />
          </filter>
        </defs>

        <g transform="translate(0, 0)">
           <path d="M65,260 L135,260 L125,295 L75,295 Z" fill={potColor} stroke="#00000020" strokeWidth="1" className="transition-colors duration-1000" />
           <ellipse cx="100" cy="260" rx="35" ry="5" fill="#3f2e21" opacity="0.8" />
        </g>

        {streak > 0 && plantPaths.map((path) => (
             <path
                key={path.id}
                d={path.d}
                stroke={stemColor}
                strokeWidth={path.width}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-1000"
            />
        ))}

        {allLeaves.map((leaf, i) => {
          const droopAmount = mood === 'Rough' ? leaf.heightRatio * 25 : 0;
          const droopRotation = mood === 'Rough' ? leaf.heightRatio * 35 : 0;
          const leafScale = mood === 'Rough' ? leaf.scale * (1 - leaf.heightRatio * 0.2) : leaf.scale;
          const leafFilter = mood === 'Rough' ? 'url(#wilt-desaturate)' : (mood === 'Great' ? 'url(#glow)' : 'none');

          return (
            <g
              key={`leaf-${i}`}
              transform={`translate(${leaf.x}, ${leaf.y + droopAmount}) rotate(${leaf.rotation + droopRotation}) scale(${leafScale})`}
            >
              <g
                className="animate-pop-leaf"
                style={{
                  animationDelay: `${leaf.delay}s`,
                }}
              >
                <path
                  d="M0,0 Q20,-15 40,0 Q20,15 0,0"
                  fill={secondaryFill}
                  stroke={primaryFill}
                  strokeWidth="2"
                  className="transition-colors duration-700"
                  filter={leafFilter}
                  style={{ transition: 'filter 0.7s ease' }}
                />
                <line x1="0" y1="0" x2="30" y2="0" stroke={primaryFill} strokeWidth="1" opacity="0.5" />
              </g>
            </g>
          );
        })}

        {allFlowers.map((flower, i) => {
          const flowerFilter = mood === 'Great' ? 'url(#glow)' : 'none';

          return (
            <g
              key={`flower-${i}`}
              transform={`translate(${flower.x}, ${flower.y}) scale(${flower.scale})`}
            >
              <g
                className="animate-pop-leaf"
                style={{
                  animationDelay: `${flower.delay}s`,
                  transformBox: 'fill-box',
                  transformOrigin: 'center center'
                }}
              >
                {[0, 60, 120, 180, 240, 300].map(angle => (
                  <circle
                    key={angle}
                    cx={Math.cos(angle * Math.PI / 180) * 8}
                    cy={Math.sin(angle * Math.PI / 180) * 8}
                    r="8"
                    fill={primaryFill}
                    className="transition-colors duration-700"
                    filter={flowerFilter}
                    style={{ transition: 'filter 0.7s ease' }}
                  />
                ))}
                <circle cx="0" cy="0" r="5" fill="#fff7ed" />
              </g>
            </g>
          );
        })}

        {allFruits.map((fruit, i) => {
          const fruitColor = mood === 'Rough' ? '#dc8b4a' : '#ef4444';
          const stemColor = '#78350f';

          return (
            <g
              key={`fruit-${i}`}
              transform={`translate(${fruit.x}, ${fruit.y}) scale(${fruit.scale})`}
            >
              <g
                className="animate-pop-leaf"
                style={{
                  animationDelay: `${fruit.delay}s`,
                  transformBox: 'fill-box',
                  transformOrigin: 'center center'
                }}
              >
                <line x1="0" y1="-15" x2="0" y2="-8" stroke={stemColor} strokeWidth="2" strokeLinecap="round" />
                <circle cx="0" cy="0" r="12" fill={fruitColor} className="transition-colors duration-700" />
                <ellipse cx="-3" cy="-3" rx="4" ry="5" fill="#ffffff" opacity="0.4" />
                <circle cx="0" cy="0" r="12" fill="none" stroke="#991b1b" strokeWidth="1" opacity="0.3" />
              </g>
            </g>
          );
        })}

        <g transform="translate(0, 0)">
           <path d="M60,260 L140,260 L140,270 L60,270 Z" fill={potColor} filter="brightness(1.1)" stroke="#00000020" strokeWidth="1" className="transition-colors duration-1000" />
           <ellipse cx="100" cy="295" rx="50" ry="8" fill="black" opacity="0.15" style={{ mixBlendMode: 'multiply' }}/>
        </g>

        {streak === 0 && (
          <g transform="translate(100, 265)" opacity="0.5">
            <text x="0" y="30" textAnchor="middle" fontSize="12" fill="#94a3b8">Ready to grow</text>
          </g>
        )}

      </svg>
    </div>
  );
};

function solve(data: number[]) {
  const size = data.length;
  const last = size - 4;

  let path = "M" + data[0] + "," + data[1];

  for (let i = 0; i < size - 2; i += 2) {
    const x0 = i ? data[i - 2] : data[0];
    const y0 = i ? data[i - 1] : data[1];

    const x1 = data[i + 0];
    const y1 = data[i + 1];

    const x2 = data[i + 2];
    const y2 = data[i + 3];

    const x3 = i !== last ? data[i + 4] : x2;
    const y3 = i !== last ? data[i + 5] : y2;

    const cp1x = (-x0 + 6 * x1 + x2) / 6;
    const cp1y = (-y0 + 6 * y1 + y2) / 6;

    const cp2x = (x1 + 6 * x2 - x3) / 6;
    const cp2y = (y1 + 6 * y2 - y3) / 6;

    path += "C" + cp1x + "," + cp1y + "," + cp2x + "," + cp2y + "," + x2 + "," + y2;
  }

  return path;
}

const Sparkle: React.FC<{ style: React.CSSProperties, color: string }> = ({ style, color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="absolute animate-sparkle" style={style}>
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill={color} />
  </svg>
);

export default Plant;
