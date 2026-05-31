import generatedRepoCatalog from "./generatedRepoCatalog.json";
import { IndustryVerticalEntry, LanguageAtlasEntry, NamedPlatform, RepoEntry, SnapshotStat } from "./types";

const SNAPSHOT_LABEL = "Portfolio Constellation · Live GitHub sync";

const namedPlatformDefinitions = [
  {
    name: "Kinetic Gain Protocol Suite",
    description:
      "Eleven open JSON specs for the answer-engine and agent era. Spec text plus JSON Schema plus canonical examples per repo.",
    repos: [
      { name: "kinetic-gain-protocol-suite", url: "https://github.com/mizcausevic-dev/kinetic-gain-protocol-suite" },
      { name: "aeo-protocol-spec", url: "https://github.com/mizcausevic-dev/aeo-protocol-spec" },
      { name: "ai-procurement-decision-spec", url: "https://github.com/mizcausevic-dev/ai-procurement-decision-spec" },
      { name: "ai-incident-card-spec", url: "https://github.com/mizcausevic-dev/ai-incident-card-spec" },
      { name: "clinical-ai-disclosure-spec", url: "https://github.com/mizcausevic-dev/clinical-ai-disclosure-spec" }
    ],
    tone: "bert" as const
  },
  {
    name: "Kinetic Gain Implementation Stack",
    description:
      "Software that consumes the Suite specs: drafters, validators, policy engines, registries, attestation, audit-stream, and MCP servers.",
    repos: [
      { name: "kg-hosted-validator", url: "https://github.com/mizcausevic-dev/kg-hosted-validator" },
      { name: "aeo-registry", url: "https://github.com/mizcausevic-dev/aeo-registry" },
      { name: "audit-stream-py", url: "https://github.com/mizcausevic-dev/audit-stream-py" },
      { name: "kg-governance-dashboard", url: "https://github.com/mizcausevic-dev/kg-governance-dashboard" },
      { name: "audit-stream-prometheus", url: "https://github.com/mizcausevic-dev/audit-stream-prometheus" }
    ],
    tone: "bert" as const
  },
  {
    name: "AEO Reference Stack",
    description:
      "Five-layer reference implementation for the AEO Protocol: SDKs across five languages, a CLI, a BFS crawler, an always-on validator service, and an HTTP graph-query service.",
    repos: [
      { name: "aeo-cli", url: "https://github.com/mizcausevic-dev/aeo-cli" },
      { name: "aeo-sdk-swift", url: "https://github.com/mizcausevic-dev/aeo-sdk-swift" },
      { name: "aeo-sdk-go", url: "https://github.com/mizcausevic-dev/aeo-sdk-go" },
      { name: "aeo-sdk-rust", url: "https://github.com/mizcausevic-dev/aeo-sdk-rust" },
      { name: "aeo-sdk-typescript", url: "https://github.com/mizcausevic-dev/aeo-sdk-typescript" }
    ],
    tone: "cyan" as const
  },
  {
    name: "Agent Operations Suite",
    description:
      "Production primitives for AI agent fleets: routing, eval gates, canary rollout, governance-as-code, observability, identity, and redaction.",
    repos: [
      { name: "prompt-injection-bench-web", url: "https://github.com/mizcausevic-dev/prompt-injection-bench-web" },
      { name: "agent-codex", url: "https://github.com/mizcausevic-dev/agent-codex" },
      { name: "agentobserve-dashboard", url: "https://github.com/mizcausevic-dev/agentobserve-dashboard" },
      { name: "mcp-sentinel-dashboard", url: "https://github.com/mizcausevic-dev/mcp-sentinel-dashboard" },
      { name: "rag-sentinel-dashboard", url: "https://github.com/mizcausevic-dev/rag-sentinel-dashboard" }
    ],
    tone: "plum" as const
  },
  {
    name: "Platform Reliability Stack",
    description:
      "Async reliability primitives plus SRE math: rate limiter, circuit breaker, retry, bulkhead, SLO and error-budget tracking, and request shadowing.",
    repos: [
      { name: "latency-distribution-analyzer", url: "https://github.com/mizcausevic-dev/latency-distribution-analyzer" },
      { name: "release-readiness-gatekeeper", url: "https://github.com/mizcausevic-dev/release-readiness-gatekeeper" },
      { name: "error-budget-allocator", url: "https://github.com/mizcausevic-dev/error-budget-allocator" },
      { name: "dependency-drift-watch", url: "https://github.com/mizcausevic-dev/dependency-drift-watch" },
      { name: "support-escalation-router", url: "https://github.com/mizcausevic-dev/support-escalation-router" }
    ],
    tone: "amber" as const
  },
  {
    name: "Decision Intelligence",
    description:
      "Buyer-side governance: Decision Cards to PolicyBundles to live request enforcement to contract ownership to incident remediation graphs.",
    repos: [
      { name: "policy-decision-simulator", url: "https://github.com/mizcausevic-dev/policy-decision-simulator" },
      { name: "executive-briefing-studio", url: "https://github.com/mizcausevic-dev/executive-briefing-studio" },
      { name: "scenario-planning-atlas", url: "https://github.com/mizcausevic-dev/scenario-planning-atlas" },
      { name: "evidence-ranking-engine", url: "https://github.com/mizcausevic-dev/evidence-ranking-engine" },
      { name: "decision-memory-engine", url: "https://github.com/mizcausevic-dev/decision-memory-engine" }
    ],
    tone: "rose" as const
  },
  {
    name: "MCP Servers",
    description:
      "Model Context Protocol servers exposing portfolio capabilities as Claude-callable tools. One config entry per server.",
    repos: [
      { name: "mcp-tool-card-fleet-summary-action", url: "https://github.com/mizcausevic-dev/mcp-tool-card-fleet-summary-action" },
      { name: "kg-protocol-detect-action", url: "https://github.com/mizcausevic-dev/kg-protocol-detect-action" },
      { name: "mcp-kinetic-gain", url: "https://github.com/mizcausevic-dev/mcp-kinetic-gain" },
      { name: "mcp-session-recorder", url: "https://github.com/mizcausevic-dev/mcp-session-recorder" },
      { name: "mcp-sentinel-dashboard", url: "https://github.com/mizcausevic-dev/mcp-sentinel-dashboard" }
    ],
    tone: "plum" as const
  },
  {
    name: "Landing Sites",
    description:
      "Per-spec landing pages, gallery and directory properties, and hub sites - the public face of the suite across *.kineticgain.com.",
    repos: [
      { name: "procurement-pulse-landing", url: "https://github.com/mizcausevic-dev/procurement-pulse-landing" },
      { name: "kinetic-gain-suite-landing", url: "https://github.com/mizcausevic-dev/kinetic-gain-suite-landing" },
      { name: "clinical-ai-disclosure-landing", url: "https://github.com/mizcausevic-dev/clinical-ai-disclosure-landing" },
      { name: "student-ai-disclosure-landing", url: "https://github.com/mizcausevic-dev/student-ai-disclosure-landing" },
      { name: "prompt-provenance-landing", url: "https://github.com/mizcausevic-dev/prompt-provenance-landing" }
    ],
    tone: "cyan" as const
  },
  {
    name: "Frontend Showcase",
    description:
      "Standalone React, Vue, Flutter web, and TypeScript apps demonstrating dashboards, control rooms, command centers, and operator surfaces.",
    repos: [
      { name: "kinetic-gain-visualizer", url: "https://github.com/mizcausevic-dev/kinetic-gain-visualizer" },
      { name: "kinetic-gain-operator-console", url: "https://github.com/mizcausevic-dev/kinetic-gain-operator-console" },
      { name: "portfolio-command-center", url: "https://github.com/mizcausevic-dev/portfolio-command-center" },
      { name: "flutter-operator-console", url: "https://github.com/mizcausevic-dev/flutter-operator-console" },
      { name: "gitvisualizer", url: "https://github.com/mizcausevic-dev/gitvisualizer" }
    ],
    tone: "cyan" as const
  }
];

