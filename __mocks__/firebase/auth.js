// Mock implementation for firebase/auth
const auth = {
  // Add any auth methods you need to mock
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { uid: 'test-uid', email: 'test@example.com' }
  }),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { uid: 'test-uid', email: 'test@example.com' }
  }),
  signOut: jest.fn().mockResolvedValue(true),
  onAuthStateChanged: jest.fn(),
  currentUser: { uid: 'test-uid', email: 'test@example.com' },
};

// Create and export all the functions you use from firebase/auth
module.exports = {
  getAuth: jest.fn(() => auth),
  // Add the functions used in your FirebaseConfig.js
  initializeAuth: jest.fn(() => auth),
  getReactNativePersistence: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { uid: 'test-uid', email: 'test@example.com' }
  }),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { uid: 'test-uid', email: 'test@example.com' }
  }),
  signOut: jest.fn().mockResolvedValue(true),
  onAuthStateChanged: jest.fn(),
};