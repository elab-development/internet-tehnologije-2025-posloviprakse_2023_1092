/* global describe, it, expect, test */
import { render, screen } from '@testing-library/react';
import { describe, it, test, expect } from 'vitest';
import App from './App';

test('renders Jobzee app main heading', () => {
  render(<App />);
  const heading = screen.getByText(/jobzee/i);
  expect(heading).toBeInTheDocument();
});
