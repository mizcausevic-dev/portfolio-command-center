import { render, screen } from "@testing-library/react";
import { SendToLlm } from "../SendToLlm";

describe("SendToLlm", () => {
  it("renders one deep-link button per supported LLM with a real, accurate aria-label", () => {
    render(<SendToLlm />);

    (["ChatGPT", "Claude", "Perplexity", "Gemini"] as const).forEach((label) => {
      const link = screen.getByRole("link", { name: `Send this page to ${label}` });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("builds each href from that platform's own documented deep-link param", () => {
    render(<SendToLlm />);

    expect(screen.getByRole("link", { name: /chatgpt/i }).getAttribute("href")).toMatch(
      /^https:\/\/chatgpt\.com\/\?q=/
    );
    expect(screen.getByRole("link", { name: /^Send this page to Claude$/i }).getAttribute("href")).toMatch(
      /^https:\/\/claude\.ai\/new\?q=/
    );
    expect(screen.getByRole("link", { name: /perplexity/i }).getAttribute("href")).toMatch(
      /^https:\/\/www\.perplexity\.ai\/search\?q=/
    );
    expect(screen.getByRole("link", { name: /gemini/i }).getAttribute("href")).toMatch(
      /^https:\/\/gemini\.google\.com\/app\?text=/
    );
  });

  it("shares only the public canonical URL, not the visitor's query or hash", () => {
    render(<SendToLlm />);
    const href = screen.getByRole("link", { name: /^Send this page to Claude$/i }).getAttribute("href") ?? "";
    expect(decodeURIComponent(href)).toContain("https://portfolio.kineticgain.com/");
    expect(decodeURIComponent(href)).not.toContain(window.location.href);
    expect(screen.getByText(/shares this public page URL/i)).toBeInTheDocument();
  });

  it("marks every brand icon aria-hidden so it never depends on icon recognition alone", () => {
    const { container } = render(<SendToLlm />);
    const icons = container.querySelectorAll(".send-to-llm-icon");
    expect(icons.length).toBe(4);
    icons.forEach((icon) => expect(icon).toHaveAttribute("aria-hidden", "true"));
  });
});
