import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import App from 'App';
import Header from 'components/Header';
import selectToolIcon from 'resources/select-tool-icon.svg';
import createToolIcon from 'resources/create-tool-icon.svg';

test('render header', () => {
  const { getByText } = render(<Header />);
  const titleElement = getByText(/Dataset Label/i);
  expect(titleElement).toBeInTheDocument();
});

test('render sidebar icons', () => {
  const { getByTestId } = render(<App />);

  const selectToolElement = getByTestId('select-tool');
  const createToolElement = getByTestId('create-tool');
  expect(selectToolElement).toHaveStyle({ backgroundColor: 'D5D9E2' });
  expect(createToolElement).toHaveStyle({ backgroundColor: 'none' });

  const selectToolIconElement = getByTestId('select-tool-icon');
  const createToolIconElement = getByTestId('create-tool-icon');
  expect(selectToolIconElement).toHaveAttribute('src', selectToolIcon);
  expect(createToolIconElement).toHaveAttribute('src', createToolIcon);
});

describe('click sidebar tools', () => {
  test('click select tool', () => {
    const { getByTestId } = render(<App />);

    const selectTool = getByTestId('select-tool');
    const createTool = getByTestId('create-tool');

    fireEvent.click(createTool);
    expect(selectTool).toHaveStyle({ backgroundColor: 'none' });
    expect(createTool).toHaveStyle({ backgroundColor: 'D5D9E2' });

    fireEvent.click(selectTool);
    expect(selectTool).toHaveStyle({ backgroundColor: 'D5D9E2' });
    expect(createTool).toHaveStyle({ backgroundColor: 'none' });
  });
});
