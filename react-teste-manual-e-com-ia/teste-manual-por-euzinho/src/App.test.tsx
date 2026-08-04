import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getUser, getUsers } from "./api/userApi";
import App from "./App";

jest.mock("./api/userApi");
const getUsersMocked = jest.mocked(getUsers);
const getUserMocked = jest.mocked(getUser);

function renderAt(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

beforeEach(() => {
  getUsersMocked.mockResolvedValue([]);
  getUserMocked.mockResolvedValue({
    id: 1,
    name: "Rodrigao",
    email: "noix@noix.com",
  });
});

describe("App", () => {
  it("renders", () => {
    renderAt("/about");
  });

  it("renders possui links", () => {
    renderAt("/about");

    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: /user/i })).toHaveAttribute(
      "href",
      "/users",
    );
  });

  it("caminho / passa pra /about", () => {
    renderAt("/");

    expect(window.location.pathname).toBe("/about");
    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
  });

  it("rota não existe vai pro /about", () => {
    renderAt("/this-route-does-not-exist");

    expect(window.location.pathname).toBe("/about");
    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
  });

  it("renderiza /about", () => {
    renderAt("/about");

    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText(/eu amo rodrigo\.\.\. rs/i)).toBeInTheDocument();
  });

  it("em /users renderiza lista e metodo getUser chamadooooo", async () => {
    getUsersMocked.mockResolvedValue([
      { id: 1, name: "John Doe", email: "john@example.com" },
    ]);

    renderAt("/users");

    expect(screen.getByRole("heading", { name: /users/i })).toBeInTheDocument();
    expect(await screen.findByText("john@example.com")).toBeInTheDocument();
    expect(getUsersMocked).toHaveBeenCalled();
  });

  it("criando usuario rota /users/new e getUser não chamado", () => {
    renderAt("/users/new");

    expect(
      screen.getByRole("heading", { name: /new user/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue("");
    // the create route has no id, so nothing is loaded from the api
    expect(getUserMocked).not.toHaveBeenCalled();
  });

  it("edita usuario em /users/1/edit e carrega usuario com id 1", async () => {
    renderAt("/users/1/edit");

    expect(
      screen.getByRole("heading", { name: /edit user #1/i }),
    ).toBeInTheDocument();
    expect(await screen.findByLabelText(/name/i)).toHaveValue("Rodrigao");
    expect(screen.getByLabelText(/email/i)).toHaveValue("noix@noix.com");
    expect(getUserMocked).toHaveBeenCalledWith(1);
  });

  it("a partir de /about, navega pro link usuarios", async () => {
    renderAt("/about");

    userEvent.click(screen.getByRole("link", { name: /user/i }));

    expect(window.location.pathname).toBe("/users");
    expect(screen.getByRole("heading", { name: /users/i })).toBeInTheDocument();
    expect(await screen.findByText(/no users yet\./i)).toBeInTheDocument();
    expect(screen.queryByText(/eu amo rodrigo/i)).not.toBeInTheDocument();
  });
});
