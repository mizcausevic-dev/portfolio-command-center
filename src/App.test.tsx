import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import { repoCatalog } from "./data";

describe("App", () => {
  it("renders the constellation hero", () => {
    render(<App />);
    expect(screen.getByText(/portfolio constellation · live github sync/i, { selector: "p" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /one engineer\./i })).toBeInTheDocument();
  });

  it("renders named platforms and atlas sections", () => {
    render(<App />);
    expect(screen.getByText(/^Named platforms$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Language atlas$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Industry atlas$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Platform and company signals$/i)).toBeInTheDocument();
  });

  it("renders the refreshed biotech and polyglot entries", () => {
    render(<App />);
    expect(screen.getAllByText(/biotech \/ diagnostics/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/shell \/ bash/i).length).toBeGreaterThan(0);

    // diagnostic-qc-evidence-router sits past the first page of the Biotech set, so
    // filter to Biotech and reveal all repos before asserting the card renders.
    fireEvent.click(screen.getByRole("button", { name: /biotech \/ diagnostics/i }));
    fireEvent.click(screen.getByRole("button", { name: /show all \d+ repos/i }));
    expect(screen.getAllByText(/diagnostic-qc-evidence-router/i).length).toBeGreaterThan(0);
  });

  it("clicking atlas items drives the repo explorer filters", () => {
    render(<App />);

    const biotechButton = screen.getByRole("button", { name: /biotech \/ diagnostics/i });
    fireEvent.click(biotechButton);
    expect(screen.getByDisplayValue(/biotech \/ diagnostics/i)).toBeInTheDocument();
    // Biotech spans more than one page; reveal all to reach the deep entry.
    fireEvent.click(screen.getByRole("button", { name: /show all \d+ repos/i }));
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

  it("language atlas counts resolve against the same repo catalog as the grid", () => {
    render(<App />);

    const expectedPython = repoCatalog.filter((repo) => repo.language === "Python").length;
    fireEvent.click(screen.getByRole("button", { name: /python/i }));
    expect(screen.getByDisplayValue(/^python$/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`showing ${expectedPython} of ${repoCatalog.length} repos`, "i"))).toBeInTheDocument();

    const expectedPhp = repoCatalog.filter((repo) => repo.language === "PHP").length;
    fireEvent.click(screen.getByRole("button", { name: /python/i }));
    fireEvent.click(screen.getByRole("button", { name: /php/i }));
    expect(screen.getByDisplayValue(/^php$/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`showing ${expectedPhp} of ${repoCatalog.length} repos`, "i"))).toBeInTheDocument();
  });

  it("platform and company signal chips drive the same repo grid search", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /gcp signal/i }));
    expect(screen.getByLabelText(/search repos/i)).toHaveValue("GCP");
    expect(screen.getByDisplayValue(/all verticals/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/all platforms/i)).toBeInTheDocument();
    expect(screen.getAllByText(/gcp/i).length).toBeGreaterThan(0);
  });

  it("renders sticky section navigation with jump links to every section", () => {
    render(<App />);

    const nav = screen.getByRole("navigation", { name: /section navigation/i });
    ["Overview", "Platforms", "Languages", "Verticals", "Repos"].forEach((label) => {
      const link = within(nav).getByRole("link", { name: label });
      expect(link).toBeInTheDocument();
    });
    expect(within(nav).getByRole("link", { name: "Repos" })).toHaveAttribute("href", "#repos");
  });

  it("paginates the repo grid and reveals every repo on demand", () => {
    render(<App />);

    // Default view is bounded to one page, not the full 706-row wall.
    expect(document.querySelectorAll(".repo-card").length).toBe(24);

    fireEvent.click(screen.getByRole("button", { name: /show all \d+ repos/i }));
    expect(document.querySelectorAll(".repo-card").length).toBe(repoCatalog.length);
  });

  it("sorts the repo grid by name", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/sort repos/i), { target: { value: "name-asc" } });

    const expectedFirst = [...repoCatalog]
      .map((repo) => repo.slug)
      .sort((left, right) => left.localeCompare(right))[0];
    const firstCard = document.querySelector(".repo-grid .repo-head a");
    expect(firstCard?.textContent).toBe(expectedFirst);
  });
});
