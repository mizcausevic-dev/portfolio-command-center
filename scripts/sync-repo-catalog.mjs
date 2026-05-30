import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const outputPath = path.join(repoRoot, "src", "generatedRepoCatalog.json");

const PLATFORM_NAMES = [
  "Kinetic Gain Protocol Suite",
  "Kinetic Gain Implementation Stack",
  "AEO Reference Stack",
  "Agent Operations Suite",
  "Platform Reliability Stack",
  "Decision Intelligence",
  "MCP Servers",
  "Landing Sites",
  "Frontend Showcase"
];

const VERTICAL_ORDER = [
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
  "Aerospace / Drones",
  "Robotics"
];

const platformOverrides = {
  "portfolio-command-center": "Frontend Showcase",
  "kineticgain-com-apex": "Landing Sites",
  "kinetic-gain-docs-hub": "Landing Sites",
  "kinetic-gain-suite-landing": "Landing Sites",
  "kinetic-gain-examples-gallery": "Landing Sites",
  "procurement-pulse-landing": "Landing Sites",
  "mizcausevic-dev": "Landing Sites"
};

const homepageOverrides = {
  "portfolio-command-center": "https://portfolio.kineticgain.com/",
  "kineticgain-com-apex": "https://kineticgain.com/",
  "kinetic-gain-docs-hub": "https://docs.kineticgain.com/",
  "kinetic-gain-suite-landing": "https://suite.kineticgain.com/",
  "kinetic-gain-examples-gallery": "https://examples.kineticgain.com/",
  "procurement-pulse-landing": "https://pulse.kineticgain.com/"
};

const verticalOverrides = {
  "diagnostic-qc-evidence-router": "Biotech / Diagnostics",
  "trial-protocol-deviation-monitor": "Biotech / Diagnostics",
  "assay-release-readiness-board": "Biotech / Diagnostics",
  "care-variation-analysis-notebook-r": "HealthTech",
  "claims-loss-trend-lab-r": "Insurance / InsurTech",
  "claim-evidence-routing-desk": "Insurance / InsurTech",
  "donor-cohort-risk-lab-r": "Nonprofit / Foundation Ops",
  "grant-compliance-evidence-desk": "Nonprofit / Foundation Ops",
  "ukg-workforce-disclosure-mirror": "Revenue Operations",
  "firstup-employee-comm-audit": "Revenue Operations",
  "klaviyo-flow-consent-audit": "Revenue Operations",
  "vwo-experiment-governance-mirror": "Revenue Operations",
  "martech-experiment-evidence-stack": "Revenue Operations",
  "camunda-process-governance": "Platform Engineering",
  "backup-restore-drill-runner": "Platform Engineering",
  "incident-handoff-runbook-kit": "Platform Engineering",
  "release-readiness-shell-kit": "Platform Engineering",
  "ibm-watsonx-governance-bridge": "AI Platform",
  "genesys-cx-disclosure-board": "Revenue Operations",
  "intune-app-protection-lab": "IAM / Security",
  "pii-student-vault-contract-profile": "EdTech",
  "ferpa-readiness-evidence-bundle": "EdTech",
  "student-cohort-bias-coverage-lab": "EdTech",
  "mls-data-access-vault-contract-profile": "PropTech / Real Estate",
  "title-chain-evidence-incident-card-profile": "PropTech / Real Estate",
  "respa-readiness-evidence-bundle": "PropTech / Real Estate",
  "mortgage-applicant-bias-coverage-lab": "PropTech / Real Estate",
  "mortgage-decision-record-audit-stream": "PropTech / Real Estate",
  "state-real-estate-ai-disclosure-tracker": "PropTech / Real Estate",
  "insurance-decision-record-audit-stream": "Insurance / InsurTech",
  "state-insurance-ai-disclosure-tracker": "Insurance / InsurTech",
  "naic-ai-bulletin-readiness-evidence-bundle": "Insurance / InsurTech",
  "insurance-applicant-bias-coverage-lab": "Insurance / InsurTech",
  "unfair-discrimination-incident-card-profile": "Insurance / InsurTech",
  "policyholder-data-vault-contract-profile": "Insurance / InsurTech",
  "employment-decision-record-audit-stream": "HR Tech / Employment AI",
  "state-employment-ai-disclosure-tracker": "HR Tech / Employment AI",
  "eeoc-readiness-evidence-bundle": "HR Tech / Employment AI",
  "employment-candidate-bias-coverage-lab": "HR Tech / Employment AI",
  "employment-ai-incident-card-profile": "HR Tech / Employment AI",
  "candidate-data-vault-contract-profile": "HR Tech / Employment AI",
  "financial-decision-record-audit-stream": "FinTech",
  "state-financial-ai-disclosure-tracker": "FinTech",
  "cfpb-readiness-evidence-bundle": "FinTech",
  "financial-applicant-bias-coverage-lab": "FinTech",
  "financial-ai-incident-card-profile": "FinTech",
  "financial-customer-data-vault-contract-profile": "FinTech",
  "kg-suite-vertical-router": "Platform Engineering",
  "kg-suite-vertical-comparator": "Platform Engineering"
};

