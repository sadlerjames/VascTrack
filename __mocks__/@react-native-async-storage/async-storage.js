// Mock implementation for AsyncStorage
let storage = {};

const AsyncStorage = {
  setItem: jest.fn((key, value) => {
    return new Promise((resolve) => {
      storage[key] = value;
      resolve(null);
    });
  }),
  getItem: jest.fn((key) => {
    return new Promise((resolve) => {
      resolve(storage[key] || null);
    });
  }),
  removeItem: jest.fn((key) => {
    return new Promise((resolve) => {
      delete storage[key];
      resolve(null);
    });
  }),
  clear: jest.fn(() => {
    return new Promise((resolve) => {
      storage = {};
      resolve(null);
    });
  }),
  getAllKeys: jest.fn(() => {
    return new Promise((resolve) => {
      resolve(Object.keys(storage));
    });
  }),
};

export default AsyncStorage;