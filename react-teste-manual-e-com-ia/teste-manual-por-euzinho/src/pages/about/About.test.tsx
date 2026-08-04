import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import About from "./About";

describe("About page", () => {
  it("renders correctly", () => {
    render(<About />);
  });

  it("renders H1 title with About test", () => {
    render(<About />);
    const headingElement = screen.getByRole("heading", { name: /About/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders "eu amo rodrigo... rs"', () => {
    render(<About />);
    const textElement = screen.getByText(/eu amo rodrigo... rs/i);
    expect(textElement).toBeInTheDocument();
  });
});
