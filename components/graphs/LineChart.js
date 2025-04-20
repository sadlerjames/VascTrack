import React from 'react';
import { View } from 'react-native';
import Svg, { Line, Circle, Text, G, Path, Rect } from 'react-native-svg';

const EnergyLineChart = ({ labels, data, width, height = 220 }) => {
  const leftPadding = 45;
  const rightPadding = 30;
  const topPadding = 30;
  const bottomPadding = 20;
  const chartWidth = width - leftPadding - rightPadding;
  const chartHeight = height - topPadding - bottomPadding;
  const extendedHeight = height + 20; // Extra space for X-axis label

  const maxY = 5;
  const minY = 0;

  const points = data.map((val, i) => {
    if (val === null || val === -1) return null;
    const x = (i / (data.length - 1)) * chartWidth + leftPadding;
    const y = ((maxY - val) / (maxY - minY)) * chartHeight + topPadding;
    return { x, y };
  });

  const validPoints = points.filter(Boolean);

  const linePath = validPoints.reduce((path, point, i) => {
    return path + `${i === 0 ? 'M' : 'L'}${point.x},${point.y} `;
  }, '');

  return (
    <View>
      <Svg width={width} height={extendedHeight}>
        {/* Background */}
        <Rect
          x="0"
          y="0"
          width={width}
          height={extendedHeight}
          fill="#f2f2f2"
          rx={10}
        />

        {/* Horizontal grid lines and Y-axis labels */}
        {[...Array(6)].map((_, i) => {
          const y = (chartHeight / 5) * i + topPadding;
          return (
            <G key={`h-${i}`}>
              <Line
                x1={leftPadding}
                y1={y}
                x2={width - rightPadding}
                y2={y}
                stroke="#ccc"
                strokeWidth={1}
                strokeDasharray="4"
              />
              <Text
                x={leftPadding - 8}
                y={y + 4}
                fontSize="10"
                fill="#333"
                textAnchor="end"
              >
                {5 - i}
              </Text>
            </G>
          );
        })}

        {/* Vertical grid lines */}
        {labels.map((_, i) => {
          const x = (i / (labels.length - 1)) * chartWidth + leftPadding;
          return (
            <Line
              key={`v-${i}`}
              x1={x}
              y1={topPadding}
              x2={x}
              y2={topPadding + chartHeight}
              stroke="#ccc"
              strokeWidth={1}
              strokeDasharray="4"
            />
          );
        })}

        {/* X-axis labels */}
        {labels.map((label, i) => {
          const x = (i / (labels.length - 1)) * chartWidth + leftPadding;
          return (
            <Text
              key={`label-${i}`}
              x={x}
              y={topPadding + chartHeight + 15}
              fontSize="10"
              fill="#333"
              textAnchor="middle"
            >
              {label}
            </Text>
          );
        })}

        {/* X-axis label */}
        <Text
          x={width / 2}
          y={extendedHeight - 2}
          fontSize="12"
          fill="#333"
          textAnchor="middle"
          fontWeight="bold"
        >
          Days
        </Text>

        {/* Y-axis label */}
        <Text
          x={12}
          y={topPadding + chartHeight / 2}
          fontSize="12"
          fill="#333"
          textAnchor="middle"
          fontWeight="bold"
          transform={`rotate(-90, 12, ${topPadding + chartHeight / 2})`}
        >
          Energy Level
        </Text>

        {/* Line path */}
        <Path
          d={linePath}
          stroke="#f59e0b"
          strokeWidth="2"
          fill="none"
        />

        {/* Data points */}
        {points.map((point, i) =>
          point ? (
            <Circle
              key={`point-${i}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#f59e0b"
              stroke="#131339"
              strokeWidth="1.5"
            />
          ) : null
        )}
      </Svg>
    </View>
  );
};

export default EnergyLineChart;
