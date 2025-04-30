module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@react-navigation|firebase|expo-router|expo-linking|expo-modules-core|expo-constants|expo|@expo|@unimodules)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^firebase$': '<rootDir>/__mocks__/firebase.js',
    '^firebase/(.*)$': '<rootDir>/__mocks__/firebase/$1.js',
    '^expo-modules-core$': '<rootDir>/__mocks__/expo-modules-core.js',
    '^expo-constants$': '<rootDir>/__mocks__/expo-constants.js',
    '^expo-linking$': '<rootDir>/__mocks__/expo-linking.js',
  },
};