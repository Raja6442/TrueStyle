import React, { useEffect, useState } from 'react';

interface RiskMeterProps {
  score: number; // 0 to 100
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to target score
    const duration = 1200; // ms
    const startTime = performance.now();
    
    let animationFrame: number;
    
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      setAnimatedScore(Math.round(easeProgress * score));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [score]);

  // Compute rotation angle for gauge needle (from -90deg to +90deg)
  const rotation = -90 + (animatedScore / 100) * 180;

  // Decide color scheme based on score
  let strokeColor = '#337cff'; // Blue
  let textClass = 'text-cyber-blue-400';
  let labelText = 'SAFE / LOW RISK';
  let labelColor = 'bg-cyber-blue-900/30 text-cyber-blue-400 border-cyber-blue-700/30';

  if (score >= 50) {
    strokeColor = '#ef4444'; // Red
    textClass = 'text-red-500';
    labelText = 'HIGH RISK: POSSIBLE COUNTERFEIT';
    labelColor = 'bg-red-950/30 text-red-400 border-red-900/30';
  } else if (score >= 30) {
    strokeColor = '#f97316'; // Orange
    textClass = 'text-orange-500';
    labelText = 'MODERATE SUSPICION';
    labelColor = 'bg-orange-950/30 text-orange-400 border-orange-900/30';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-cyber-dark-bg border border-cyber-dark-border rounded-xl shadow-inner select-none">
      <div className="relative w-64 h-36 flex items-end justify-center overflow-hidden">
        {/* Arc Background */}
        <svg className="w-56 h-28 transform translate-y-2" viewBox="0 0 100 50">
          {/* Background Track */}
          <path
            d="M 10 45 A 35 35 0 0 1 90 45"
            fill="none"
            stroke="#1f222e"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Filled Arc */}
          <path
            d="M 10 45 A 35 35 0 0 1 90 45"
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="126"
            strokeDashoffset={126 - (animatedScore / 100) * 126}
            style={{ transition: 'stroke-dashoffset 0.1s ease-out, stroke 0.8s ease' }}
          />
        </svg>

        {/* Needle Pin Center */}
        <div className="absolute bottom-0 w-6 h-6 rounded-full bg-white border-4 border-cyber-dark-card shadow-lg z-10"></div>
        
        {/* Needle */}
        <div 
          className="absolute bottom-3 w-2 h-20 origin-bottom rounded-t-full transition-transform duration-100 ease-out"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            background: `linear-gradient(to top, transparent 15%, ${strokeColor} 100%)`
          }}
        ></div>
      </div>

      {/* Stats Display */}
      <div className="mt-4 text-center">
        <span className={`text-3xl font-mono font-bold tracking-tight ${textClass}`}>
          {animatedScore}%
        </span>
        <span className="text-sm font-medium text-gray-400 block mt-1">
          Counterfeit Risk Score
        </span>
        <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${labelColor}`}>
          {labelText}
        </span>
      </div>
    </div>
  );
};
