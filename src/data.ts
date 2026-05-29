import {
  CommandNote,
  HealthPoint,
  IndustryVerticalEntry,
  LanguageAtlasEntry,
  OperatingTrack,
  PortfolioProject,
  Signal,
  SystemDomain,
  ToolkitLane
} from "./types";

export const topSignals: Signal[] = [
  { label: "Toolkit repos", value: "14", delta: "Across 5 implementation lanes", tone: "positive" },
  { label: "Live properties", value: "60+", delta: "Suite, Atlas, hubs, and operator surfaces", tone: "neutral" },
  { label: "Protocol depth", value: "11 specs", delta: "Backed by real reference implementations", tone: "positive" },
  { label: "Portfolio readiness", value: "96", delta: "Case-study level polish", tone: "watch" }
];

export const domainCoverage: SystemDomain[] = [
  { domain: "Revenue Ops", coverage: 96, confidence: 92, motion: "Forecasting, routing, AI briefs" },
  { domain: "Platform Ops", coverage: 88, confidence: 87, motion: "Incidents, cloud cost, governance" },
  { domain: "Growth Systems", coverage: 91, confidence: 89, motion: "Attribution, experimentation, content" },
  { domain: "Security", coverage: 84, confidence: 82, motion: "IAM review, control planes" }
];

export const healthTrend: HealthPoint[] = [
  { month: "Q1", revenue: 68, platform: 61, growth: 58 },
  { month: "Q2", revenue: 74, platform: 67, growth: 66 },
  { month: "Q3", revenue: 81, platform: 76, growth: 73 },
  { month: "Q4", revenue: 90, platform: 84, growth: 88 }
];

export const portfolioProjects: PortfolioProject[] = [
  {
    name: "MCP Registry Risk Scanner",
    category: "MCP governance",
    proof: "Manifest risk scoring for unpinned versions, transport posture, credential exposure, and OCI supply-chain drift",
    impact: "Turns MCP server disclosure into something security and procurement teams can actually review",
    status: "Flagship"
  },
  {
    name: "LLM Cost Span Exporter",
    category: "GenAI observability",
    proof: "Usage records normalized into OpenTelemetry GenAI spans with per-call cost attribution",
    impact: "Connects model usage, observability, and finance posture in one portable telemetry surface",
    status: "Flagship"
  },
  {
    name: "Governance Disclosure Operator",
    category: "K8s control planes",
    proof: "Kubernetes CRD that publishes owned ConfigMaps for machine-readable governance disclosure at the edge",
    impact: "Makes the /.well-known/ publishing pattern operational, not just theoretical",
    status: "Strong"
  },
  {
    name: "RAG Evidence Graph",
    category: "Evidence infrastructure",
    proof: "Corpus-level citation graph with phantom and never-cited detection for retrieval-backed systems",
    impact: "Shows evidence integrity beyond a single answer and ties directly into AI Evidence Format thinking",
    status: "Strong"
  }
];

export const operatingTracks: OperatingTrack[] = [
  { track: "Revenue systems", value: 32, color: "#34d399" },
  { track: "Platform governance", value: 24, color: "#60a5fa" },
  { track: "Growth decisioning", value: 27, color: "#f59e0b" },
  { track: "Security controls", value: 17, color: "#a78bfa" }
];

export const commandNotes: CommandNote[] = [
  {
    title: "Toolkit layer is now visible, not implied",
    owner: "Portfolio strategy",
    detail: "The new MCP, telemetry, Kubernetes, adapter, and evidence repos give the public portfolio a real developer-tooling spine underneath the customer-facing surfaces."
  },
  {
    title: "Reference implementations close the suite loop",
    owner: "GitHub positioning",
    detail: "Tool Cards, Agent Cards, AI Evidence, and /.well-known/ distribution now point to concrete implementation repos rather than staying purely normative."
  },
  {
    title: "SEO now depends on crawlable estate stitching",
    owner: "Discovery layer",
    detail: "Apex, docs, examples, pulse, portfolio, and the newer operator surfaces need explicit cross-linking so Search Console sees one maintained network instead of isolated launches."
  }
];

export const toolkitLanes: ToolkitLane[] = [
  {
    lane: "MCP governance",
    count: 3,
    summary: "Manifest scanning, disclosure generation, and tool-surface drift detection for MCP servers.",
    repos: ["mcp-registry-risk-scanner", "mcp-tool-card-generator", "mcp-tools-diff"]
  },
  {
    lane: "GenAI observability",
    count: 3,
    summary: "Canonical usage records, per-call cost spans, and trace-linked retrieval evidence integrity.",
    repos: ["agent-trace-normalizer", "llm-cost-span-exporter", "rag-evidence-trace-linker"]
  },
  {
    lane: "K8s control planes",
    count: 3,
    summary: "Kubernetes operators for disclosure publishing, budget posture, and scheduled governance audits.",
    repos: ["governance-disclosure-operator", "llm-cost-budget-operator", "scheduled-audit-operator"]
  },
  {
    lane: "Agent-runtime adapters",
    count: 2,
    summary: "Adapters that project Kinetic Gain declarations into OpenAI, Anthropic, Gemini, and Vercel-friendly runtime shapes.",
    repos: ["agent-tool-adapters", "agent-card-runtime-adapters"]
  },
  {
    lane: "Knowledge graph + evidence",
    count: 2,
    summary: "Corpus-level citation graphs and /.well-known/ aggregation for evidence and disclosure discovery.",
    repos: ["rag-evidence-graph", "wellknown-index-aggregator"]
  }
];

export const languageAtlas: LanguageAtlasEntry[] = [
  { language: "TypeScript", repos: 222, color: "#60a5fa" },
  { language: "Python", repos: 46, color: "#f97316" },
  { language: "PHP", repos: 17, color: "#38bdf8" },
  { language: "JavaScript", repos: 11, color: "#facc15" },
  { language: "C#", repos: 6, color: "#a78bfa" },
  { language: "Julia", repos: 5, color: "#8b5cf6" },
  { language: "R", repos: 4, color: "#3b82f6" },
  { language: "Kotlin", repos: 3, color: "#fb7185" },
  { language: "Shell / Bash", repos: 3, color: "#22c55e" },
  { language: "Dart", repos: 2, color: "#0ea5e9" },
  { language: "HCL", repos: 2, color: "#6366f1" },
  { language: "CSS", repos: 2, color: "#06b6d4" },
  { language: "Zig", repos: 1, color: "#f59e0b" },
  { language: "Jupyter Notebook", repos: 1, color: "#f97316" }
];

export const industryAtlas: IndustryVerticalEntry[] = [
  { vertical: "AI Platform", repos: 123 },
  { vertical: "Compliance / Governance", repos: 90 },
  { vertical: "Platform Engineering", repos: 79 },
  { vertical: "Revenue Operations", repos: 50 },
  { vertical: "IAM / Security", repos: 31 },
  { vertical: "FinTech", repos: 16 },
  { vertical: "Data Engineering", repos: 15 },
  { vertical: "EdTech", repos: 8 },
  { vertical: "HealthTech", repos: 7 },
  { vertical: "Biotech / Diagnostics", repos: 2 },
  { vertical: "Insurance / InsurTech", repos: 3 },
  { vertical: "Nonprofit / Foundation Ops", repos: 2 },
  { vertical: "Media / Publishing", repos: 2 },
  { vertical: "PropTech / Real Estate", repos: 3 },
  { vertical: "Aerospace / Drones", repos: 3 },
  { vertical: "Robotics", repos: 1 }
];
