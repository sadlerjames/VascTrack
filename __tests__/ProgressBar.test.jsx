import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProgressBar from '../components/ProgressBar';

describe('ProgressBar', () => {
  it('renders labels and buttons', () => {
    const { getByText } = render(<ProgressBar selected={3} setSelected={() => {}} />);
    expect(getByText('No\nImpact')).toBeTruthy();
    expect(getByText('Severe\nImpact')).toBeTruthy();
    expect(getByText('2')).toBeTruthy(); // 3rd button (index 2)
  });

  it('calls setSelected on button press', () => {
    const mockSetSelected = jest.fn();
    const { getByText } = render(<ProgressBar selected={2} setSelected={mockSetSelected} />);
    fireEvent.press(getByText('3'));
    expect(mockSetSelected).toHaveBeenCalledWith(4);
  });
});
