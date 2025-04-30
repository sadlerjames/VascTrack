import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomDropdown from '../components/CustomDropdown';

describe('CustomDropdown', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <CustomDropdown
        value=""
        setValue={() => {}}
        isFocus={false}
        setIsFocus={() => {}}
        data={[{ label: 'Option A', value: 'a' }]}
        placeholder="Select"
        searchPlaceholder="Search"
      />
    );
    expect(getByText('Select')).toBeTruthy();
  });
});
