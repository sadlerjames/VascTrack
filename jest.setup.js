jest.mock('expo', () => require('./__mocks__/expo'));

jest.mock('expo-router', () => ({
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    }),
  }));  

  jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'ios',
    select: (objs) => objs['ios'],
  }));

  // Mock Firebase modules
jest.mock('firebase/app', () => require('./__mocks__/firebase/app'));
jest.mock('firebase/auth', () => require('./__mocks__/firebase/auth'));
jest.mock('firebase/firestore', () => require('./__mocks__/firebase/firestore'));
jest.mock('firebase', () => require('./__mocks__/firebase'));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => require('./__mocks__/@react-native-async-storage/async-storage'));
