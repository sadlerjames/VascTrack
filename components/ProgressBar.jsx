// ProgressBar.js
import React from "react";
import { View, Text, Pressable } from "react-native";

const ProgressBar = ({ selected, setSelected, containerStyle }) => {
  const options = [1, 2, 3, 4, 5, 6];

  return (
    <>
      <View className={`items-center ${containerStyle}`}>
        {/* Bar */}
        <View className="w-11/12 h-6 bg-gray-300 rounded-full overflow-hidden">
          <View
            className="h-full bg-quaternary"
            style={{ width: `${(selected - 1) / (options.length - 1) * 100}%` }}
          />
        </View>
        
        {/* Buttons and Labels */}
        <View className="w-11/12 flex-row justify-between pt-3">
        {options.map((option) => (
          <View key={option} className="items-center">
            {/* Button */}
            <Pressable
              onPress={() => setSelected(option)}
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                selected === option ? "bg-quaternary" : "bg-gray-300"
              }`}
            >
              <Text className="text-white font-semibold">{option - 1}</Text>
            </Pressable>
          </View>
        ))}
        </View>

        <View className="w-full flex-row justify-between pt-2">
          <Text className=" text-gray-600 font-plight text-center">None</Text>
          <Text className=" text-gray-600 font-plight text-center">Lots</Text>

        </View>
      </View>
    </>
    
  );
};

export default ProgressBar;
