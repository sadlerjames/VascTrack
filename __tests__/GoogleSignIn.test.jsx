import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GoogleSignIn from '../components/GoogleSignIn';

describe('GoogleSignIn', () => {
  it('renders button and text', () => {
    const { getByText } = render(<GoogleSignIn handlePress={() => {}} />);
    expect(getByText('Sign In with Google')).toBeTruthy();
  });

  it('calls handlePress on press', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<GoogleSignIn handlePress={mockPress} />);
    fireEvent.press(getByText('Sign In with Google'));
    expect(mockPress).toHaveBeenCalled();
  });
});
