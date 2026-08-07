import type { MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  featuredPlatforms,
  inferProductTags,
  industryAtlas,
  languageAtlas,
  namedPlatforms,
  portfolioSnapshot,
  productSignalCounts,
  repoCatalog
} from "./data";

// Single real contact destination for the primary CTA (hero + sticky header +
// footer). Direct mailto so it can never 404; the platform links stay secondary.
const CONTACT_EMAIL = "miz@kineticgain.com";
const CONTACT_HREF = `mailto:${CONTACT_EMAIL}`;

// Sticky in-page navigation. Each id maps to a section id below; the scrollspy
// highlights whichever is crossing the active band. Verticals sits beside Languages
// in the same atlas row, so on a tie the earlier nav entry wins the highlight.
const NAV_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "platforms", label: "Platforms" },
  { id: "languages", label: "Languages" },
  { id: "verticals", label: "Verticals" },
  { id: "repos", label: "Repos" }
] as const;

// Repo grid pagination. 706 rows rendered at once is the "endless scroll" the owner
// flagged; we render a page at a time and let the user load more or reveal all.
const REPO_PAGE_SIZE = 24;

// The industry atlas ran too long (owner note): cap the platform/company signal
// list to a preview and let it expand, instead of dumping every signal inline.
const SIGNAL_PREVIEW = 12;

// Real, non-fabricated sort keys. The catalog ships pre-sorted by GitHub pushedAt
// descending (see scripts/sync-repo-catalog.mjs), so "last pushed" is the original
// array order. There is no stars/precise-date field in the dataset, so no stars sort
// is offered rather than inventing one.
const SORT_OPTIONS = [
  { value: "last-pushed", label: "last pushed" },
  { value: "name-asc", label: "name A–Z" },
  { value: "name-desc", label: "name Z–A" },
  { value: "language", label: "language" },
  { value: "platform", label: "platform" },
  { value: "freshness", label: "freshness" }
] as const;

