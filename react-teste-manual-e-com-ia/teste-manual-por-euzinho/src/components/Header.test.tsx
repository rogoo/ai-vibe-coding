import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";

describe("Header", () => {
  it("Header renders", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );
  });

  it("to have both links user and about and right href", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    const aboutLink = screen.getByRole("link", { name: /about/i });
    const userLink = screen.getByRole("link", { name: /user/i });

    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");

    expect(userLink).toBeInTheDocument();
    expect(userLink).toHaveAttribute("href", "/users");
  });

  it("to have only 2 links", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(2);
  });

  it("About about active by default", async () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    const aboutLink = screen.getByRole("link", { name: /about/i });
    const userLink = screen.getByRole("link", { name: /user/i });
    await userEvent.click(aboutLink);

    expect(aboutLink).toHaveClass("header-link-active");
    expect(userLink).not.toHaveClass("header-link-active");
  });

  it("User about active by default", async () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    const aboutLink = screen.getByRole("link", { name: /about/i });
    const userLink = screen.getByRole("link", { name: /user/i });
    await userEvent.click(userLink);

    expect(userLink).toHaveClass("header-link-active");
    expect(aboutLink).not.toHaveClass("header-link-active");
  });
});
