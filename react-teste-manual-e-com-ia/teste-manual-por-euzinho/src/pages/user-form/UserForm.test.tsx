import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { createDeferred } from "test/test-utils";
import { User } from "types/user";
import { createUser, getUser } from "../../api/userApi";
import UserForm from "./UserForm";

jest.mock("../../api/userApi");
const createUserMocked = jest.mocked(createUser);
const getUserMocked = jest.mocked(getUser);

const loadedUser: User = {
  id: 65,
  name: "Rodrigo",
  email: "rodrigo@example.com",
};

/**
 * react-router-dom exports non-configurable getters, so jest.spyOn cannot
 * replace them. Mocking the module keeps the real implementation as the
 * default and lets a single test override useParams or useNavigate.
 */
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");

  return {
    ...actual,
    useParams: jest.fn(actual.useParams),
    useNavigate: jest.fn(actual.useNavigate),
  };
});

const actualRouter =
  jest.requireActual<typeof import("react-router-dom")>("react-router-dom");

const mockedUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockedUseNavigate = useNavigate as jest.MockedFunction<
  typeof useNavigate
>;

// Create React App sets resetMocks, which drops every implementation before
// each test, so the defaults have to be put back every time.
beforeEach(() => {
  mockedUseParams.mockImplementation(actualRouter.useParams);
  mockedUseNavigate.mockImplementation(actualRouter.useNavigate);
  getUserMocked.mockResolvedValue(loadedUser);
  createUserMocked.mockResolvedValue(loadedUser);
  jest.clearAllMocks();
});

describe("UserForm page - new user", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );
  });

  it("renders new user page", () => {
    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );

    // titulo
    const headingElement = screen.getByRole("heading", { level: 1 });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent(/new user/i);

    // input empty
    const inputName = screen.getByLabelText(/name/i);
    expect(inputName).toBeInTheDocument();
    expect(inputName).toHaveValue("");

    const inputEmail = screen.getByLabelText(/email/i);
    expect(inputEmail).toBeInTheDocument();
    expect(inputEmail).toHaveValue("");

    const inputTelefone = screen.getByLabelText(/telefone/i);
    expect(inputTelefone).toBeInTheDocument();
    expect(inputTelefone).toHaveValue("");

    // buttons
    const buttonSave = screen.getByRole("button", { name: /save/i });
    expect(buttonSave).toBeInTheDocument();
    expect(buttonSave).toBeDisabled();

    const buttonCancel = screen.getByRole("button", { name: /cancel/i });
    expect(buttonCancel).toBeInTheDocument();
    expect(buttonCancel).toBeEnabled();
  });

  it("renders new user page - have input name with value - button save still disabled", () => {
    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );

    // input
    const inputName = screen.getByLabelText(/name/i);
    userEvent.type(inputName, "Rodrigo");
    expect(inputName).toHaveValue("Rodrigo");

    // button
    const buttonSave = screen.getByRole("button", { name: /save/i });
    expect(buttonSave).toBeInTheDocument();
    expect(buttonSave).toBeDisabled();
  });

  it("renders new user page - have input email with value - button save still disabled", () => {
    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );

    // input
    const inputEmail = screen.getByLabelText(/email/i);
    userEvent.type(inputEmail, "rodrigo@example.com");
    expect(inputEmail).toHaveValue("rodrigo@example.com");

    // button
    const buttonSave = screen.getByRole("button", { name: /save/i });
    expect(buttonSave).toBeInTheDocument();
    expect(buttonSave).toBeDisabled();
  });

  it("renders new user page - have input email and name with value - button save is enabled", () => {
    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );

    // inputs
    const inputEmail = screen.getByLabelText(/email/i);
    userEvent.type(inputEmail, "rodrigo@example.com");
    expect(inputEmail).toHaveValue("rodrigo@example.com");

    const inputName = screen.getByLabelText(/name/i);
    userEvent.type(inputName, "Rodrigo");
    expect(inputName).toHaveValue("Rodrigo");

    // button
    const buttonSave = screen.getByRole("button", { name: /save/i });
    expect(buttonSave).toBeInTheDocument();
    expect(buttonSave).toBeEnabled();
  });

  it("renders new user page - valida mascara telefone 10 numeros", () => {
    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );

    // input empty
    const inputTelefone = screen.getByLabelText(/telefone/i);
    userEvent.type(inputTelefone, "1198764321");
    expect(inputTelefone).toHaveValue("(11) 9876-4321");

    // buttons
    const buttonSave = screen.getByRole("button", { name: /save/i });
    expect(buttonSave).toBeInTheDocument();
    expect(buttonSave).toBeDisabled();
  });

  it("renders new user page - valida mascara telefone 11 numeros", () => {
    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );

    // input empty
    const inputTelefone = screen.getByLabelText(/telefone/i);
    userEvent.type(inputTelefone, "11987654321");
    expect(inputTelefone).toHaveValue("(11) 98765-4321");

    // buttons
    const buttonSave = screen.getByRole("button", { name: /save/i });
    expect(buttonSave).toBeInTheDocument();
    expect(buttonSave).toBeDisabled();
  });

  it('renders new user page - button label changed to "Saving…" while api saving user', async () => {
    const { promise, resolve } = createDeferred<User>();
    createUserMocked.mockReturnValue(promise);

    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );

    // the button only enables once name and email are filled in
    userEvent.type(screen.getByLabelText(/name/i), loadedUser.name);
    userEvent.type(screen.getByLabelText(/email/i), loadedUser.email);
    userEvent.click(screen.getByRole("button", { name: /save/i }));

    // while the request is pending the label changes and the button locks
    const buttonSaving = screen.getByRole("button", { name: /saving\.\.\./i });
    expect(buttonSaving).toBeInTheDocument();
    expect(buttonSaving).toBeDisabled();

    await act(async () => {
      resolve(loadedUser);
    });

    expect(createUserMocked).toHaveBeenCalledWith({
      name: loadedUser.name,
      email: loadedUser.email,
    });
  });

  it("renders new user page - click button cancel and navigates back to /users", async () => {
    const navigate = jest.fn();
    mockedUseNavigate.mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );

    // click button cancel
    userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(navigate).toHaveBeenCalledWith("/users");
  });

  it("renders new user page - email invalid", async () => {
    createUserMocked.mockRejectedValue(new Error("Email inválido"));

    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );
    const inputName = screen.getByLabelText(/name/i);
    userEvent.type(inputName, "Rodrigo");
    const inputEmail = screen.getByLabelText(/email/i);
    userEvent.type(inputEmail, "rodrigo@");

    // click button save
    userEvent.click(screen.getByRole("button", { name: /save/i }));

    // the rejection only reaches the state a few microtasks later, so the
    // query itself has to be the awaited one
    const msgElement = await screen.findByText(/email inválido/i, {
      selector: "p.message-error",
    });
    expect(msgElement).toBeInTheDocument();
  });
});

