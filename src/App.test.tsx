import React from 'react';
import { render } from '@testing-library/react';
import Header from 'components/Header';

test('render header', () => {
  const { getByText } = render(<Header />);
  const titleElement = getByText(/Dataset Label/i);
  expect(titleElement).toBeInTheDocument();
});
