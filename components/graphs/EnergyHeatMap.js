import React from 'react';
import { View, Text } from 'react-native';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6am to 11pm

const EnergyHeatMap = ({ data }) => {
  return (
    <View>
      {/* Day labels */}
      <View className="flex-row items-center">
        {/* Empty space for hour label column */}
        <Text className="w-11 text-xs text-right mr-1 text-gray-700"></Text>
        
        {/* Day labels */}
        {DAYS.map(day => (
          <Text
            key={day}
            className="w-9 text-xs text-center mx-0.5 text-gray-900"
          >
            {day}
          </Text>
        ))}
      </View>
      
      {/* Rows for each hour */}
      {HOURS.map(hour => (
        <View key={hour} className="flex-row items-center">
          {/* Hour label */}
          <Text className="w-11 text-xs text-right mr-1 text-gray-700">
            {formatHour(hour)}
          </Text>
          
          {/* Cells */}
          {DAYS.map(day => {
            const level = data?.[hour]?.[day] ?? null;
            const bgColor = level !== null ? getColorForEnergy(level) : '#e5e7eb'; // gray-200
            return (
              <View
                key={`${hour}-${day}`}
                className="w-9 h-7 mb-0.5 mx-0.5 rounded"
                style={{ backgroundColor: bgColor }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

// Convert 24h format to 12h (e.g., 6 → 6AM, 15 → 3PM)
const formatHour = (hour) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const formatted = hour % 12 === 0 ? 12 : hour % 12;
  return `${formatted}${period}`;
};

const getColorForEnergy = (level) => {
  const colors = [
    '#d1d5db', // 0 - gray-300
    '#fde68a', // 1 - yellow-300
    '#facc15', // 2 - yellow-400
    '#fbbf24', // 3 - amber-400
    '#f59e0b', // 4 - amber-500
    '#d97706', // 5 - amber-600
  ];
  return colors[Math.round(level)];
};

export default EnergyHeatMap;