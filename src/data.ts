import { IndustryVerticalEntry, LanguageAtlasEntry, NamedPlatform, RepoEntry, SnapshotStat } from "./types";

export const portfolioSnapshot: {
  snapshotLabel: string;
  totalRepos: number;
  languageCount: number;
  platformCount: number;
  verticalCount: number;
  stats: SnapshotStat[];
} = {
  snapshotLabel: "Portfolio Constellation · Snapshot May 28, 2026, 3:06 PM",
  totalRepos: 372,
  languageCount: 24,
  platformCount: 9,
  verticalCount: 16,
  stats: [
    { value: "372", label: "total repos" },
    { value: "24", label: "languages" },
    { value: "121", label: "pushed in 24h" },
    { value: "226", label: "pushed in 7d" },
    { value: "9", label: "platforms" },
    { value: "16", label: "verticals" }
  ]
};

export const namedPlatforms: NamedPlatform[] = [
  {
    name: "Kinetic Gain Protocol Suite",
    count: 12,
    description:
      "Eleven open JSON specs for the answer-engine and agent era. Spec text plus JSON Schema plus canonical examples per repo.",
    repos: [
      { name: "kinetic-gain-protocol-suite", url: "https://github.com/mizcausevic-dev/kinetic-gain-protocol-suite" },
      { name: "aeo-protocol-spec", url: "https://github.com/mizcausevic-dev/aeo-protocol-spec" },
      { name: "ai-procurement-decision-spec", url: "https://github.com/mizcausevic-dev/ai-procurement-decision-spec" },
      { name: "ai-incident-card-spec", url: "https://github.com/mizcausevic-dev/ai-incident-card-spec" },
      { name: "clinical-ai-disclosure-spec", url: "https://github.com/mizcausevic-dev/clinical-ai-disclosure-spec" }
    ],
    footer: "+ 7 more",
    tone: "bert"
  },
  {
    name: "Kinetic Gain Implementation Stack",
    count: 18,
    description:
      "Software that consumes the Suite specs: drafters, validators, policy engines, registries, attestation, audit-stream, and MCP servers.",
    repos: [
      { name: "kg-hosted-validator", url: "https://github.com/mizcausevic-dev/kg-hosted-validator" },
      { name: "aeo-registry", url: "https://github.com/mizcausevic-dev/aeo-registry" },
      { name: "audit-stream-py", url: "https://github.com/mizcausevic-dev/audit-stream-py" },
      { name: "kg-governance-dashboard", url: "https://github.com/mizcausevic-dev/kg-governance-dashboard" },
      { name: "audit-stream-prometheus", url: "https://github.com/mizcausevic-dev/audit-stream-prometheus" }
    ],
    footer: "+ 13 more",
    tone: "bert"
  },
  {
    name: "AEO Reference Stack",
    count: 13,
    description:
      "Five-layer reference implementation for the AEO Protocol: SDKs across five languages, a CLI, a BFS crawler, an always-on validator service, and an HTTP graph-query service.",
    repos: [
      { name: "aeo-cli", url: "https://github.com/mizcausevic-dev/aeo-cli" },
      { name: "aeo-sdk-swift", url: "https://github.com/mizcausevic-dev/aeo-sdk-swift" },
      { name: "aeo-sdk-go", url: "https://github.com/mizcausevic-dev/aeo-sdk-go" },
      { name: "aeo-sdk-rust", url: "https://github.com/mizcausevic-dev/aeo-sdk-rust" },
      { name: "aeo-sdk-typescript", url: "https://github.com/mizcausevic-dev/aeo-sdk-typescript" }
    ],
    footer: "+ 8 more",
    tone: "cyan"
  },
  {
    name: "Agent Operations Suite",
    count: 23,
    description:
      "Production primitives for AI agent fleets: routing, eval gates, canary rollout, governance-as-code, observability, identity, and redaction.",
    repos: [
      { name: "prompt-injection-bench-web", url: "https://github.com/mizcausevic-dev/prompt-injection-bench-web" },
      { name: "agent-codex", url: "https://github.com/mizcausevic-dev/agent-codex" },
      { name: "agentobserve-dashboard", url: "https://github.com/mizcausevic-dev/agentobserve-dashboard" },
      { name: "mcp-sentinel-dashboard", url: "https://github.com/mizcausevic-dev/mcp-sentinel-dashboard" },
      { name: "rag-sentinel-dashboard", url: "https://github.com/mizcausevic-dev/rag-sentinel-dashboard" }
    ],
    footer: "+ 18 more",
    tone: "plum"
  },
  {
    name: "Platform Reliability Stack",
    count: 17,
    description:
      "Async reliability primitives plus SRE math: rate limiter, circuit breaker, retry, bulkhead, SLO and error-budget tracking, and request shadowing.",
    repos: [
      { name: "latency-distribution-analyzer", url: "https://github.com/mizcausevic-dev/latency-distribution-analyzer" },
      { name: "release-readiness-gatekeeper", url: "https://github.com/mizcausevic-dev/release-readiness-gatekeeper" },
      { name: "error-budget-allocator", url: "https://github.com/mizcausevic-dev/error-budget-allocator" },
      { name: "dependency-drift-watch", url: "https://github.com/mizcausevic-dev/dependency-drift-watch" },
      { name: "support-escalation-router", url: "https://github.com/mizcausevic-dev/support-escalation-router" }
    ],
    footer: "+ 12 more",
    tone: "amber"
  },
  {
    name: "Decision Intelligence",
    count: 11,
    description:
      "Buyer-side governance: Decision Cards to PolicyBundles to live request enforcement to contract ownership to incident remediation graphs.",
    repos: [
      { name: "policy-decision-simulator", url: "https://github.com/mizcausevic-dev/policy-decision-simulator" },
      { name: "executive-briefing-studio", url: "https://github.com/mizcausevic-dev/executive-briefing-studio" },
      { name: "scenario-planning-atlas", url: "https://github.com/mizcausevic-dev/scenario-planning-atlas" },
      { name: "evidence-ranking-engine", url: "https://github.com/mizcausevic-dev/evidence-ranking-engine" },
      { name: "decision-memory-engine", url: "https://github.com/mizcausevic-dev/decision-memory-engine" }
    ],
    footer: "+ 6 more",
    tone: "rose"
  },
  {
    name: "MCP Servers",
    count: 38,
    description:
      "Model Context Protocol servers exposing portfolio capabilities as Claude-callable tools. One config entry per server.",
    repos: [
      { name: "mcp-tool-card-fleet-summary-action", url: "https://github.com/mizcausevic-dev/mcp-tool-card-fleet-summary-action" },
      { name: "kg-protocol-detect-action", url: "https://github.com/mizcausevic-dev/kg-protocol-detect-action" },
      { name: "mcp-kinetic-gain", url: "https://github.com/mizcausevic-dev/mcp-kinetic-gain" },
      { name: "mcp-session-recorder", url: "https://github.com/mizcausevic-dev/mcp-session-recorder" },
      { name: "mcp-sentinel-dashboard", url: "https://github.com/mizcausevic-dev/mcp-sentinel-dashboard" }
    ],
    footer: "+ 33 more",
    tone: "plum"
  },
  {
    name: "Landing Sites",
    count: 12,
    description:
      "Per-spec landing pages, gallery and directory properties, and hub sites - the public face of the suite across *.kineticgain.com.",
    repos: [
      { name: "procurement-pulse-landing", url: "https://github.com/mizcausevic-dev/procurement-pulse-landing" },
      { name: "kinetic-gain-suite-landing", url: "https://github.com/mizcausevic-dev/kinetic-gain-suite-landing" },
      { name: "clinical-ai-disclosure-landing", url: "https://github.com/mizcausevic-dev/clinical-ai-disclosure-landing" },
      { name: "student-ai-disclosure-landing", url: "https://github.com/mizcausevic-dev/student-ai-disclosure-landing" },
      { name: "prompt-provenance-landing", url: "https://github.com/mizcausevic-dev/prompt-provenance-landing" }
    ],
    footer: "+ 7 more",
    tone: "cyan"
  },
  {
    name: "Frontend Showcase",
    count: 23,
    description:
      "Standalone React, Vue, Flutter web, and TypeScript apps demonstrating dashboards, control rooms, command centers, and operator surfaces.",
    repos: [
      { name: "kinetic-gain-visualizer", url: "https://github.com/mizcausevic-dev/kinetic-gain-visualizer" },
      { name: "kinetic-gain-operator-console", url: "https://github.com/mizcausevic-dev/kinetic-gain-operator-console" },
      { name: "portfolio-command-center", url: "https://github.com/mizcausevic-dev/portfolio-command-center" },
      { name: "flutter-operator-console", url: "https://github.com/mizcausevic-dev/flutter-operator-console" },
      { name: "gitvisualizer", url: "https://github.com/mizcausevic-dev/gitvisualizer" }
    ],
    footer: "+ 18 more",
    tone: "cyan"
  }
];