function fetchRepos() {
  const raw = execFileSync(
    "gh",
    [
      "repo",
      "list",
      "mizcausevic-dev",
      "--limit",
      "500",
      "--json",
      "name,description,homepageUrl,primaryLanguage,pushedAt,url,repositoryTopics,isArchived"
    ],
    { cwd: repoRoot, encoding: "utf8" }
  );

  return JSON.parse(raw);
}

function normalizeLanguage(repo) {
  const override = repo.primaryLanguage?.name ?? null;
  const topics = (repo.repositoryTopics ?? []).map((entry) => entry.name.toLowerCase());

  const inferred =
    override ??
    (topics.includes("typescript") ? "TypeScript" : null) ??
    (topics.includes("python") ? "Python" : null) ??
    (topics.includes("php") ? "PHP" : null) ??
    (topics.includes("javascript") ? "JavaScript" : null) ??
    (topics.includes("csharp") || topics.includes("dotnet") ? "C#" : null) ??
    (topics.includes("julia") ? "Julia" : null) ??
    (topics.includes("kotlin") ? "Kotlin" : null) ??
    (topics.includes("dart") ? "Dart" : null) ??
    (topics.includes("shell") || topics.includes("bash") ? "Shell" : null) ??
    (topics.includes("r") ? "R" : null) ??
    "Other";

  if (inferred === "Shell") {
    return "Shell / Bash";
  }

  return inferred;
}

function freshnessFor(dateString) {
  const now = Date.now();
  const pushed = new Date(dateString).getTime();
  const ageHours = (now - pushed) / 36e5;

  if (ageHours <= 24) return "24h";
  if (ageHours <= 24 * 7) return "7d";
  if (ageHours <= 24 * 30) return "30d";
  return "older";
}

function matchesAny(haystack, terms) {
  return terms.some((term) => haystack.includes(term));
}

function inferPlatform(repo, homepage, topics, language) {
  if (platformOverrides[repo.name]) {
    return platformOverrides[repo.name];
  }

  const combined = [
    repo.name,
    repo.description ?? "",
    homepage,
    ...topics
  ]
    .join(" ")
    .toLowerCase();

  if (
    matchesAny(combined, [
      "mcp",
      "model-context-protocol"
    ])
  ) {
    return "MCP Servers";
  }

  if (
    matchesAny(combined, [
      "aeo-sdk",
      "aeo cli",
      "aeo-cli",
      "answer-engine-optimization",
      "aeo-protocol"
    ])
  ) {
    return "AEO Reference Stack";
  }

  if (
    matchesAny(combined, [
      "spec",
      "decision-card",
      "incident-card",
      "agent-card",
      "protocol-suite",
      "json schema"
    ])
  ) {
    return "Kinetic Gain Protocol Suite";
  }

  if (
    matchesAny(combined, [
      "landing",
      "docs hub",
      "docs.kineticgain.com",
      "examples.kineticgain.com",
      "suite.kineticgain.com",
      "pulse.kineticgain.com"
    ])
  ) {
    return "Landing Sites";
  }

  if (
    matchesAny(combined, [
      "agent",
      "observability",
      "trace",
      "rag",
      "prompt injection",
      "llm-monitoring"
    ])
  ) {
    return "Agent Operations Suite";
  }

  if (
    matchesAny(combined, [
      "latency",
      "retry",
      "error-budget",
      "bulkhead",
      "release-readiness",
      "runbook",
      "backup",
      "restore",
      "reliability"
    ])
  ) {
    return "Platform Reliability Stack";
  }

  if (
    matchesAny(combined, [
      "policybundle",
      "decision",
      "evidence",
      "procurement",
      "scenario",
      "ranking"
    ])
  ) {
    return "Decision Intelligence";
  }

  if (
    homepage.includes("kineticgain.com") ||
    matchesAny(combined, [
      "dashboard",
      "command center",
      "control plane",
      "console",
      "react",
      "frontend",
      "operator surface",
      "operator console"
    ]) ||
    ["TypeScript", "Flutter", "Dart", "CSS", "HTML"].includes(language)
  ) {
    return "Frontend Showcase";
  }

  return "Kinetic Gain Implementation Stack";
}

