import { render, screen } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('renders the page heading', () => {
    render(<About />);

    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
  });

  it('shows the API endpoint used by the application', () => {
    render(<About />);

    expect(screen.getByText('http://localhost:8080/api/user')).toBeInTheDocument();
  });

  it('describes the three fields of a user', () => {
    render(<About />);

    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
  });
});
