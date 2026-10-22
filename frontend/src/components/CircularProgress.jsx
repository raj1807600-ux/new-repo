import React from 'react';

const CircularProgress = ({
  percentage = 78,
  size = 180,
  strokeWidth = 14,
  label = "Placement Probability",
  readinessLevel = "Strong"
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color theme based on score
  const getColor = (val) => {
    if (val >= 85) return { stroke: '#10b981', gradient: 'from-emerald-500 to-teal-400', text: 'text-emerald-600', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (val >= 70) return { stroke: '#008080', gradient: 'from-teal-500 to-cyan-500', text: 'text-teal-600', bg: 'bg-teal-50 text-teal-700 border-teal-200' };
    if (val >= 55) return { stroke: '#f59e0b', gradient: 'from-amber-500 to-yellow-400', text: 'text-amber-600', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { stroke: '#ef4444', gradient: 'from-red-500 to-rose-400', text: 'text-red-600', bg: 'bg-red-50 text-red-700 border-red-200' };
  };

  const theme = getColor(percentage);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated gradient progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center text display */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold font-display tracking-tight text-slate-800">
            {Math.round(percentage)}%
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            Probability
          </span>
        </div>
      </div>

      {/* Readiness Badge */}
      <div className="mt-3 flex flex-col items-center text-center">
        <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${theme.bg}`}>
          {readinessLevel} Readiness
        </span>
        <p className="text-[11px] text-slate-500 font-medium mt-1">
          {label}
        </p>
      </div>
    </div>
  );
};

export default CircularProgress;