export const languageAtlas: LanguageAtlasEntry[] = [
  { language: "TypeScript", repos: 222, color: "#4f92e7" },
  { language: "Python", repos: 46, color: "#ea5b2e" },
  { language: "PHP", repos: 17, color: "#d7a785" },
  { language: "JavaScript", repos: 11, color: "#efd540" },
  { language: "C#", repos: 6, color: "#b46ad3" },
  { language: "Julia", repos: 5, color: "#9c6ad9" },
  { language: "R", repos: 4, color: "#2f9ef7" },
  { language: "Kotlin", repos: 3, color: "#8d65ff" },
  { language: "Shell / Bash", repos: 3, color: "#6cd94e" },
  { language: "Dart", repos: 2, color: "#20a7ff" },
  { language: "HCL", repos: 2, color: "#7065ff" },
  { language: "CSS", repos: 2, color: "#1cb8ff" },
  { language: "Zig", repos: 1, color: "#ffb533" },
  { language: "Jupyter Notebook", repos: 1, color: "#ff7f3f" }
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

export const repoCatalog: RepoEntry[] = [
  {
    name: "IBM watsonx Governance Bridge",
    slug: "ibm-watsonx-governance-bridge",
    url: "https://watsonx.kineticgain.com/",
    platform: "Kinetic Gain Implementation Stack",
    vertical: "AI Platform",
    language: "Python",
    freshness: "24h",
    subdomain: "watsonx.kineticgain.com",
    description: "Request-time governance bridge for IBM watsonx.ai with Decision Card enforcement."
  },
  {
    name: "Genesys CX Disclosure Board",
    slug: "genesys-cx-disclosure-board",
    url: "https://genesys.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Revenue Operations",
    language: "TypeScript",
    freshness: "24h",
    subdomain: "genesys.kineticgain.com",
    description: "Bot notice coverage, consent evidence, escalation routing, and queue-safe review posture."
  },
  {
    name: "Camunda Process Governance",
    slug: "camunda-process-governance",
    url: "https://process.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Platform Engineering",
    language: "TypeScript",
    freshness: "24h",
    subdomain: "process.kineticgain.com",
    description: "Process execution governance, timer drift, and audit-safe workflow handoffs."
  },
  {
    name: "Klaviyo Flow Consent Audit",
    slug: "klaviyo-flow-consent-audit",
    url: "https://flows.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Revenue Operations",
    language: "TypeScript",
    freshness: "24h",
    subdomain: "flows.kineticgain.com",
    description: "Consent evidence, suppression hygiene, and delivery-safe lifecycle sequencing."
  },
  {
    name: "VWO Experiment Governance Mirror",
    slug: "vwo-experiment-governance-mirror",
    url: "https://experiments.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Revenue Operations",
    language: "TypeScript",
    freshness: "24h",
    subdomain: "experiments.kineticgain.com",
    description: "Experiment guardrails, release evidence, and attribution-safe rollout posture."
  },
  {
    name: "MarTech Experiment Evidence Stack",
    slug: "martech-experiment-evidence-stack",
    url: "https://martech.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Revenue Operations",
    language: "TypeScript",
    freshness: "24h",
    subdomain: "martech.kineticgain.com",
    description: "Cross-stack growth experiment evidence, activation posture, and post-launch proof."
  },
  {
    name: "Entra Access Review Control Plane",
    slug: "entra-access-review-control-plane",
    url: "https://entra.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "IAM / Security",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "entra.kineticgain.com",
    description: "Access review ownership, role-drift signal, and privileged entitlement posture."
  },
  {
    name: "Intune Device Compliance Ops",
    slug: "intune-device-compliance-ops",
    url: "https://intune.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "IAM / Security",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "intune.kineticgain.com",
    description: "Device compliance, jailbreak detection, remediation routing, and fleet proof."
  },
  {
    name: "M365 Retention Case Orchestrator",
    slug: "m365-retention-case-orchestrator",
    url: "https://retention.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Compliance / Governance",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "retention.kineticgain.com",
    description: "Purview retention case posture, eDiscovery readiness, and disposition evidence."
  },
  {
    name: "Intune App Protection Lab",
    slug: "intune-app-protection-lab",
    url: "https://protect.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "IAM / Security",
    language: "TypeScript",
    freshness: "24h",
    subdomain: "protect.kineticgain.com",
    description: "Operator surface for Microsoft Intune app protection, BYOD scope, policy gaps, and enforcement posture."
  },
  {
    name: "Defender Exposure Ops Center",
    slug: "defender-exposure-ops-center",
    url: "https://defender.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "IAM / Security",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "defender.kineticgain.com",
    description: "Exposure remediation, asset risk ranking, and control-gap review."
  },
  {
    name: "Sentinel Detection Coverage Board",
    slug: "sentinel-detection-coverage-board",
    url: "https://sentinel.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "IAM / Security",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "sentinel.kineticgain.com",
    description: "Detection coverage, analytic rule drift, and incident-readiness signal."
  },
  {
    name: "Conditional Access Posture Board",
    slug: "conditional-access-posture-board",
    url: "https://access.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "IAM / Security",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "access.kineticgain.com",
    description: "Policy drift, exclusion evidence, exception routing, and change review."
  },
  {
    name: "Okta Access Review Orchestrator",
    slug: "okta-access-review-orchestrator",
    url: "https://okta.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "IAM / Security",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "okta.kineticgain.com",
    description: "Recertification workflow, guest drift evidence, and owner routing."
  },
  {
    name: "AWS IAM Access Analyzer Console",
    slug: "aws-iam-access-analyzer-console",
    url: "https://aws.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "IAM / Security",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "aws.kineticgain.com",
    description: "Cross-account trust posture, analyzer findings, and remediation queues."
  },
  {
    name: "AWS GuardDuty Triage Board",
    slug: "aws-guardduty-triage-board",
    url: "https://guardduty.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "IAM / Security",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "guardduty.kineticgain.com",
    description: "Threat-finding triage, detector hygiene, and incident routing."
  },
  {
    name: "GCP IAM Policy Diff Lab",
    slug: "gcp-iam-policy-diff-lab",
    url: "https://gcp.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "IAM / Security",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "gcp.kineticgain.com",
    description: "Org policy drift, binding differences, and review-safe IAM snapshots."
  },
  {
    name: "GCP Billing Anomaly Router",
    slug: "gcp-billing-anomaly-router",
    url: "https://billing.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Data Engineering",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "billing.kineticgain.com",
    description: "Budget breach routing, billing anomaly triage, and escalation posture."
  },
  {
    name: "Azure Landing-Zone Drift Radar",
    slug: "azure-landing-zone-drift-radar",
    url: "https://zone.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Platform Engineering",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "zone.kineticgain.com",
    description: "Landing-zone guardrails, baseline drift, and remediation proof."
  },
  {
    name: "Snowflake Cost Governance Studio",
    slug: "snowflake-cost-governance-studio",
    url: "https://warehouse.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Data Engineering",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "warehouse.kineticgain.com",
    description: "Warehouse hygiene, credit burn, and role-aware query cost posture."
  },
  {
    name: "BigQuery Query Cost Watch",
    slug: "bigquery-query-cost-watch",
    url: "https://bigquery.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Data Engineering",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "bigquery.kineticgain.com",
    description: "Scheduled query drift, slot pressure, and spend-safe review windows."
  },
  {
    name: "Power BI Refresh Reliability Hub",
    slug: "powerbi-refresh-reliability-hub",
    url: "https://powerbi.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Data Engineering",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "powerbi.kineticgain.com",
    description: "Refresh queues, dependency blockers, and delivery-safe BI posture."
  },
  {
    name: "Tableau Permission Audit Lab",
    slug: "tableau-permission-audit-lab",
    url: "https://tableau.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Data Engineering",
    language: "TypeScript",
    freshness: "7d",
    subdomain: "tableau.kineticgain.com",
    description: "Workbook permission drift, certification gaps, and access evidence."
  },
  {
    name: "Regulatory Comment Intelligence Hub",
    slug: "regulatory-comment-intelligence-hub",
    url: "https://dockets.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Compliance / Governance",
    language: "TypeScript",
    freshness: "30d",
    subdomain: "dockets.kineticgain.com",
    description: "Docket triage, obligation mapping, and approval posture for comment workflows."
  },
  {
    name: "Contract Clause Obligation Graph",
    slug: "contract-clause-obligation-graph",
    url: "https://clauses.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Compliance / Governance",
    language: "TypeScript",
    freshness: "30d",
    subdomain: "clauses.kineticgain.com",
    description: "Clause ownership, deadline pressure, and obligation-safe contract routing."
  },
  {
    name: "Prior-Authorization Evidence Router",
    slug: "prior-authorization-evidence-router",
    url: "https://priorauth.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "HealthTech",
    language: "TypeScript",
    freshness: "30d",
    subdomain: "priorauth.kineticgain.com",
    description: "Denial pressure, appeal readiness, and evidence-safe prior-auth routing."
  },
  {
    name: "Patient Consent Audit Stream",
    slug: "patient-consent-audit-stream",
    url: "https://consent.kineticgain.com/",
    platform: "Kinetic Gain Implementation Stack",
    vertical: "HealthTech",
    language: "Python",
    freshness: "30d",
    subdomain: "consent.kineticgain.com",
    description: "Append-only consent events, replay-safe history, and audit evidence trails."
  },
  {
    name: "Gov-Comment Ingestor",
    slug: "gov-comment-ingestor",
    url: "https://ingestor.kineticgain.com/",
    platform: "Kinetic Gain Implementation Stack",
    vertical: "Compliance / Governance",
    language: "Go",
    freshness: "30d",
    subdomain: "ingestor.kineticgain.com",
    description: "Go intake pipeline for regulatory comments, signals, and docket enrichment."
  },
  {
    name: "Regulatory Reporting Mart",
    slug: "regulatory-reporting-mart",
    url: "https://reporting.kineticgain.com/",
    platform: "Kinetic Gain Implementation Stack",
    vertical: "Compliance / Governance",
    language: "Python",
    freshness: "30d",
    subdomain: "reporting.kineticgain.com",
    description: "Reporting mart with deadline pressure, evidence packets, and regulator-ready outputs."
  },
  {
    name: "Diagnostic QC Evidence Router",
    slug: "diagnostic-qc-evidence-router",
    url: "https://diagnostics.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Biotech / Diagnostics",
    language: "C#",
    freshness: "24h",
    subdomain: "diagnostics.kineticgain.com",
    description: "QC evidence routing, release-safe diagnostics review, and synthetic lab proof."
  },
  {
    name: "Trial Protocol Deviation Monitor",
    slug: "trial-protocol-deviation-monitor",
    url: "https://trials.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Biotech / Diagnostics",
    language: "TypeScript",
    freshness: "24h",
    subdomain: "trials.kineticgain.com",
    description: "Deviation routing, CAPA posture, and protocol-safe trial evidence tracking."
  },
  {
    name: "Care Variation Analysis Notebook",
    slug: "care-variation-analysis-notebook-r",
    url: "https://care.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "HealthTech",
    language: "R",
    freshness: "24h",
    subdomain: "care.kineticgain.com",
    description: "Synthetic care variation analysis, cohort drift, and readmission-safe review posture."
  },
  {
    name: "Donor Cohort Risk Lab",
    slug: "donor-cohort-risk-lab-r",
    url: "https://donors.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Nonprofit / Foundation Ops",
    language: "R",
    freshness: "24h",
    subdomain: "donors.kineticgain.com",
    description: "Donor retention, cohort risk, and appeal posture modeled in R."
  },
  {
    name: "Backup Restore Drill Runner",
    slug: "backup-restore-drill-runner",
    url: "https://backup.kineticgain.com/",
    platform: "Platform Reliability Stack",
    vertical: "Platform Engineering",
    language: "Shell / Bash",
    freshness: "24h",
    subdomain: "backup.kineticgain.com",
    description: "Recovery timing, restore blockers, and drill evidence in a shell-native surface."
  },
  {
    name: "Incident Handoff Runbook Kit",
    slug: "incident-handoff-runbook-kit",
    url: "https://runbook.kineticgain.com/",
    platform: "Platform Reliability Stack",
    vertical: "Platform Engineering",
    language: "Shell / Bash",
    freshness: "24h",
    subdomain: "runbook.kineticgain.com",
    description: "Ownership handoffs, evidence packets, and escalation-safe incident runbooks."
  },
  {
    name: "Release Readiness Shell Kit",
    slug: "release-readiness-shell-kit",
    url: "https://release.kineticgain.com/",
    platform: "Platform Reliability Stack",
    vertical: "Platform Engineering",
    language: "Shell / Bash",
    freshness: "24h",
    subdomain: "release.kineticgain.com",
    description: "Launch windows, dependency blockers, rollback readiness, and freeze posture."
  },
  {
    name: "Access Certification API",
    slug: "access-certification-api-dotnet",
    url: "https://certs.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "IAM / Security",
    language: "C#",
    freshness: "24h",
    subdomain: "certs.kineticgain.com",
    description: "Campaign ownership, review exceptions, and attestation posture in .NET."
  },
  {
    name: "Yield Forecast Studio",
    slug: "yield-forecast-studio",
    url: "https://yield.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Revenue Operations",
    language: "Julia",
    freshness: "24h",
    subdomain: "yield.kineticgain.com",
    description: "Constrained allocation, yield forecasting, and inventory-safe scenario diffs."
  },
  {
    name: "WordPress Member Journey Consent Kit",
    slug: "wordpress-member-journey-consent-kit",
    url: "https://members.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Revenue Operations",
    language: "PHP",
    freshness: "24h",
    subdomain: "members.kineticgain.com",
    description: "Consent evidence and member journey approval posture in WordPress."
  },
  {
    name: "Brand Governance Styleguide",
    slug: "brand-governance-styleguide",
    url: "https://style.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Media / Publishing",
    language: "CSS",
    freshness: "24h",
    subdomain: "style.kineticgain.com",
    description: "Design token system, approval desk, and brand-safe pattern library."
  },
  {
    name: "Claims Loss Trend Lab",
    slug: "claims-loss-trend-lab-r",
    url: "https://loss.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Insurance / InsurTech",
    language: "R",
    freshness: "24h",
    subdomain: "loss.kineticgain.com",
    description: "Loss-ratio drift, reserve-gap review, and quarter-close posture in R."
  },
  {
    name: "WordPress Regulatory Disclosure Kit",
    slug: "wordpress-regulatory-disclosure-kit",
    url: "https://disclosure.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Compliance / Governance",
    language: "PHP",
    freshness: "30d",
    subdomain: "disclosure.kineticgain.com",
    description: "Schema-aligned service disclaimers and approval evidence in WordPress."
  },
  {
    name: "Clause Obligation Ledger",
    slug: "clause-obligation-ledger-rs",
    url: "https://ledger.kineticgain.com/",
    platform: "Kinetic Gain Implementation Stack",
    vertical: "Compliance / Governance",
    language: "Rust",
    freshness: "30d",
    subdomain: "ledger.kineticgain.com",
    description: "Rust append-only obligation ledger with replay-safe event ordering."
  },
  {
    name: "Field Audit Mobile",
    slug: "field-audit-mobile",
    url: "https://field.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "Platform Engineering",
    language: "Kotlin",
    freshness: "30d",
    subdomain: "field.kineticgain.com",
    description: "Offline-first field audit surface for evidence capture and supervisor review."
  },
  {
    name: "Flutter Operator Console",
    slug: "flutter-operator-console",
    url: "https://flutter.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "AI Platform",
    language: "Dart",
    freshness: "30d",
    subdomain: "flutter.kineticgain.com",
    description: "Flutter web control surface for queues, operator handoffs, and verification proof."
  },
  {
    name: "Research Policy Disclosure Console",
    slug: "research-policy-disclosure-console",
    url: "https://research.kineticgain.com/",
    platform: "Frontend Showcase",
    vertical: "EdTech",
    language: "TypeScript",
    freshness: "24h",
    subdomain: "research.kineticgain.com",
    description: "Disclosure routing, review queues, and research-safe evidence posture."
  }
];
