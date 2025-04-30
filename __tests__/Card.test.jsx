import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import Card from '../components/Card';

describe('Card', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Card><Text>Test Content</Text></Card>);
    expect(getByText('Test Content')).toBeTruthy();
  });
});
