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

  it("language atlas clicks resolve mapped repos for polyglot lanes", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /kotlin/i }));
    expect(screen.getByDisplayValue(/^kotlin$/i)).toBeInTheDocument();
    expect(screen.getAllByText(/field-audit-mobile/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /kotlin/i }));
    fireEvent.click(screen.getByRole("button", { name: /julia/i }));
    expect(screen.getByDisplayValue(/^julia$/i)).toBeInTheDocument();
    expect(screen.getAllByText(/yield-forecast-studio/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /julia/i }));
    fireEvent.click(screen.getByRole("button", { name: /c#/i }));
    expect(screen.getByDisplayValue(/^c#$/i)).toBeInTheDocument();
    expect(screen.getAllByText(/access-certification-api-dotnet/i).length).toBeGreaterThan(0);
  });

  it("atlas clicks reset the opposing atlas dimension so drill-ins do not collapse to zero", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /biotech \/ diagnostics/i }));
    expect(screen.getByDisplayValue(/biotech \/ diagnostics/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /kotlin/i }));
    expect(screen.getByDisplayValue(/^kotlin$/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/all verticals/i)).toBeInTheDocument();
    expect(screen.getAllByText(/field-audit-mobile/i).length).toBeGreaterThan(0);
  });
});