const languageColorOverrides: Record<string, string> = {
  TypeScript: "#4f92e7",
  Python: "#ea5b2e",
  PHP: "#d7a785",
  JavaScript: "#efd540",
  "C#": "#b46ad3",
  Julia: "#9c6ad9",
  R: "#2f9ef7",
  Kotlin: "#8d65ff",
  "Shell / Bash": "#6cd94e",
  Dart: "#20a7ff",
  HCL: "#7065ff",
  CSS: "#1cb8ff",
  Zig: "#ffb533",
  "Jupyter Notebook": "#ff7f3f",
  Rust: "#f1b58e",
  Go: "#58d1ff",
  HTML: "#ff4d8d",
  Java: "#ff855f",
  Other: "#74819f"
};

const fallbackLanguageColors = ["#49dcb1", "#ff8c66", "#7cc2ff", "#b594ff", "#ffd35a", "#ff7ba5"];

const verticalOrder = [
  "AI Platform",
  "Compliance / Governance",
  "Platform Engineering",
  "Revenue Operations",
  "IAM / Security",
  "FinTech",
  "Data Engineering",
  "EdTech",
  "HealthTech",
  "Biotech / Diagnostics",
  "Insurance / InsurTech",
  "Nonprofit / Foundation Ops",
  "Media / Publishing",
  "PropTech / Real Estate",
  "HR Tech / Employment AI",
  "GovTech / Public Sector AI",
  "Aerospace / Drones",
  "Robotics"
] as const;

