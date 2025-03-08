// ProgressBar.js
import React from "react";
import { View, Text, Pressable } from "react-native";

const ProgressBar = ({ selected, setSelected }) => {
  const options = [0, 1, 2, 3, 4, 5];

  return (
    <>
      <View className="py-5">
        {/* Bar */}
        <View className="w-full h-6 bg-gray-300 rounded-full overflow-hidden">
          <View
            className="h-full bg-quaternary"
            style={{ width: `${(selected - 1) / (options.length - 1) * 100}%` }}
          />
        </View>
        
        {/* Buttons and Labels */}
        <View className="w-full flex-row justify-between py-3">
        {options.map((option) => (
          <View key={option} className="items-center">
            {/* Button */}
            <Pressable
              onPress={() => setSelected(option)}
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                selected === option ? "bg-quaternary" : "bg-gray-300"
              }`}
            >
              <Text className="text-white font-semibold">{option}</Text>
            </Pressable>

            {/* Label for edge cases */}
            {option === 0 && (
              <Text className="mt-2 text-gray-600">No Impact</Text>
            )}

            {option === 5 && (
              <Text className="mt-2 text-gray-600">Severe Impact</Text>
            )}

          </View>
        ))}
        </View>
      </View>
    </>
    
  );
};

export default ProgressBar;
