import React from 'react';
import { fireEvent, waitFor, render } from '@testing-library/react-native';
// Import this conditionally so we can mock it in the setup file
let withExpoRouter;
try {
  // Attempt to import, but will use mocks if import fails
  withExpoRouter = require('expo-router/testing-library').withExpoRouter;
} catch (error) {
  // Provide a fallback if import fails
  withExpoRouter = Component => props => <Component {...props} />;
}
import '../context/GlobalProvider';
// Adjust this path if needed depending on where your app root is
import SignIn from '../app/(auth)/sign-in';
import { router } from 'expo-router';

// Mock authentication and context
jest.mock('../lib/authentication', () => ({
  signIn: jest.fn().mockResolvedValue(true),
  getCurrentUser: jest.fn().mockResolvedValue({ uid: 'test-uid', email: 'test@example.com' }),
}));

jest.mock('../context/GlobalProvider', () => {
  const actual = jest.requireActual('../context/GlobalProvider');
  return {
    ...actual,
    useGlobalContext: () => ({
      setUser: jest.fn(),
      setisLoggedIn: jest.fn(),
    }),
  };
});

describe('SignIn screen', () => {
  it('signs in and redirects to /home', async () => {
    const { getByText, getByPlaceholderText } = render(<SignIn />, {
      wrapper: withExpoRouter,
    });
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/home');
    });
  });
});