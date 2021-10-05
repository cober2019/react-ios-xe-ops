import { render, screen } from '@testing-library/react';
import App from './App';

test('xeops', () => {
  render(<App />);
  const linkElement = screen.getByText(/reactxeops/i);
  expect(linkElement).toBeInTheDocument();
});
