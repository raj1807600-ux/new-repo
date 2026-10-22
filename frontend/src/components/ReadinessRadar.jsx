import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const ReadinessRadar = ({ subscores = {} }) => {
  const data = [
    { subject: 'Academic (CGPA)', score: subscores.academic || 78, fullMark: 100 },
    { subject: 'Technical CS', score: subscores.technical || 75, fullMark: 100 },
    { subject: 'Coding / DSA', score: subscores.coding || 70, fullMark: 100 },
    { subject: 'Communication', score: subscores.communication || 80, fullMark: 100 },
    { subject: 'Projects', score: subscores.projects || 85, fullMark: 100 },
    { subject: 'Internships', score: subscores.internships || 60, fullMark: 100 },
    { subject: 'Certifications', score: subscores.certifications || 55, fullMark: 100 },
    { subject: 'Resume ATS', score: subscores.resume || 82, fullMark: 100 },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#94a3b8', fontSize: 9 }}
          />
          <Radar
            name="Readiness Dimension"
            dataKey="score"
            stroke="#008080"
            fill="#008080"
            fillOpacity={0.4}
          />
          <Tooltip
            formatter={(value) => [`${value}/100`, 'Competency Score']}
            contentStyle={{
              backgroundColor: '#0b192c',
              borderColor: '#1e3e62',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReadinessRadar;