function inferVertical(repo, topics, homepage) {
  if (verticalOverrides[repo.name]) {
    return verticalOverrides[repo.name];
  }

  const combined = [
    repo.name,
    repo.description ?? "",
    homepage,
    ...topics
  ]
    .join(" ")
    .toLowerCase();

  const checks = [
    ["Biotech / Diagnostics", ["biotech", "diagnostic", "diagnostics", "assay", "trial", "qc", "specimen", "sequencing", "genomics", "calibration"]],
    ["HealthTech", ["clinical", "patient", "prior-authorization", "care", "health", "medical", "consent"]],
    ["Insurance / InsurTech", ["claim", "claims", "loss", "reserve", "underwriting", "insurance"]],
    ["Nonprofit / Foundation Ops", ["donor", "grant", "foundation", "nonprofit", "fundraising", "appeal"]],
    ["PropTech / Real Estate", ["lease", "tenant", "vacancy", "building", "property", "real estate", "proptech"]],
    ["Robotics", ["robot", "robotics", "sensor-health", "mission-failure", "human-override"]],
    ["Aerospace / Drones", ["drone", "drones", "aerospace", "mission"]],
    ["FinTech", ["payment", "payments", "treasury", "merchant", "kyc", "fintech", "reconciliation", "settlement"]],
    ["Data Engineering", ["bigquery", "tableau", "powerbi", "snowflake", "warehouse", "reporting", "analytics", "catalog-schema"]],
    ["EdTech", ["edtech", "student", "classroom", "tutor", "advisor", "education", "school", "district", "ferpa"]],
    ["IAM / Security", ["intune", "entra", "okta", "defender", "sentinel", "guardduty", "iam", "identity", "conditional-access", "app-protection", "security", "security-operations", "access-review"]],
    ["Revenue Operations", ["klaviyo", "vwo", "campaign", "creator", "booking", "genesys", "revenue-operations", "growth", "martech", "dispatch"]],
    ["Compliance / Governance", ["compliance", "governance", "policy", "disclosure", "audit", "evidence", "obligation", "clause", "regulatory", "approval", "retention"]],
    ["Platform Engineering", ["platform-engineering", "workflow", "camunda", "integration", "release", "backup", "restore", "grid", "downtime", "shipment", "supply-chain", "runbook"]],
    ["AI Platform", ["ai", "llm", "mcp", "rag", "prompt", "watsonx", "agent-card", "model", "a2a", "openai", "copilot"]],
    ["Media / Publishing", ["editorial", "rights", "research-policy", "publishing", "release-planner"]]
  ];

  for (const [vertical, terms] of checks) {
    if (matchesAny(combined, terms)) {
      return vertical;
    }
  }

  return "Platform Engineering";
}

function cleanHomepage(repo) {
  const explicit = homepageOverrides[repo.name] ?? (repo.homepageUrl || "").trim();

  if (explicit) {
    return explicit;
  }

  const description = repo.description ?? "";
  const directMatch = description.match(/https?:\/\/[^\s)]+/i);
  if (directMatch) {
    return directMatch[0].replace(/[.)]+$/, "");
  }

  const domainMatch = description.match(/\b([a-z0-9-]+\.kineticgain\.com)\b/i);
  if (domainMatch) {
    return `https://${domainMatch[1]}`;
  }

  return "";
}

function inferSubdomain(homepage, githubUrl) {
  if (!homepage) {
    return new URL(githubUrl).hostname;
  }

  try {
    return new URL(homepage).hostname;
  } catch {
    return homepage.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}

function titleCaseRepo(name) {
  return name
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}

function buildCatalog() {
  const repos = fetchRepos()
    .filter((repo) => !repo.isArchived)
    .map((repo) => {
      const topics = (repo.repositoryTopics ?? []).map((entry) => entry.name);
      const homepage = cleanHomepage(repo);
      const language = normalizeLanguage(repo);
      const platform = inferPlatform(repo, homepage, topics.map((entry) => entry.toLowerCase()), language);
      const vertical = inferVertical(repo, topics.map((entry) => entry.toLowerCase()), homepage);

      return {
        name: titleCaseRepo(repo.name),
        slug: repo.name,
        url: homepage || repo.url,
        platform,
        vertical,
        language,
        freshness: freshnessFor(repo.pushedAt),
        subdomain: inferSubdomain(homepage, repo.url),
        description: (repo.description || "Public repo in the Kinetic Gain portfolio.").trim(),
        topics: topics.slice(0, 6),
        pushedAt: repo.pushedAt,
        homepageUrl: homepage,
        githubUrl: repo.url
      };
    })
    .sort((left, right) => right.pushedAt.localeCompare(left.pushedAt));

  return repos.map(({ pushedAt, homepageUrl, githubUrl, ...repo }) => repo);
}

const catalog = buildCatalog();
writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

console.log(`Wrote ${catalog.length} repos to ${outputPath}`);
