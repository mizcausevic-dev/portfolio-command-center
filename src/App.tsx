import { useDeferredValue, useMemo, useState } from "react";
import {
  industryAtlas,
  languageAtlas,
  namedPlatforms,
  portfolioSnapshot,
  repoCatalog
} from "./data";

const PRODUCT_TAG_RULES = [
  { tag: "Camunda", terms: ["camunda"] },
  { tag: "IBM", terms: ["ibm", "watsonx", "app connect"] },
  { tag: "CyberArk", terms: ["cyberark"] },
  { tag: "UKG", terms: ["ukg"] },
  { tag: "Azure", terms: ["azure", "entra", "intune", "m365", "microsoft 365", "purview", "powerbi", "power bi", "sentinel", "defender"] },
  { tag: "AWS", terms: ["aws", "guardduty", "iam access analyzer"] },
  { tag: "GCP", terms: ["gcp", "bigquery", "google cloud"] },
  { tag: "Klaviyo", terms: ["klaviyo"] },
  { tag: "VWO", terms: ["vwo"] },
  { tag: "FirstUp", terms: ["firstup"] },
  { tag: "Genesys", terms: ["genesys"] },
  { tag: "Okta", terms: ["okta"] },
  { tag: "Snowflake", terms: ["snowflake"] },
  { tag: "Tableau", terms: ["tableau"] },
  { tag: "Power BI", terms: ["powerbi", "power bi"] }
] as const;

const toneByVertical: Record<string, string> = {
  "AI Platform": "cyan",
  "Compliance / Governance": "rose",
  "Platform Engineering": "bert",
  "Revenue Operations": "cyan",
  "IAM / Security": "bert",
  FinTech: "amber",
  "Data Engineering": "plum",
  EdTech: "plum",
  HealthTech: "rose",
  "Biotech / Diagnostics": "rose",
  "Insurance / InsurTech": "amber",
  "Nonprofit / Foundation Ops": "plum",
  "Media / Publishing": "rose",
  "PropTech / Real Estate": "cyan",
  "Aerospace / Drones": "cyan",
  Robotics: "plum"
};

function inferProductTags(entry: (typeof repoCatalog)[number]) {
  const haystack = [
    entry.slug,
    entry.description,
    entry.platform,
    entry.vertical,
    entry.subdomain,
    ...(entry.topics ?? [])
  ]
    .join(" ")
    .toLowerCase();

  return PRODUCT_TAG_RULES.filter((rule) => rule.terms.some((term) => haystack.includes(term.toLowerCase()))).map(
    (rule) => rule.tag
  );
}

