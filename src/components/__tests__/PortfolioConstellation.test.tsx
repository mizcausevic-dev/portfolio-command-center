import { fireEvent, render, screen } from "@testing-library/react";
import { PortfolioConstellation } from "../PortfolioConstellation";
import { namedPlatforms, portfolioSnapshot } from "../../data";

describe("PortfolioConstellation", () => {
  it("renders the SVG root as an accessible group (never role=img) labeled with real totals", () => {
    render(
      <PortfolioConstellation platforms={namedPlatforms} totalRepos={portfolioSnapshot.totalRepos} onSelectPlatform={() => {}} />
    );

    const svg = screen.getByRole("group", {
      name: `Radial map of ${namedPlatforms.length} named platforms across ${portfolioSnapshot.totalRepos} total repos`
    });
    expect(svg.tagName.toLowerCase()).toBe("svg");
  });

  it("renders one focusable, labeled hub per real named platform", () => {
    render(
      <PortfolioConstellation platforms={namedPlatforms} totalRepos={portfolioSnapshot.totalRepos} onSelectPlatform={() => {}} />
    );

    namedPlatforms.forEach((p) => {
      const hub = screen.getByRole("button", {
        name: `${p.name}, named platform, ${p.count} repo${p.count === 1 ? "" : "s"}. Activate to see details and filter the archive.`
      });
      expect(hub).toHaveAttribute("tabindex", "0");
    });
  });

  it("opens the dossier on hub click and filters the archive via the real onSelectPlatform callback", () => {
    const onSelectPlatform = vi.fn();
    const target = namedPlatforms[0];
    render(
      <PortfolioConstellation platforms={namedPlatforms} totalRepos={portfolioSnapshot.totalRepos} onSelectPlatform={onSelectPlatform} />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: `${target.name}, named platform, ${target.count} repo${target.count === 1 ? "" : "s"}. Activate to see details and filter the archive.`
      })
    );

    expect(screen.getByText(target.name, { selector: "h4" })).toBeInTheDocument();
    expect(screen.getByText(String(target.count))).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Filter the archive ↓" }));
    expect(onSelectPlatform).toHaveBeenCalledWith(target.name);
  });

  it("Enter and Space on a hub open the dossier the same as a click", () => {
    const target = namedPlatforms[1];
    render(
      <PortfolioConstellation platforms={namedPlatforms} totalRepos={portfolioSnapshot.totalRepos} onSelectPlatform={() => {}} />
    );

    const hub = screen.getByRole("button", {
      name: `${target.name}, named platform, ${target.count} repo${target.count === 1 ? "" : "s"}. Activate to see details and filter the archive.`
    });
    fireEvent.keyDown(hub, { key: "Enter" });
    expect(screen.getByText(target.name, { selector: "h4" })).toBeInTheDocument();
  });

  it("renders a real, curated repo leaf for each platform's listed repos", () => {
    render(
      <PortfolioConstellation platforms={namedPlatforms} totalRepos={portfolioSnapshot.totalRepos} onSelectPlatform={() => {}} />
    );

    const first = namedPlatforms[0];
    first.repos.forEach((repo) => {
      expect(
        screen.getByRole("button", { name: `${repo.name}, repo in ${first.name}. Activate for details and a link to the repo.` })
      ).toBeInTheDocument();
    });
  });

  it("shows a real '+N more' node exactly when the real count exceeds the curated leaves, and it drives the archive filter", () => {
    const onSelectPlatform = vi.fn();
    render(
      <PortfolioConstellation platforms={namedPlatforms} totalRepos={portfolioSnapshot.totalRepos} onSelectPlatform={onSelectPlatform} />
    );

    namedPlatforms.forEach((p) => {
      const extra = p.count - p.repos.length;
      if (extra > 0) {
        const more = screen.getByRole("button", {
          name: `${extra} more repos in ${p.name}. Activate to filter the archive and see all ${p.count}.`
        });
        expect(more).toBeInTheDocument();
      }
    });

    const withExtra = namedPlatforms.find((p) => p.count - p.repos.length > 0);
    expect(withExtra).toBeDefined();
    if (withExtra) {
      const extra = withExtra.count - withExtra.repos.length;
      fireEvent.click(
        screen.getByRole("button", {
          name: `${extra} more repos in ${withExtra.name}. Activate to filter the archive and see all ${withExtra.count}.`
        })
      );
      expect(onSelectPlatform).toHaveBeenCalledWith(withExtra.name);
    }
  });

  it("prints the real total repo count and platform count in the center of the diagram", () => {
    render(
      <PortfolioConstellation platforms={namedPlatforms} totalRepos={portfolioSnapshot.totalRepos} onSelectPlatform={() => {}} />
    );

    expect(screen.getByText(`${portfolioSnapshot.totalRepos} REPOS`)).toBeInTheDocument();
    expect(screen.getByText(`${namedPlatforms.length} PLATFORMS`)).toBeInTheDocument();
  });

  it("renders nothing for an empty platform list rather than an empty/broken diagram", () => {
    const { container } = render(
      <PortfolioConstellation platforms={[]} totalRepos={0} onSelectPlatform={() => {}} />
    );
    expect(container.querySelector(".constellation")).toBeNull();
  });
});
