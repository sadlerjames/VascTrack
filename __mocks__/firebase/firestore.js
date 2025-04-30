// Mock implementation for firebase/firestore
const firestoreMock = {
    // Add any Firestore methods you need to mock
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      exists: true,
      data: () => ({}),
      id: 'mockDocId',
    }),
    set: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true),
    onSnapshot: jest.fn(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };
  
  // Firestore functions
  module.exports = {
    getFirestore: jest.fn(() => firestoreMock),
    collection: jest.fn(() => firestoreMock.collection()),
    doc: jest.fn(() => firestoreMock.doc()),
    getDoc: jest.fn().mockResolvedValue({
      exists: () => true,
      data: () => ({}),
      id: 'mockDocId',
    }),
    getDocs: jest.fn().mockResolvedValue({
      docs: [
        {
          id: 'mockDocId1',
          data: () => ({}),
        },
        {
          id: 'mockDocId2',
          data: () => ({}),
        },
      ],
      forEach: jest.fn(),
    }),
    setDoc: jest.fn().mockResolvedValue(true),
    updateDoc: jest.fn().mockResolvedValue(true),
    deleteDoc: jest.fn().mockResolvedValue(true),
    addDoc: jest.fn().mockResolvedValue({ id: 'newDocId' }),
    onSnapshot: jest.fn(),
    query: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    serverTimestamp: jest.fn(() => 'mockServerTimestamp'),
  };