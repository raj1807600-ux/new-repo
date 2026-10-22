import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

const TrajectoryChart = ({ trajectoryData = [] }) => {
  if (!trajectoryData || trajectoryData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No semester SGPA records available to compute trajectory.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trajectoryData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="semester"
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis
            domain={[4.0, 10.0]}
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickCount={7}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0b192c',
              borderColor: '#1e3e62',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '11px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

          {/* Actual Historic SGPA Line */}
          <Line
            type="monotone"
            dataKey="actual_sgpa"
            name="Actual SGPA"
            stroke="#0b192c"
            strokeWidth={3}
            dot={{ r: 4, fill: '#0b192c' }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />

          {/* Best-Case Projection */}
          <Line
            type="monotone"
            dataKey="best_case_trajectory"
            name="Best-Case Sprint (Target)"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: '#10b981' }}
            connectNulls
          />

          {/* Expected Trajectory */}
          <Line
            type="monotone"
            dataKey="expected_trajectory"
            name="Expected Projection"
            stroke="#008080"
            strokeWidth={2}
            strokeDasharray="2 2"
            dot={{ r: 3, fill: '#008080' }}
            connectNulls
          />

          {/* Conservative Trajectory */}
          <Line
            type="monotone"
            dataKey="conservative_trajectory"
            name="Conservative Estimate"
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={{ r: 2, fill: '#f59e0b' }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrajectoryChart;
