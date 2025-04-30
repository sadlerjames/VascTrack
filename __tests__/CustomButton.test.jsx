import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../components/CustomButton';

describe('CustomButton', () => {
  it('renders title correctly', () => {
    const { getByText } = render(<CustomButton title="Click Me" handlePress={() => {}} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls handlePress on press', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<CustomButton title="Click" handlePress={mockPress} />);
    fireEvent.press(getByText('Click'));
    expect(mockPress).toHaveBeenCalled();
  });

});