function topProductTags(entries: (typeof repoCatalog), limit: number) {
  const counts = new Map<string, number>();

  entries.forEach((entry) => {
    inferProductTags(entry).forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([tag]) => tag);
}

function App() {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all platforms");
  const [vertical, setVertical] = useState("all verticals");
  const [language, setLanguage] = useState("all languages");
  const [freshness, setFreshness] = useState("any freshness");
  const [hoveredVertical, setHoveredVertical] = useState<string | null>(null);
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);

  const deferredQuery = useDeferredValue(query);

  const maxLanguageRepos = Math.max(...languageAtlas.map((entry) => entry.repos));

  const platformOptions = useMemo(
    () => ["all platforms", ...namedPlatforms.map((entry) => entry.name)],
    []
  );

  const verticalOptions = useMemo(
    () => ["all verticals", ...industryAtlas.map((entry) => entry.vertical)],
    []
  );

  const languageOptions = useMemo(
    () => ["all languages", ...languageAtlas.map((entry) => entry.language)],
    []
  );

  const languageColorMap = useMemo(
    () =>
      Object.fromEntries(languageAtlas.map((entry) => [entry.language, entry.color])) as Record<string, string>,
    []
  );

  const filteredRepos = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();

    return repoCatalog.filter((entry) => {
      if (platform !== "all platforms" && entry.platform !== platform) {
        return false;
      }

      if (vertical !== "all verticals" && entry.vertical !== vertical) {
        return false;
      }

      if (language !== "all languages" && entry.language !== language) {
        return false;
      }

      if (freshness !== "any freshness" && entry.freshness !== freshness) {
        return false;
      }

      if (!needle) {
        return true;
      }

      const haystack = [
        entry.name,
        entry.slug,
        entry.description,
        entry.platform,
        entry.vertical,
        entry.language,
        ...inferProductTags(entry)
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [deferredQuery, freshness, language, platform, vertical]);

  const getRepoTone = (verticalName: string) => toneByVertical[verticalName] ?? "bert";

  const deriveKeywords = (entry: (typeof repoCatalog)[number]) => {
    const productTags = inferProductTags(entry).map((tag) => `#${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);

    if (productTags.length > 0) {
      const topicTags = (entry.topics ?? []).slice(0, 2).map((topic) => `#${topic}`);
      return [...new Set([...productTags, ...topicTags])].slice(0, 4);
    }

    if (entry.topics && entry.topics.length > 0) {
      return entry.topics.slice(0, 3).map((topic) => `#${topic}`);
    }

    const parts = [
      entry.vertical.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      entry.platform.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      entry.language.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    ];

    return [...new Set(parts.map((part) => `#${part}`))].slice(0, 3);
  };

  const activeVertical = hoveredVertical ?? (vertical !== "all verticals" ? vertical : null);
  const activeLanguage = hoveredLanguage ?? (language !== "all languages" ? language : null);

  const verticalConnections = useMemo(() => {
    return industryAtlas.map((entry) => {
      const matches = repoCatalog.filter((repo) => repo.vertical === entry.vertical);
      return {
        ...entry,
        repoCount: matches.length,
        sampleRepos: matches.slice(0, 3),
        platforms: [...new Set(matches.map((repo) => repo.platform))].slice(0, 2),
        productTags: topProductTags(matches, 3)
      };
    });
  }, []);

  const languageConnections = useMemo(() => {
    return languageAtlas.map((entry) => {
      const matches = repoCatalog.filter((repo) => repo.language === entry.language);
      return {
        ...entry,
        repoCount: matches.length,
        sampleRepos: matches.slice(0, 3),
        verticals: [...new Set(matches.map((repo) => repo.vertical))].slice(0, 2),
        productTags: topProductTags(matches, 3)
      };
    });
  }, []);

  const activeVerticalConnection = activeVertical
    ? verticalConnections.find((entry) => entry.vertical === activeVertical) ?? null
    : null;

  const activeLanguageConnection = activeLanguage
    ? languageConnections.find((entry) => entry.language === activeLanguage) ?? null
    : null;

  const isRepoHighlighted = (entry: (typeof repoCatalog)[number]) => {
    if (activeVertical && entry.vertical !== activeVertical) {
      return false;
    }

    if (activeLanguage && entry.language !== activeLanguage) {
      return false;
    }

    return true;
  };

  const activeAtlasSummary = activeLanguageConnection
    ? {
        title: `${activeLanguageConnection.language} · ${activeLanguageConnection.repoCount} repos`,
        body: activeLanguageConnection.sampleRepos.map((repo) => repo.slug).join(" · "),
        pills: [...activeLanguageConnection.verticals, ...activeLanguageConnection.productTags]
      }
    : activeVerticalConnection
      ? {
          title: `${activeVerticalConnection.vertical} · ${activeVerticalConnection.repoCount} repos`,
          body: activeVerticalConnection.sampleRepos
            .map((repo) => `${repo.slug} (${repo.subdomain})`)
            .join(" · "),
          pills: [...activeVerticalConnection.platforms, ...activeVerticalConnection.productTags]
        }
      : {
          title: "Click a language or vertical to filter the full catalog",
          body: "Both atlas panels now read from the same live repo dataset, so counts and cards stay aligned.",
          pills: ["language filter", "vertical filter", "live GitHub sync", "product tags"]
        };

  return (
    <main className="page-shell">
      <section className="hero-shell">
        <div className="hero-copy">
          <p className="snapshot-pill">{portfolioSnapshot.snapshotLabel}</p>
          <h1>
            <span>One engineer.</span>
            <span className="accent-bert">{portfolioSnapshot.totalRepos} public repos.</span>
            <span>
              <span className="accent-bert">{portfolioSnapshot.languageCount} languages.</span>{" "}
              <span className="accent-plum">{portfolioSnapshot.platformCount} named platforms.</span>
            </span>
          </h1>
          <p className="hero-lede">
            A live map of every public project at{" "}
            <a href="https://github.com/mizcausevic-dev">github.com/mizcausevic-dev</a>, classified into the named
            platforms that organise the work and the industry verticals it covers.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="https://github.com/mizcausevic-dev">
              github.com/mizcausevic-dev
            </a>
            <a className="secondary-action" href="https://www.linkedin.com/in/mirzacausevic/">
              linkedin.com/in/mirzacausevic
            </a>
            <a className="secondary-action" href="https://kineticgain.com/">
              kineticgain.com
            </a>
          </div>
        </div>

        <div className="hero-stats">
          {portfolioSnapshot.stats.map((entry) => (
            <article key={entry.label} className="stat-card">
              <strong>{entry.value}</strong>
              <span>{entry.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <h2>Named platforms</h2>
          <p>
            The repos grouped into the platforms that organise the work. Order is by where the named cluster sits in
            the architecture, not by repo count.
          </p>
        </div>
        <div className="platform-grid">
          {namedPlatforms.map((entry) => (
            <article key={entry.name} className={`platform-card tone-${entry.tone}`}>
              <div className="platform-card-head">
                <h3>{entry.name}</h3>
                <strong>{entry.count}</strong>
              </div>
              <p className="platform-description">{entry.description}</p>
              <div className="platform-repo-list">
                {entry.repos.map((repo) => (
                  <a key={repo.name} href={repo.url} className="platform-repo-pill">
                    <span>{repo.name}</span>
                    <span className="repo-arrow">↗</span>
                  </a>
                ))}
              </div>
              <p className="platform-footer">{entry.footer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="atlas-row">
        <article className="atlas-panel">
          <div className="atlas-heading">
            <div>
              <h2>Language atlas</h2>
              <p>{portfolioSnapshot.languageCount} languages. Click to filter.</p>
            </div>
            <span className="atlas-badge">Repos by primary language</span>
          </div>

          <div className="language-chip-grid">
            {languageAtlas.map((entry) => (
              <button
                key={entry.language}
                className={`language-chip ${activeLanguage === entry.language ? "language-chip-active" : ""}`}
                type="button"
                aria-pressed={activeLanguage === entry.language}
                onMouseEnter={() => setHoveredLanguage(entry.language)}
                onMouseLeave={() => setHoveredLanguage(null)}
                onClick={() => {
                  setVertical("all verticals");
                  setLanguage((current) => (current === entry.language ? "all languages" : entry.language));
                }}
              >
                <div className="language-chip-head">
                  <span className="language-chip-label">
                    <i style={{ background: entry.color }} />
                    {entry.language}
                  </span>
                  <strong>{entry.repos}</strong>
                </div>
                <div className="language-chip-meter" aria-hidden="true">
                  <span
                    style={{
                      width: `${(entry.repos / maxLanguageRepos) * 100}%`,
                      background: entry.color
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </article>

        <article className="atlas-panel">
          <div className="atlas-heading">
            <div>
              <h2>Industry atlas</h2>
              <p>Verticals represented across the portfolio.</p>
            </div>
            <span className="atlas-badge">{portfolioSnapshot.verticalCount} verticals</span>
          </div>

          <div className="vertical-chip-grid">
            {industryAtlas.map((entry) => (
              <button
                key={entry.vertical}
                className={`vertical-chip ${activeVertical === entry.vertical ? "vertical-chip-active" : ""}`}
                type="button"
                aria-pressed={activeVertical === entry.vertical}
                onMouseEnter={() => setHoveredVertical(entry.vertical)}
                onMouseLeave={() => setHoveredVertical(null)}
                onClick={() => {
                  setLanguage("all languages");
                  setVertical((current) => (current === entry.vertical ? "all verticals" : entry.vertical));
                }}
              >
                <span>{entry.vertical}</span>
                <strong>{entry.repos}</strong>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="atlas-inspector">
        <p className="atlas-context-title">{activeAtlasSummary.title}</p>
        <p className="atlas-context-copy">{activeAtlasSummary.body}</p>
        <div className="atlas-context-pills">
          {activeAtlasSummary.pills.map((entry) => (
            <span key={entry}>{entry}</span>
          ))}
        </div>
      </section>

      <section className="section-shell repo-shell">
        <div className="section-heading">
          <h2>Every repo</h2>
          <p>
            Filterable atlas of every public repo. Search by name / description / topic, or drill into a
            single platform, vertical, language, or freshness window.
          </p>
        </div>

        <div className="filter-bar">
          <label className="search-shell">
            <span className="search-icon">⌕</span>
            <input
              aria-label="Search repos"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="search repos by name, description, topic..."
            />
          </label>

          <select aria-label="Filter by platform" value={platform} onChange={(event) => setPlatform(event.target.value)}>
            {platformOptions.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>

          <select aria-label="Filter by vertical" value={vertical} onChange={(event) => setVertical(event.target.value)}>
            {verticalOptions.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>

          <select aria-label="Filter by language" value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languageOptions.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>

          <select aria-label="Filter by freshness" value={freshness} onChange={(event) => setFreshness(event.target.value)}>
            <option>any freshness</option>
            <option>24h</option>
            <option>7d</option>
            <option>30d</option>
            <option>older</option>
          </select>
        </div>

        <p className="results-copy">
          showing {filteredRepos.length} of {repoCatalog.length} repos
        </p>

        <div className="repo-grid">
          {filteredRepos.map((entry) => (
            <article
              key={entry.slug}
              className={`repo-card tone-${getRepoTone(entry.vertical)} ${
                isRepoHighlighted(entry) ? "repo-card-highlighted" : "repo-card-muted"
              }`}
            >
              <div className="repo-head">
                <a href={entry.url}>{entry.slug}</a>
                <span className="repo-open" aria-hidden="true">
                  ↗
                </span>
              </div>
              <p className="repo-platform">{entry.platform}</p>
              <p className="repo-description">{entry.description}</p>

              <div className="repo-pill-row">
                <span className={`repo-pill repo-pill-${getRepoTone(entry.vertical)}`}>{entry.vertical}</span>
                <span className="repo-pill repo-pill-muted">{entry.freshness}</span>
                <span className="repo-pill repo-pill-muted">{entry.subdomain}</span>
              </div>

              <div className="repo-hashtags">
                {deriveKeywords(entry).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="repo-divider" />

              <div className="repo-tags">
                <span className="repo-language">
                  <i style={{ background: languageColorMap[entry.language] ?? "#ffffff" }} />
                  {entry.language}
                </span>
                <span className="repo-age">{entry.freshness}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="portfolio-footer">
        <div className="portfolio-footer-top">
          <a href="https://github.com/mizcausevic-dev">GitHub</a>
          <a href="https://www.linkedin.com/in/mirzacausevic/">LinkedIn</a>
          <a href="https://kineticgain.com/">Kinetic Gain</a>
        </div>
        <div className="portfolio-footer-bottom">
          <span>Portfolio Constellation · live GitHub-synced repo atlas</span>
          <span>Product tags surface operator work across IBM, CyberArk, Camunda, UKG, Azure, and adjacent platform lanes.</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
