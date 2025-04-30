// Mock for FirebaseConfig.js
const auth = {
    signOut: jest.fn().mockResolvedValue(true),
    currentUser: { uid: 'test-uid', email: 'test@example.com' },
  };
  
  const db = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      exists: true,
      data: () => ({}),
    }),
  };
  
  module.exports = {
    auth,
    db,
  };