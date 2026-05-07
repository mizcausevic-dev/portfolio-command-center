import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the hero heading", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", {
        name: /one flagship surface for the systems, workflows, and decisions this portfolio proves/i
      })
    ).toBeInTheDocument();
  });

  it("renders a flagship project card", () => {
    render(<App />);
    expect(screen.getByText(/revenue ops ai assistant/i)).toBeInTheDocument();
  });
});
