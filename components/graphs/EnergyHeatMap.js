import React from 'react';
import { View, Text } from 'react-native';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6am to 11pm

// Calculate average energy level per hour each day
export const processEnergyData = (energyRecords) => {
    const heatmapData = {};
    const counts = {};

    // Initalise array with 0
    for (let hour = 6; hour <= 23; hour++) {
        heatmapData[hour] = {};
        counts[hour] = {};
        for (const day of DAYS) {
        heatmapData[hour][day] = 0;
        counts[hour][day] = 0;
        }
    }

    // Get energy level and day+time from each record
    energyRecords.forEach((record) => {
        const date = record.recordedAt?.toDate?.() || new Date(record.recordedAt);
        const day = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Update to use index in DAYS
        const hour = date.getHours();

        // Add energy level to sum
        if (hour >= 6 && hour <= 23) {
            heatmapData[hour][day] += record.energyLevel;
            counts[hour][day] += 1;
        }
    });

    // Calculate averages for each hour
    for (let hour = 6; hour <= 23; hour++) {
        for (const day of DAYS) {
            const count = counts[hour][day];
            heatmapData[hour][day] = count > 0 ? heatmapData[hour][day] / count : null;
        }
    }

    return heatmapData;
};  

const EnergyHeatMap = ({ records }) => {

    const data = processEnergyData(records);


  return (
    <View>
        <Text className="font-plight text-lg pb-3 text-center">See when you usually have the most or least energy. This heat map averages your energy levels by hour and day.</Text>
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

        <View className="mt-2">
            <Text className="font-pbold text-lg">Key</Text>
        </View>

        {/* Key - Boxes */}
        <View className="mt-1 flex flex-row items-center flex-nowrap gap-2">
            {/* Red */}
            <View
                className="flex-1 flex-grow h-7 rounded"
                style={{ backgroundColor: '#FF0000' }}
            />

            {/* Orange-Red */}
            <View
                className="flex-1 flex-grow h-7 rounded"
                style={{ backgroundColor: '#FF4500' }}
            />

            {/* Yellow-Orange */}
            <View
                className="flex-1 flex-grow h-7 rounded"
                style={{ backgroundColor: '#FFA500' }}
            />

            {/* Yellow */}
            <View
                className="flex-1 flex-grow h-7 rounded"
                style={{ backgroundColor: '#FFFF00' }}
            />

            {/* Yellow-Green */}
            <View
                className="flex-1 flex-grow h-7 rounded"
                style={{ backgroundColor: '#ADFF2F' }}
            />
    
            {/* Green */}
            <View
                className="flex-1 flex-grow h-7 rounded"
                style={{ backgroundColor: '#008000' }}
            />

        </View>

        {/* Key - Number */}
        <View className="mt-1 flex flex-row items-center flex-nowrap gap-2 text-center">
            <View className="flex-1 flex-grow">
                <Text className="font-pbold text-lg text-center">0</Text>
            </View>

            <View className="flex-1 flex-grow">
                <Text className="font-pbold text-lg text-center">1</Text>
            </View>

            <View className="flex-1 flex-grow">
                <Text className="font-pbold text-lg text-center">2</Text>
            </View>

            <View className="flex-1 flex-grow">
                <Text className="font-pbold text-lg text-center">3</Text>
            </View>

            <View className="flex-1 flex-grow">
                <Text className="font-pbold text-lg text-center">4</Text>
            </View>

            <View className="flex-1 flex-grow">
                <Text className="font-pbold text-lg text-center">5</Text>
            </View>
            
        </View>

        {/* Key - Labels */}
        <View className="mt-1 flex flex-row items-center flex-nowrap gap-2 text-center">
            <View className="flex-1 flex-grow">
                <Text className="font-pregular text-xs text-center">No Energy</Text>
            </View>

            <View className="flex-1 flex-grow"></View>
            <View className="flex-1 flex-grow"></View>
            <View className="flex-1 flex-grow"></View>
            <View className="flex-1 flex-grow"></View>

            <View className="flex-1 flex-grow">
                <Text className="font-pregular text-xs text-center">High Energy</Text>
            </View>

        </View>

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
    '#FF0000', // 0 - Red
    '#FF4500', // 1 - Orange-Red
    '#FFA500', // 2 - Yellow-Orange
    '#FFFF00', // 3 - Yellow
    '#ADFF2F', // 4 - Yellow-Green
    '#008000', // 5 - Green
  ];
  return colors[Math.round(level)]; // Round to the nearest integer
};

export default EnergyHeatMap;