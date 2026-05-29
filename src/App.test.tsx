import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the atlas heading", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", {
        name: /24 languages across the public portfolio/i
      })
    ).toBeInTheDocument();
  });

  it("renders a flagship project card", () => {
    render(<App />);
    expect(screen.getByText(/mcp registry risk scanner/i)).toBeInTheDocument();
  });

  it("renders the refreshed atlas entries", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /24 languages across the public portfolio/i })).toBeInTheDocument();
    expect(screen.getByText(/biotech \/ diagnostics/i)).toBeInTheDocument();
    expect(screen.getByText(/shell \/ bash/i)).toBeInTheDocument();
  });
});
