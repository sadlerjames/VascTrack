import { View, Text, Dimensions, Image } from "react-native";
import Svg, { Path } from "react-native-svg";

import images from "../constants/images";

const { width, height } = Dimensions.get("window");
const dynamicMarginTop = -height * 0.04;

const WaveHeader = () => {
  return (
    <View>
      {/* Header Content */}
      <View className="justify-between items-start flex-row" style={{ backgroundColor: "#ADE2FF", padding: 20 }}>
        <View>
          <Text className="font-pmedium text-m">Welcome back</Text>
          <Text className="font-psemibold text-3xl">James</Text>
        </View>

        <View className="mt-2 mr-8">
          <Image 
            source={images.logo}
            className="w-16 h-12"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Wavy SVG */}
      <Svg height="100" width="100%" viewBox="0 0 393 52" style={{ marginTop: dynamicMarginTop }}>
        <Path
          fill="#ADE2FF"
          d="M65.5 11.5C37.3653 11.5 0 31.5 0 31.5V0H214.5H393V31.5C393 31.5 355.635 11.5 327.5 11.5C299.365 11.5 262 31.5 262 31.5C262 31.5 224.635 51.5 196.5 51.5C168.365 51.5 131 31.5 131 31.5C131 31.5 93.6347 11.5 65.5 11.5Z"
        />
      </Svg>

      
    </View>
  );
};

export default WaveHeader;

<View className="my-6 px-4 space-y-6">
<View className="justify-between items-start flex-row mb-6">
  <View>
    <Text>
      Welcome Back
    </Text>
    <Text>
      James
    </Text>
  </View>
</View>
</View>
