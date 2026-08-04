import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

function renderHeader(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Header />
    </MemoryRouter>,
  );
}

describe('Header', () => {
  it('renders the brand', () => {
    renderHeader('/about');

    expect(screen.getByText('User Manager')).toBeInTheDocument();
  });

  it('renders both navigation links with their targets', () => {
    renderHeader('/about');

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'User' })).toHaveAttribute('href', '/users');
  });

  it('marks the About link as active on the about route', () => {
    renderHeader('/about');

    expect(screen.getByRole('link', { name: 'About' })).toHaveClass(
      'header-link',
      'header-link-active',
    );
    expect(screen.getByRole('link', { name: 'User' })).toHaveClass('header-link');
    expect(screen.getByRole('link', { name: 'User' })).not.toHaveClass('header-link-active');
  });

  it('marks the User link as active on the users route', () => {
    renderHeader('/users');

    expect(screen.getByRole('link', { name: 'User' })).toHaveClass(
      'header-link',
      'header-link-active',
    );
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveClass('header-link-active');
  });

  it('keeps the User link active on nested user routes', () => {
    renderHeader('/users/1/edit');

    expect(screen.getByRole('link', { name: 'User' })).toHaveClass('header-link-active');
  });
});