const FRESHNESS_RANK: Record<string, number> = { "24h": 0, "7d": 1, "30d": 2, older: 3 };

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
  "HR Tech / Employment AI": "plum",
  "GovTech / Public Sector AI": "bert",
  "Aerospace / Drones": "cyan",
  Robotics: "plum"
};

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
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]["value"]>("last-pushed");
  const [hoveredVertical, setHoveredVertical] = useState<string | null>(null);
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);
  // false = curated Featured view (default), true = all namedPlatforms lanes.
  const [platformsExpanded, setPlatformsExpanded] = useState(false);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [showAllVerticals, setShowAllVerticals] = useState(false);
  const [showAllSignals, setShowAllSignals] = useState(false);
  // The full 706-repo explorer is an opt-in deep-dive, not the default firehose.
  // Any atlas/nav interaction that needs the grid opens it (see openArchive).
  const [showArchive, setShowArchive] = useState(false);
  const [visibleCount, setVisibleCount] = useState(REPO_PAGE_SIZE);
  const [activeSection, setActiveSection] = useState<string>("overview");

  const deferredQuery = useDeferredValue(query);

  // Original catalog order = GitHub pushedAt descending. Cached slug->index map so the
  // "last pushed" sort is O(1) per comparison and never re-derives the order.
  const originalOrder = useMemo(
    () => new Map(repoCatalog.map((entry, index) => [entry.slug, index] as const)),
    []
  );

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

  const platformCompanySignals = useMemo(() => productSignalCounts(repoCatalog), []);

  // Preview the signal list rather than dump all of it (owner: industry atlas ran
  // too long). The full set expands on demand — on desktop and mobile alike.
  const visibleSignals = showAllSignals
    ? platformCompanySignals
    : platformCompanySignals.slice(0, SIGNAL_PREVIEW);

  const platformsToShow = platformsExpanded ? namedPlatforms : featuredPlatforms;

  // Faceted filter counts, sourced from the real catalog: show how many repos each
  // filter value resolves to before the user commits to it (e.g. "Data Engineering (60)").
  const facetCounts = useMemo(() => {
    const tally = (key: keyof (typeof repoCatalog)[number]) => {
      const counts: Record<string, number> = {};
      repoCatalog.forEach((entry) => {
        const value = String(entry[key]);
        counts[value] = (counts[value] ?? 0) + 1;
      });
      return counts;
    };

    return {
      platform: tally("platform"),
      vertical: tally("vertical"),
      language: tally("language"),
      freshness: tally("freshness")
    };
  }, []);

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

  const sortedRepos = useMemo(() => {
    const list = [...filteredRepos];

    switch (sort) {
      case "name-asc":
        return list.sort((left, right) => left.slug.localeCompare(right.slug));
      case "name-desc":
        return list.sort((left, right) => right.slug.localeCompare(left.slug));
      case "language":
        return list.sort(
          (left, right) => left.language.localeCompare(right.language) || left.slug.localeCompare(right.slug)
        );
      case "platform":
        return list.sort(
          (left, right) => left.platform.localeCompare(right.platform) || left.slug.localeCompare(right.slug)
        );
      case "freshness":
        return list.sort(
          (left, right) =>
            (FRESHNESS_RANK[left.freshness] ?? 9) - (FRESHNESS_RANK[right.freshness] ?? 9) ||
            left.slug.localeCompare(right.slug)
        );
      case "last-pushed":
      default:
        return list.sort(
          (left, right) => (originalOrder.get(left.slug) ?? 0) - (originalOrder.get(right.slug) ?? 0)
        );
    }
  }, [filteredRepos, sort, originalOrder]);

  const visibleRepos = useMemo(() => sortedRepos.slice(0, visibleCount), [sortedRepos, visibleCount]);
  const hasMoreRepos = visibleCount < sortedRepos.length;

  // Any change to the filter/search/sort inputs resets the page window so the user
  // always starts a new result set from the top rather than deep in a stale page.
  useEffect(() => {
    setVisibleCount(REPO_PAGE_SIZE);
  }, [deferredQuery, freshness, language, platform, vertical, sort]);

  // Scrollspy: highlight the nav entry whose section crosses a thin band ~45% down
  // the viewport. Guarded so the jsdom test environment (no IntersectionObserver) is a no-op.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const ids = NAV_SECTIONS.map((entry) => entry.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        });

        const active = ids.find((id) => visible.has(id));
        if (active) {
          setActiveSection(active);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback((event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    // Jumping to Repos reveals the deep-dive so the grid is on screen when we land.
    if (id === "repos") {
      setShowArchive(true);
    }
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    setActiveSection(id);
    const prefersReduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    }
  }, []);

  // Opening the deep-dive archive is idempotent and used by every path that needs
  // the repo grid on screen (the explicit button, a nav "Repos" jump, and any atlas
  // chip that drives a filter). Kept in one place so those paths can never diverge.
  const openArchive = useCallback(() => setShowArchive(true), []);

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
          body: "Hover or select any language or vertical to see its top repos, platforms, and product tags.",
          pills: ["language filter", "vertical filter", "live GitHub sync", "product tags"]
        };

  return (
    <main className="page-shell">
      <nav className="section-nav" aria-label="Section navigation">
        <a
          className="section-nav-brand"
          href="#overview"
          onClick={(event) => handleNavClick(event, "overview")}
        >
          Portfolio Command Center
        </a>
        <div className="section-nav-right">
          <div className="section-nav-links">
            {NAV_SECTIONS.map((entry) => (
              <a
                key={entry.id}
                href={`#${entry.id}`}
                className={`section-nav-link ${activeSection === entry.id ? "is-active" : ""}`}
                aria-current={activeSection === entry.id ? "true" : undefined}
                onClick={(event) => handleNavClick(event, entry.id)}
              >
                {entry.label}
              </a>
            ))}
          </div>
          <a className="section-nav-cta" href={CONTACT_HREF}>
            Get in touch
          </a>
        </div>
      </nav>

      <section id="overview" className="hero-shell fx-layer fx-prism">
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
          <p className="hero-intro">
            I build platform and AI-governance engineering: open protocol specs for the answer-engine era,
            agent-fleet operations, and the reliability and decision systems that keep them accountable.
          </p>
          <p className="hero-lede">
            A live map of every public project at{" "}
            <a href="https://github.com/mizcausevic-dev">github.com/mizcausevic-dev</a>, classified into the named
            platforms that organise the work and the industry verticals it covers.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href={CONTACT_HREF}>
              Get in touch
            </a>
            <a className="secondary-action" href="https://github.com/mizcausevic-dev">
              GitHub
            </a>
            <a className="secondary-action" href="https://www.linkedin.com/in/mirzacausevic/">
              LinkedIn
            </a>
            <a className="secondary-action" href="https://kineticgain.com/">
              kineticgain.com
            </a>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-metric-lead">
            {portfolioSnapshot.heroMetrics.map((entry) => (
              <article key={entry.label} className="metric-hero fx-layer fx-radial">
                <strong>{entry.value}</strong>
                <span>{entry.label}</span>
              </article>
            ))}
          </div>
          <div className="metric-strip">
            {portfolioSnapshot.metricClusters.map((cluster) => (
              <div key={cluster.group} className="metric-cluster">
                <p className="metric-cluster-label">{cluster.group}</p>
                <div className="metric-cluster-items">
                  {cluster.stats.map((entry) => (
                    <div key={entry.label} className="metric-mini">
                      <strong>{entry.value}</strong>
                      <span>{entry.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="platforms" className="section-shell">
        <div className="section-heading">
          <h2>Named platforms</h2>
          <p>
            {platformsExpanded
              ? "Every named platform that organises the work. Order is by where the named cluster sits in the architecture, not by repo count."
              : `Start with the ${featuredPlatforms.length} flagship platforms — the largest, load-bearing clusters. Expand to see all ${namedPlatforms.length}.`}
          </p>
        </div>
        <div className={`platform-grid ${platformsExpanded ? "is-all" : "is-featured"}`}>
          {platformsToShow.map((entry) => (
            <article
              key={entry.name}
              className={`platform-card fx-layer fx-corner tone-${entry.tone} ${
                platformsExpanded ? "" : "platform-card-featured"
              }`}
            >
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
              <div className="platform-card-foot">
                <p className="platform-footer">{entry.footer}</p>
                {entry.liveSurface ? (
                  <a className="platform-live" href={entry.liveSurface.url}>
                    Live: {entry.liveSurface.label} ↗
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        <button
          className="platform-toggle"
          type="button"
          aria-expanded={platformsExpanded}
          onClick={() => setPlatformsExpanded((current) => !current)}
        >
          {platformsExpanded
            ? `Show featured ${featuredPlatforms.length} platforms`
            : `Browse all ${namedPlatforms.length} platforms`}
        </button>
      </section>

      <section className="atlas-row">
        <article id="languages" className="atlas-panel">
          <div className="atlas-heading">
            <div>
              <h2>Language atlas</h2>
              <p>{portfolioSnapshot.languageCount} languages. Click to filter.</p>
            </div>
            <span className="atlas-badge">Repos by primary language</span>
          </div>

          <div className={`language-chip-grid ${showAllLanguages ? "mobile-expanded" : ""}`}>
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
                  openArchive();
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
          <button className="mobile-show-more" type="button" onClick={() => setShowAllLanguages((current) => !current)}>
            {showAllLanguages ? "Show fewer languages" : `Show all ${languageAtlas.length} languages`}
          </button>
        </article>

        <article id="verticals" className="atlas-panel">
          <div className="atlas-heading">
            <div>
              <h2>Industry atlas</h2>
              <p>
                Verticals plus platform and company signals represented across the portfolio. Click any item to filter
                the repo grid.
              </p>
            </div>
            <span className="atlas-badge">
              {portfolioSnapshot.verticalCount} verticals · {platformCompanySignals.length} signals
            </span>
          </div>

          <div className={`vertical-chip-grid ${showAllVerticals ? "mobile-expanded" : ""}`}>
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
                  openArchive();
                }}
              >
                <span>{entry.vertical}</span>
                <strong>{entry.repos}</strong>
              </button>
            ))}
          </div>
          <button className="mobile-show-more" type="button" onClick={() => setShowAllVerticals((current) => !current)}>
            {showAllVerticals ? "Show fewer verticals" : `Show all ${industryAtlas.length} verticals`}
          </button>

          <div className="signal-block">
            <div className="signal-heading">
              <span>Platform and company signals</span>
              <strong>{platformCompanySignals.length}</strong>
            </div>
            <div className="signal-chip-grid">
              {visibleSignals.map((entry) => (
                <button
                  key={entry.tag}
                  className="signal-chip"
                  type="button"
                  aria-label={`${entry.tag} signal, ${entry.count} repos`}
                  onClick={() => {
                    setLanguage("all languages");
                    setVertical("all verticals");
                    setPlatform("all platforms");
                    setQuery(entry.tag);
                    openArchive();
                  }}
                >
                  <span>{entry.tag}</span>
                  <strong>{entry.count}</strong>
                </button>
              ))}
            </div>
            {platformCompanySignals.length > SIGNAL_PREVIEW ? (
              <button
                className="atlas-toggle"
                type="button"
                aria-expanded={showAllSignals}
                onClick={() => setShowAllSignals((current) => !current)}
              >
                {showAllSignals
                  ? "Show fewer signals"
                  : `Show all ${platformCompanySignals.length} signals`}
              </button>
            ) : null}
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

      <section id="repos" className="section-shell repo-shell">
        <div className="section-heading">
          <h2>Browse the full technical archive</h2>
          <p>
            The complete {repoCatalog.length}-repo explorer — an opt-in deep-dive, not the default firehose. Search by
            name / description / topic, sort, or drill into a single platform, vertical, language, or freshness window.
          </p>
        </div>

        {showArchive ? (
          <>
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
                    {entry} ({entry === "all platforms" ? repoCatalog.length : facetCounts.platform[entry] ?? 0})
                  </option>
                ))}
              </select>

              <select aria-label="Filter by vertical" value={vertical} onChange={(event) => setVertical(event.target.value)}>
                {verticalOptions.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry} ({entry === "all verticals" ? repoCatalog.length : facetCounts.vertical[entry] ?? 0})
                  </option>
                ))}
              </select>

              <select aria-label="Filter by language" value={language} onChange={(event) => setLanguage(event.target.value)}>
                {languageOptions.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry} ({entry === "all languages" ? repoCatalog.length : facetCounts.language[entry] ?? 0})
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by freshness"
                value={freshness}
                onChange={(event) => setFreshness(event.target.value)}
              >
                <option value="any freshness">any freshness ({repoCatalog.length})</option>
                <option value="24h">24h ({facetCounts.freshness["24h"] ?? 0})</option>
                <option value="7d">7d ({facetCounts.freshness["7d"] ?? 0})</option>
                <option value="30d">30d ({facetCounts.freshness["30d"] ?? 0})</option>
                <option value="older">older ({facetCounts.freshness["older"] ?? 0})</option>
              </select>

              <select
                aria-label="Sort repos"
                className="sort-select"
                value={sort}
                onChange={(event) => setSort(event.target.value as (typeof SORT_OPTIONS)[number]["value"])}
              >
                {SORT_OPTIONS.map((entry) => (
                  <option key={entry.value} value={entry.value}>
                    sort: {entry.label}
                  </option>
                ))}
              </select>
            </div>

            <p className="results-copy">
              showing {filteredRepos.length} of {repoCatalog.length} repos
            </p>

            <div className="repo-grid">
              {visibleRepos.map((entry) => (
                <article
                  key={entry.slug}
                  className={`repo-card fx-layer fx-corner tone-${getRepoTone(entry.vertical)} ${
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

        {sortedRepos.length === 0 ? (
          <p className="repo-empty">No repos match these filters. Clear a filter or broaden the search.</p>
        ) : hasMoreRepos ? (
          <div className="repo-pagination">
            <span className="repo-pagination-count">
              showing {visibleRepos.length} of {sortedRepos.length}
            </span>
            <div className="repo-pagination-actions">
              <button
                className="repo-load-more"
                type="button"
                onClick={() => setVisibleCount((current) => current + REPO_PAGE_SIZE)}
              >
                Load more repos
              </button>
              <button
                className="repo-show-all"
                type="button"
                onClick={() => setVisibleCount(sortedRepos.length)}
              >
                Show all {sortedRepos.length} repos
              </button>
            </div>
          </div>
        ) : (
          sortedRepos.length > REPO_PAGE_SIZE && (
            <div className="repo-pagination">
              <span className="repo-pagination-count">
                showing all {sortedRepos.length}
              </span>
              <button
                className="repo-load-more"
                type="button"
                onClick={() => setVisibleCount(REPO_PAGE_SIZE)}
              >
                Collapse repos
              </button>
            </div>
          )
        )}

            <button className="archive-collapse" type="button" onClick={() => setShowArchive(false)}>
              Collapse the archive
            </button>
          </>
        ) : (
          <div className="archive-gate fx-layer fx-corner">
            <div className="archive-gate-copy">
              <p>
                The full {repoCatalog.length}-repo explorer — search, sort, and filter across{" "}
                {portfolioSnapshot.platformCount} platforms, {portfolioSnapshot.languageCount} languages, and{" "}
                {portfolioSnapshot.verticalCount} verticals.
              </p>
            </div>
            <button className="archive-open" type="button" onClick={openArchive}>
              Browse the full technical archive →
            </button>
          </div>
        )}
      </section>

      <footer className="portfolio-footer">
        <div className="portfolio-footer-contact">
          <div className="portfolio-footer-pitch">
            <p className="portfolio-footer-kicker">Let's build something accountable</p>
            <p className="portfolio-footer-lede">
              Platform and AI-governance engineering, open specs, and operator tooling. Reach out and let's talk.
            </p>
          </div>
          <div className="portfolio-footer-actions">
            <a className="primary-action" href={CONTACT_HREF}>
              Get in touch
            </a>
            <a className="footer-email" href={CONTACT_HREF}>
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
        <div className="portfolio-footer-top">
          <a href="https://github.com/mizcausevic-dev">GitHub</a>
          <a href="https://www.linkedin.com/in/mirzacausevic/">LinkedIn</a>
          <a href="https://kineticgain.com/">Kinetic Gain</a>
          <a href="https://suite.kineticgain.com/">Protocol Suite</a>
          <a href="https://kineticgain.com/constellation/">Constellation</a>
          <a href="https://kineticgain.com/trust/">Trust Pack</a>
          <a href="https://docs.kineticgain.com/">Docs</a>
        </div>
        <div className="portfolio-footer-bottom">
          <span>Portfolio Constellation · live GitHub-synced repo atlas</span>
          <span>
            Product tags surface operator work across GCP, CyberArk, Camunda, Klaviyo, IBM, Snowflake, Genesys, Okta,
            Power BI, Tableau, VWO, and adjacent platform lanes.
          </span>
        </div>
      </footer>
    </main>
  );
}

export default App;
