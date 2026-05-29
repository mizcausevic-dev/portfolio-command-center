import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the constellation hero", () => {
    render(<App />);
    expect(screen.getByText(/portfolio constellation/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /one engineer\./i })).toBeInTheDocument();
  });

  it("renders named platforms and atlas sections", () => {
    render(<App />);
    expect(screen.getByText(/^Named platforms$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Language atlas$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Industry atlas$/i)).toBeInTheDocument();
  });

  it("renders the refreshed biotech and polyglot entries", () => {
    render(<App />);
    expect(screen.getAllByText(/biotech \/ diagnostics/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/shell \/ bash/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/diagnostics\.kineticgain\.com/i)).toBeInTheDocument();
  });
});
