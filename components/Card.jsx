import React from "react";
import { View } from "react-native";

const Card = ({ children }) => {
  return (
    <View className="w-11/12 bg-primary p-6 rounded-2xl shadow-sm shadow-primary mb-4">
        {children}
    </View>
  )
};

export default Card;