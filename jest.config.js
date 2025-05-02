module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transformIgnorePatterns: [
      'node_modules/(?!((jest-)?react-native|@react-native|react-clone-referenced-element|@react-navigation|firebase|expo-router))',
    ],
    testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    },
  };