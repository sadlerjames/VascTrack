export const createURL = jest.fn(() => 'mocked-url');
export const parse = jest.fn(() => ({}));
export const openURL = jest.fn();
export const addEventListener = jest.fn(() => ({ remove: jest.fn() }));
export const removeEventListener = jest.fn();
export const getInitialURL = jest.fn(() => Promise.resolve('mocked-url'));
