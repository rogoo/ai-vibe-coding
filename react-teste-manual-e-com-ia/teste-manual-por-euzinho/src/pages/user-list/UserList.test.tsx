import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { createDeferred } from "test/test-utils";
import { User } from "types/user";
import { getUsers } from "../../api/userApi";
import UserList from "./UserList";

jest.mock("../../api/userApi");
const getUsersMocked = jest.mocked(getUsers);

// Create React App sets resetMocks, which drops every implementation before
// each test, so the default has to be put back every time.
beforeEach(() => {
  getUsersMocked.mockResolvedValue([]);
});

test("component renders correctly", async () => {
  render(
    <MemoryRouter>
      <UserList />
    </MemoryRouter>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading users/i));
});

it("check success render - empty list", async () => {
  render(
    <MemoryRouter>
      <UserList />
    </MemoryRouter>,
  );

  // while the request is pending the table is replaced by the loading message
  expect(
    screen.getByText(/loading users/i, { selector: "p.message" }),
  ).toBeInTheDocument();

  expect(screen.getByRole("heading", { name: /users/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/filter by name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/filter by email/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /new user/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();

  // the empty table only shows up once the request resolved with no users
  await waitForElementToBeRemoved(() => screen.queryByText(/loading users/i));
  expect(screen.getByText(/no users yet\./i)).toBeInTheDocument();
});

it("check success render - non-empty list", async () => {
  const user: User = { id: 1, name: "John Doe", email: "john@example.com" };
  const { promise, resolve } = createDeferred<User[]>();
  getUsersMocked.mockReturnValue(promise);

  render(
    <MemoryRouter>
      <UserList />
    </MemoryRouter>,
  );

  // the request is held open, so only the loading message is on screen
  expect(
    screen.getByText(/loading users/i, { selector: "p.message" }),
  ).toBeInTheDocument();
  expect(screen.queryByText(user.email)).not.toBeInTheDocument();

  // the row only shows up once the request resolved with the user
  await act(async () => await resolve([user]));

  expect(screen.getByText(user.name)).toBeInTheDocument();
  expect(screen.getByText(user.email)).toBeInTheDocument();
  expect(screen.queryByText(/no users yet\./i)).not.toBeInTheDocument();

  // procura edit e delete
  const linkEdit = screen.getByRole("link", { name: "Edit" });
  expect(linkEdit).toBeInTheDocument();
  expect(linkEdit).toHaveAttribute("href", "/users/1/edit");
  expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
});

it("check error render - api not working or down", async () => {
  const erroMensagem = "API is ruim papaiiiiii";
  getUsersMocked.mockRejectedValue(new Error(erroMensagem));

  render(
    <MemoryRouter>
      <UserList />
    </MemoryRouter>,
  );

  expect(
    await screen.findByText(erroMensagem, { selector: "p.message-error" }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});

it("check filter name remove all itens and clear input having it back papaiiiii", async () => {
  const { promise, resolve } = createDeferred<User[]>();
  getUsersMocked.mockReturnValue(promise);

  render(
    <MemoryRouter>
      <UserList />
    </MemoryRouter>,
  );

  await waitFor(() =>
    resolve([{ id: 666, name: "Rogoo", email: "oi@oi.com" }]),
  );

  // vai ficar sem nada para apresentar
  userEvent.type(screen.getByLabelText(/filter by name/i), "asdf");
  expect(screen.getByText(/no users match the filters\./i)).toBeInTheDocument();
  userEvent.clear(screen.getByLabelText(/filter by name/i));
  expect(screen.getByText("666")).toBeInTheDocument();
});
