import {
  CommandNote,
  HealthPoint,
  OperatingTrack,
  PortfolioProject,
  Signal,
  SystemDomain
} from "./types";

export const topSignals: Signal[] = [
  { label: "Operating systems shipped", value: "12", delta: "Backend + frontend mix", tone: "positive" },
  { label: "Executive visibility", value: "9 domains", delta: "Revenue to security", tone: "neutral" },
  { label: "Workflow depth", value: "32 flows", delta: "Routing, forecasting, identity, content", tone: "positive" },
  { label: "Portfolio readiness", value: "94", delta: "Case-study level polish", tone: "watch" }
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
    name: "Revenue Ops AI Assistant",
    category: "AI + Revenue",
    proof: "Account briefs, pipeline summaries, campaign insight flows",
    impact: "Shows modern AI decision layer tied to commercial systems",
    status: "Flagship"
  },
  {
    name: "Executive Operations Dashboard",
    category: "Frontend + Strategy",
    proof: "Unified cross-domain view across operations, revenue, cost, and governance",
    impact: "Demonstrates executive-grade product sense and systems framing",
    status: "Flagship"
  },
  {
    name: "Identity Command Center",
    category: "Security + UX",
    proof: "Access posture, exception queue, remediation workflows",
    impact: "Shows control-plane design beyond generic admin surfaces",
    status: "Strong"
  },
  {
    name: "Revenue Forecasting Workbench",
    category: "Planning + Frontend",
    proof: "Commit quality, scenario planning, deal-risk visualization",
    impact: "Translates commercial forecasting into operator-facing product logic",
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
    title: "Frontend layer now matches backend depth",
    owner: "Portfolio strategy",
    detail: "Command-center, deal-desk, attribution, forecasting, and identity UIs now prove product execution, not just APIs."
  },
  {
    title: "Portfolio reads like one operating model",
    owner: "GitHub positioning",
    detail: "The project mix now supports a coherent story across growth systems, platform architecture, security, and executive decisioning."
  },
  {
    title: "Next leverage point is richer case-study cross-linking",
    owner: "Content strategy",
    detail: "When mizcausevic.com project pages are live, badge and README links should route to owned long-form project narratives."
  }
];
