import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FormField from '../components/FormField';

describe('FormField', () => {
  it('renders title and placeholder', () => {
    const { getByText, getByPlaceholderText } = render(
      <FormField title="Email" placeholder="Enter email" value="" handleChangeText={() => {}} />
    );
    expect(getByText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Enter email')).toBeTruthy();
  });

  it('calls handleChangeText on input', () => {
    const mockChange = jest.fn();
    const { getByPlaceholderText } = render(
      <FormField title="Email" placeholder="Enter email" value="" handleChangeText={mockChange} />
    );
    fireEvent.changeText(getByPlaceholderText('Enter email'), 'test@example.com');
    expect(mockChange).toHaveBeenCalledWith('test@example.com');
  });
});
