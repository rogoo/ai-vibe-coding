import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { getUser, getUsers } from './api/userApi';

jest.mock('./api/userApi');

const mockedGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockedGetUser = getUser as jest.MockedFunction<typeof getUser>;

function renderAppAt(path: string) {
  window.history.pushState({}, '', path);

  return render(<App />);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedGetUsers.mockResolvedValue([{ id: 1, name: 'Rodrigo', email: 'rodrigo@gmail.com' }]);
  mockedGetUser.mockResolvedValue({ id: 1, name: 'Rodrigo', email: 'rodrigo@gmail.com' });
});

describe('App routing', () => {
  it('always renders the header', () => {
    renderAppAt('/about');

    expect(screen.getByText('User Manager')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'User' })).toBeInTheDocument();
  });

  it('redirects the root path to the about page', () => {
    renderAppAt('/');

    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/about');
  });

  it('redirects an unknown path to the about page', () => {
    renderAppAt('/does-not-exist');

    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/about');
  });

  it('renders the about page on /about', () => {
    renderAppAt('/about');

    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
  });

  it('renders the user list on /users', async () => {
    renderAppAt('/users');

    expect(await screen.findByRole('heading', { level: 1, name: 'Users' })).toBeInTheDocument();
    expect(mockedGetUsers).toHaveBeenCalled();
  });

  it('renders an empty user form on /users/new', () => {
    renderAppAt('/users/new');

    expect(screen.getByRole('heading', { level: 1, name: 'New user' })).toBeInTheDocument();
    expect(mockedGetUser).not.toHaveBeenCalled();
  });

  it('renders the edit form on /users/:id/edit', async () => {
    renderAppAt('/users/1/edit');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Edit user #1' }),
    ).toBeInTheDocument();
    expect(mockedGetUser).toHaveBeenCalledWith(1);
  });

  it('navigates from about to the user list through the header', async () => {
    renderAppAt('/about');

    fireEvent.click(screen.getByRole('link', { name: 'User' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Users' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: 'About' })).not.toBeInTheDocument();
  });

  it('navigates from the user list back to about through the header', async () => {
    renderAppAt('/users');
    await screen.findByRole('heading', { level: 1, name: 'Users' });

    fireEvent.click(screen.getByRole('link', { name: 'About' }));

    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
  });
});
