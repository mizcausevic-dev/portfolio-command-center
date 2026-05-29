import { useDeferredValue, useMemo, useState } from "react";
import {
  industryAtlas,
  languageAtlas,
  namedPlatforms,
  portfolioSnapshot,
  repoCatalog
} from "./data";

function App() {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all platforms");
  const [vertical, setVertical] = useState("all verticals");
  const [language, setLanguage] = useState("all languages");
  const [freshness, setFreshness] = useState("any freshness");

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
        entry.language
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [deferredQuery, freshness, language, platform, vertical]);

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
              <p>{portfolioSnapshot.languageCount} languages across the public portfolio. Click a bar to filter.</p>
            </div>
            <span className="atlas-badge">Repos by primary language</span>
          </div>

          <div className="language-list">
            {languageAtlas.map((entry) => (
              <div key={entry.language} className="language-row">
                <span className="language-label">{entry.language}</span>
                <div className="language-bar-shell" aria-hidden="true">
                  <div
                    className="language-bar-fill"
                    style={{
                      width: `${(entry.repos / maxLanguageRepos) * 100}%`,
                      background: entry.color
                    }}
                  />
                </div>
                <span className="language-value">{entry.repos}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="atlas-panel">
          <div className="atlas-heading">
            <div>
              <h2>Industry atlas</h2>
              <p>Verticals represented across the portfolio. Bubble size is repo count.</p>
            </div>
            <span className="atlas-badge">{portfolioSnapshot.verticalCount} verticals</span>
          </div>

          <div className="vertical-chip-grid">
            {industryAtlas.map((entry) => (
              <button key={entry.vertical} className="vertical-chip" type="button">
                <span>{entry.vertical}</span>
                <strong>{entry.repos}</strong>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="section-shell repo-shell">
        <div className="section-heading">
          <h2>Every repo</h2>
          <p>
            Filterable atlas of the mapped public portfolio. Search by name, description, platform, vertical,
            language, or freshness window.
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
          </select>
        </div>

        <p className="results-copy">
          showing {filteredRepos.length} of {repoCatalog.length} mapped repos
        </p>

        <div className="repo-grid">
          {filteredRepos.map((entry) => (
            <article key={entry.slug} className="repo-card">
              <div className="repo-head">
                <a href={entry.url}>{entry.slug}</a>
                <span>{entry.language}</span>
              </div>
              <p className="repo-platform">{entry.platform}</p>
              <p className="repo-description">{entry.description}</p>
              <div className="repo-tags">
                <span>{entry.vertical}</span>
                <span>{entry.freshness}</span>
                <span>{entry.subdomain}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
