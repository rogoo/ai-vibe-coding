import { fireEvent, render, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { deleteUser, getUsers } from '../api/userApi';
import { User } from '../types/user';
import UserList from './UserList';

jest.mock('../api/userApi');

const mockedGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockedDeleteUser = deleteUser as jest.MockedFunction<typeof deleteUser>;

const users: User[] = [
  { id: 1, name: 'Rodrigo', email: 'rodrigo@gmail.com' },
  { id: 2, name: 'Ana', email: 'ana@example.com' },
  { id: 3, name: 'Bruno', email: 'bruno@gmail.com' },
];

function renderUserList() {
  return render(
    <MemoryRouter>
      <UserList />
    </MemoryRouter>,
  );
}

async function renderLoadedUserList() {
  renderUserList();
  await waitForElementToBeRemoved(() => screen.queryByText('Loading users…'));
}

function getRowNames() {
  const rows = screen.getAllByRole('row').slice(1); // drop the header row

  return rows
    .map((row) => within(row).getAllByRole('cell')[1]?.textContent)
    .filter((name): name is string => name !== undefined);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedGetUsers.mockResolvedValue(users);
  mockedDeleteUser.mockResolvedValue(undefined);
});

describe('UserList', () => {
  it('shows the loading message while the users are being fetched', async () => {
    renderUserList();

    expect(screen.getByText('Loading users…')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    expect(await screen.findByRole('table')).toBeInTheDocument();
  });

  it('renders the heading and the link to create a user', async () => {
    await renderLoadedUserList();

    expect(screen.getByRole('heading', { level: 1, name: 'Users' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'New user' })).toHaveAttribute('href', '/users/new');
  });

  it('renders one row per user with its id, name and email', async () => {
    await renderLoadedUserList();

    expect(getRowNames()).toEqual(['Rodrigo', 'Ana', 'Bruno']);
    expect(screen.getByText('rodrigo@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
  });

  it('links every row to its edit page', async () => {
    await renderLoadedUserList();

    const editLinks = screen.getAllByRole('link', { name: 'Edit' });

    expect(editLinks[0]).toHaveAttribute('href', '/users/1/edit');
    expect(editLinks[1]).toHaveAttribute('href', '/users/2/edit');
  });

  it('shows an empty message when the backend returns no users', async () => {
    mockedGetUsers.mockResolvedValue([]);
    await renderLoadedUserList();

    expect(screen.getByText('No users yet.')).toBeInTheDocument();
  });

  it('shows the error message and hides the table when loading fails', async () => {
    mockedGetUsers.mockRejectedValue(new Error('Backend is down'));
    await renderLoadedUserList();

    expect(screen.getByText('Backend is down')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('filters the list by name, ignoring case and surrounding spaces', async () => {
    await renderLoadedUserList();

    fireEvent.change(screen.getByLabelText('Filter by name'), { target: { value: '  aNa ' } });

    expect(getRowNames()).toEqual(['Ana']);
  });

  it('filters the list by email', async () => {
    await renderLoadedUserList();

    fireEvent.change(screen.getByLabelText('Filter by email'), { target: { value: '@gmail.com' } });

    expect(getRowNames()).toEqual(['Rodrigo', 'Bruno']);
  });

  it('combines both filters', async () => {
    await renderLoadedUserList();

    fireEvent.change(screen.getByLabelText('Filter by name'), { target: { value: 'o' } });
    fireEvent.change(screen.getByLabelText('Filter by email'), { target: { value: '@gmail.com' } });

    expect(getRowNames()).toEqual(['Rodrigo', 'Bruno']);
  });

  it('shows a dedicated message when no user matches the filters', async () => {
    await renderLoadedUserList();

    fireEvent.change(screen.getByLabelText('Filter by name'), { target: { value: 'zzz' } });

    expect(screen.getByText('No users match the filters.')).toBeInTheDocument();
    expect(screen.queryByText('No users yet.')).not.toBeInTheDocument();
  });

  it('clears both filters when Clear is pressed', async () => {
    await renderLoadedUserList();

    const nameFilter = screen.getByLabelText('Filter by name');
    const emailFilter = screen.getByLabelText('Filter by email');
    fireEvent.change(nameFilter, { target: { value: 'Ana' } });
    fireEvent.change(emailFilter, { target: { value: 'example' } });

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(nameFilter).toHaveValue('');
    expect(emailFilter).toHaveValue('');
    expect(getRowNames()).toEqual(['Rodrigo', 'Ana', 'Bruno']);
  });

  it('fetches the users again when Reload is pressed', async () => {
    await renderLoadedUserList();
    expect(mockedGetUsers).toHaveBeenCalledTimes(1);

    mockedGetUsers.mockResolvedValue([{ id: 9, name: 'Carla', email: 'carla@example.com' }]);
    fireEvent.click(screen.getByRole('button', { name: 'Reload' }));

    expect(await screen.findByText('Carla')).toBeInTheDocument();
    expect(mockedGetUsers).toHaveBeenCalledTimes(2);
    expect(screen.queryByText('Rodrigo')).not.toBeInTheDocument();
  });

  describe('delete', () => {
    let confirmSpy: jest.SpyInstance<boolean, [message?: string]>;

    beforeEach(() => {
      confirmSpy = jest.spyOn(window, 'confirm');
    });

    afterEach(() => {
      confirmSpy.mockRestore();
    });

    it('asks for confirmation and removes the row once the request succeeds', async () => {
      confirmSpy.mockReturnValue(true);
      await renderLoadedUserList();

      fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[1]);

      expect(confirmSpy).toHaveBeenCalledWith('Delete user "Ana"?');
      expect(mockedDeleteUser).toHaveBeenCalledWith(2);
      await waitForElementToBeRemoved(() => screen.queryByText('Ana'));
      expect(getRowNames()).toEqual(['Rodrigo', 'Bruno']);
    });

    it('does nothing when the confirmation is dismissed', async () => {
      confirmSpy.mockReturnValue(false);
      await renderLoadedUserList();

      fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

      expect(mockedDeleteUser).not.toHaveBeenCalled();
      expect(getRowNames()).toEqual(['Rodrigo', 'Ana', 'Bruno']);
    });

    it('shows the error when the request fails', async () => {
      confirmSpy.mockReturnValue(true);
      mockedDeleteUser.mockRejectedValue(new Error('User is referenced elsewhere'));
      await renderLoadedUserList();

      fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

      expect(await screen.findByText('User is referenced elsewhere')).toBeInTheDocument();
    });

    // The table is rendered behind `!loading && !error`, so a failed delete hides
    // the whole list instead of just reporting the failure on the row.
    it('hides the whole table when the request fails', async () => {
      confirmSpy.mockReturnValue(true);
      mockedDeleteUser.mockRejectedValue(new Error('User is referenced elsewhere'));
      await renderLoadedUserList();

      fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

      await screen.findByText('User is referenced elsewhere');
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(screen.queryByText('Rodrigo')).not.toBeInTheDocument();
    });
  });
});
