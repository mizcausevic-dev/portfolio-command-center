import {
  CommandNote,
  HealthPoint,
  OperatingTrack,
  PortfolioProject,
  Signal,
  SystemDomain,
  ToolkitLane
} from "./types";

export const topSignals: Signal[] = [
  { label: "Toolkit repos", value: "14", delta: "Across 5 implementation lanes", tone: "positive" },
  { label: "Live properties", value: "22", delta: "Suite, Atlas, hubs, and operator surfaces", tone: "neutral" },
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