// ###########################################
// ############  EDIT PAGE  ##################
// ###########################################
describe("UserForm page - edit user", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );
  });

  it('renders "Edit user #{id}" on H1 - example 1 with routes', async () => {
    const userId = 65;
    render(
      <MemoryRouter initialEntries={[`/users/${userId}/edit`]}>
        <Routes>
          <Route path={`/users/:id/edit`} element={<UserForm />} />
        </Routes>
      </MemoryRouter>,
    );

    const headingElement = screen.getByRole("heading", { level: 1 });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent(`Edit user #${userId}`);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading user/i));
    expect(getUserMocked).toHaveBeenCalledWith(userId);
  });

  it('renders "Edit user #{id}" on H1 - example 2 mocking useParams', async () => {
    mockedUseParams.mockReturnValue({ id: "661" });

    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );

    const headingElement = screen.getByRole("heading", { level: 1 });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent(`Edit user #661`);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading user/i));
    expect(getUserMocked).toHaveBeenCalledWith(661);
  });

  it('renders "Edit user" - show loading user message', async () => {
    const { promise, resolve } = createDeferred<User>();
    getUserMocked.mockReturnValue(promise);

    mockedUseParams.mockReturnValue({ id: "661" });

    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );

    const loadingUserInfo = screen.getByText(/loading user/i, {
      selector: "p.message",
    });
    expect(loadingUserInfo).toBeInTheDocument();

    // resolving the request is what takes the message off the screen, so the
    // removal has to be awaited instead of flushed beforehand
    resolve(loadedUser);
    await waitForElementToBeRemoved(() => screen.queryByText(/loading user/i));

    expect(getUserMocked).toHaveBeenCalledWith(661);
  });

  it('renders "Edit user" - show error message when api fails', async () => {
    getUserMocked.mockRejectedValue(new Error("Falha ao carregar usuário"));

    mockedUseParams.mockReturnValue({ id: "661" });

    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );

    const errorMsg = await screen.findByText(/falha ao carregar usuário/i, {
      selector: "p.message-error",
    });
    expect(errorMsg).toBeInTheDocument();
  });

  it('renders "edit user" - load user and fill inputs with values', async () => {
    mockedUseParams.mockReturnValue({ id: "661" });

    render(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
    );

    await waitForElementToBeRemoved(() => screen.queryByText(/loading user/i));

    const inputName = screen.getByLabelText(/name/i);
    expect(inputName).toHaveValue(loadedUser.name);

    const inputEmail = screen.getByLabelText(/email/i);
    expect(inputEmail).toHaveValue(loadedUser.email);

    const buttonSave = screen.getByRole("button", { name: /save/i });
    expect(buttonSave).toBeEnabled();
  });
});