export const repoCatalog: RepoEntry[] = generatedRepoCatalog as RepoEntry[];

export const namedPlatforms: NamedPlatform[] = namedPlatformDefinitions.map((entry) => {
  const count = repoCatalog.filter((repo) => repo.platform === entry.name).length;
  const remaining = Math.max(count - entry.repos.length, 0);

  return {
    ...entry,
    count,
    footer: remaining > 0 ? `+ ${remaining} more` : "All listed"
  };
});

export const languageAtlas: LanguageAtlasEntry[] = Object.entries(
  repoCatalog.reduce<Record<string, number>>((accumulator, repo) => {
    accumulator[repo.language] = (accumulator[repo.language] ?? 0) + 1;
    return accumulator;
  }, {})
)
  .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
  .map(([language, repos], index) => ({
    language,
    repos,
    color: languageColorOverrides[language] ?? fallbackLanguageColors[index % fallbackLanguageColors.length]
  }));

export const industryAtlas: IndustryVerticalEntry[] = verticalOrder
  .map((vertical) => ({
    vertical,
    repos: repoCatalog.filter((repo) => repo.vertical === vertical).length
  }))
  .filter((entry) => entry.repos > 0);

const pushed24Hours = repoCatalog.filter((repo) => repo.freshness === "24h").length;
const pushed7Days = repoCatalog.filter((repo) => repo.freshness === "24h" || repo.freshness === "7d").length;

export const portfolioSnapshot: {
  snapshotLabel: string;
  totalRepos: number;
  languageCount: number;
  platformCount: number;
  verticalCount: number;
  stats: SnapshotStat[];
} = {
  snapshotLabel: SNAPSHOT_LABEL,
  totalRepos: repoCatalog.length,
  languageCount: languageAtlas.length,
  platformCount: namedPlatforms.length,
  verticalCount: industryAtlas.length,
  stats: [
    { value: `${repoCatalog.length}`, label: "total repos" },
    { value: `${languageAtlas.length}`, label: "languages" },
    { value: `${pushed24Hours}`, label: "pushed in 24h" },
    { value: `${pushed7Days}`, label: "pushed in 7d" },
    { value: `${namedPlatforms.length}`, label: "platforms" },
    { value: `${industryAtlas.length}`, label: "verticals" }
  ]
};
