import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createUser, getUser, updateUser } from '../api/userApi';
import UserForm from './UserForm';

jest.mock('../api/userApi');

const mockedGetUser = getUser as jest.MockedFunction<typeof getUser>;
const mockedCreateUser = createUser as jest.MockedFunction<typeof createUser>;
const mockedUpdateUser = updateUser as jest.MockedFunction<typeof updateUser>;

const LIST_PAGE_TEXT = 'user list page';

function renderUserForm(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/users" element={<p>{LIST_PAGE_TEXT}</p>} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/:id/edit" element={<UserForm />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function renderEditForm(id = 7) {
  renderUserForm(`/users/${id}/edit`);
  await waitForElementToBeRemoved(() => screen.queryByText('Loading user…'));
}

function fillForm(name: string, email: string) {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: name } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedGetUser.mockResolvedValue({ id: 7, name: 'Rodrigo', email: 'rodrigo@gmail.com' });
  mockedCreateUser.mockResolvedValue({ id: 10, name: 'Ana', email: 'ana@example.com' });
  mockedUpdateUser.mockResolvedValue({ id: 7, name: 'Ana', email: 'ana@example.com' });
});

describe('UserForm in create mode', () => {
  it('renders the create heading and an empty form', () => {
    renderUserForm('/users/new');

    expect(screen.getByRole('heading', { level: 1, name: 'New user' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Email')).toHaveValue('');
  });

  it('does not fetch a user', () => {
    renderUserForm('/users/new');

    expect(mockedGetUser).not.toHaveBeenCalled();
    expect(screen.queryByText('Loading user…')).not.toBeInTheDocument();
  });

  it('creates the user with trimmed values and goes back to the list', async () => {
    renderUserForm('/users/new');

    fillForm('  Ana  ', '  ana@example.com  ');
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockedCreateUser).toHaveBeenCalledWith({ name: 'Ana', email: 'ana@example.com' });
    expect(mockedUpdateUser).not.toHaveBeenCalled();
    expect(await screen.findByText(LIST_PAGE_TEXT)).toBeInTheDocument();
  });

  it('disables the submit button and shows a saving label while the request is pending', async () => {
    let resolveCreate: () => void = () => undefined;
    mockedCreateUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCreate = () => resolve({ id: 10, name: 'Ana', email: 'ana@example.com' });
        }),
    );
    renderUserForm('/users/new');

    fillForm('Ana', 'ana@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    const savingButton = screen.getByRole('button', { name: 'Saving…' });
    expect(savingButton).toBeDisabled();

    resolveCreate();
    expect(await screen.findByText(LIST_PAGE_TEXT)).toBeInTheDocument();
  });

  it('shows the error and stays on the form when creating fails', async () => {
    mockedCreateUser.mockRejectedValue(new Error('Email already taken'));
    renderUserForm('/users/new');

    fillForm('Ana', 'ana@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Email already taken')).toBeInTheDocument();
    expect(screen.queryByText(LIST_PAGE_TEXT)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('goes back to the list without saving when Cancel is pressed', async () => {
    renderUserForm('/users/new');

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(await screen.findByText(LIST_PAGE_TEXT)).toBeInTheDocument();
    expect(mockedCreateUser).not.toHaveBeenCalled();
  });
});

describe('UserForm in edit mode', () => {
  it('shows the loading message while the user is being fetched', async () => {
    renderUserForm('/users/7/edit');

    expect(screen.getByText('Loading user…')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();

    expect(await screen.findByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders the edit heading with the id and prefills the form', async () => {
    await renderEditForm();

    expect(mockedGetUser).toHaveBeenCalledWith(7);
    expect(screen.getByRole('heading', { level: 1, name: 'Edit user #7' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Rodrigo');
    expect(screen.getByLabelText('Email')).toHaveValue('rodrigo@gmail.com');
  });

  it('shows the error when the user cannot be loaded', async () => {
    mockedGetUser.mockRejectedValue(new Error('User not found'));
    await renderEditForm(404);

    expect(screen.getByText('User not found')).toBeInTheDocument();
  });

  it('updates the user with trimmed values and goes back to the list', async () => {
    await renderEditForm();

    fillForm('  Ana  ', '  ana@example.com  ');
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockedUpdateUser).toHaveBeenCalledWith(7, { name: 'Ana', email: 'ana@example.com' });
    expect(mockedCreateUser).not.toHaveBeenCalled();
    expect(await screen.findByText(LIST_PAGE_TEXT)).toBeInTheDocument();
  });

  it('shows the error and stays on the form when updating fails', async () => {
    mockedUpdateUser.mockRejectedValue(new Error('Conflict'));
    await renderEditForm();

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Conflict')).toBeInTheDocument();
    expect(screen.queryByText(LIST_PAGE_TEXT)).not.toBeInTheDocument();
  });
});
