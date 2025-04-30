module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
      "module:metro-react-native-babel-preset",
      "@babel/preset-env",
    ],
    plugins: [
      ["module:react-native-dotenv"],
    ],
  };
};
