import { fireEvent, render, screen } from "@testing-library/react";
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
    expect(screen.getByText(/diagnostic-qc-evidence-router/i)).toBeInTheDocument();
  });

  it("clicking atlas items drives the repo explorer filters", () => {
    render(<App />);

    const biotechButton = screen.getByRole("button", { name: /biotech \/ diagnostics/i });
    fireEvent.click(biotechButton);
    expect(screen.getByDisplayValue(/biotech \/ diagnostics/i)).toBeInTheDocument();
    expect(screen.getAllByText(/diagnostic-qc-evidence-router/i).length).toBeGreaterThan(0);

    fireEvent.click(biotechButton);
    fireEvent.click(screen.getByRole("button", { name: /shell \/ bash/i }));
    expect(screen.getByDisplayValue(/shell \/ bash/i)).toBeInTheDocument();
    expect(screen.getAllByText(/backup-restore-drill-runner/i).length).toBeGreaterThan(0);
  });
});
