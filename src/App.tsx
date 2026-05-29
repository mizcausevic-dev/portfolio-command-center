import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  commandNotes,
  domainCoverage,
  healthTrend,
  industryAtlas,
  languageAtlas,
  operatingTracks,
  portfolioProjects,
  toolkitLanes,
  topSignals
} from "./data";

const signalTone = {
  positive: "signal-card positive",
  watch: "signal-card watch",
  neutral: "signal-card neutral"
} as const;

function App() {
  const maxLanguageRepos = Math.max(...languageAtlas.map((entry) => entry.repos));

  return (
    <div className="page-shell">
      <section className="content-grid atlas-grid atlas-shell">
        <article className="panel atlas-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Language atlas</p>
              <h2>24 languages across the public portfolio</h2>
            </div>
            <span className="panel-badge">Repos by primary language</span>
          </div>
          <p className="atlas-copy">
            The newer wave is now visible here too. Click a bar in the live build to filter the grid by primary
            language.
          </p>
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

        <article className="panel atlas-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Industry atlas</p>
              <h2>16 verticals represented across the portfolio</h2>
            </div>
            <span className="panel-badge">16 verticals</span>
          </div>
          <p className="atlas-copy">
            Biotech and diagnostics are now mapped into the estate alongside the newer nonprofit, insurance, and
            publishing lanes.
          </p>
          <div className="vertical-chip-grid">
            {industryAtlas.map((entry) => (
              <div key={entry.vertical} className="vertical-chip">
                <span>{entry.vertical}</span>
                <strong>{entry.repos}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="signal-grid" aria-label="Top-level portfolio signals">
        {topSignals.map((signal) => (
          <article key={signal.label} className={signalTone[signal.tone]}>
            <p>{signal.label}</p>
            <strong>{signal.value}</strong>
            <span>{signal.delta}</span>
          </article>
        ))}
      </section>

      <section className="content-grid first-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">System health</p>
              <h2>Domain maturity across revenue, platform, and growth systems</h2>
            </div>
          </div>
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={healthTrend}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="plat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.42} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#101826",
                    border: "1px solid rgba(148,163,184,0.16)",
                    borderRadius: "18px"
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#34d399" fill="url(#rev)" strokeWidth={3} />
                <Area type="monotone" dataKey="platform" stroke="#60a5fa" fill="url(#plat)" strokeWidth={3} />
                <Line type="monotone" dataKey="growth" stroke="#f59e0b" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel list-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Command notes</p>
              <h2>What changed as the portfolio matured</h2>
            </div>
          </div>
          <div className="note-list">
            {commandNotes.map((note) => (
              <article key={note.title} className="note-card">
                <strong>{note.title}</strong>
                <span>{note.owner}</span>
                <p>{note.detail}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="content-grid second-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Coverage map</p>
              <h2>Where the portfolio is deepest today</h2>
            </div>
          </div>
          <div className="chart-frame compact">
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={domainCoverage} layout="vertical" margin={{ left: 18, right: 16 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="domain" width={110} stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#101826",
                    border: "1px solid rgba(148,163,184,0.16)",
                    borderRadius: "18px"
                  }}
                />
                <Bar dataKey="coverage" fill="#60a5fa" radius={[0, 12, 12, 0]} />
                <Bar dataKey="confidence" fill="#34d399" radius={[0, 12, 12, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Operating mix</p>
              <h2>How the work distributes across the portfolio</h2>
            </div>
          </div>
          <div className="chart-frame compact">
            <ResponsiveContainer width="100%" height={290}>
              <PieChart>
                <Pie
                  data={operatingTracks}
                  dataKey="value"
                  nameKey="track"
                  innerRadius={72}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {operatingTracks.map((item) => (
                    <Cell key={item.track} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#101826",
                    border: "1px solid rgba(148,163,184,0.16)",
                    borderRadius: "18px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="track-legend">
            {operatingTracks.map((item) => (
              <div key={item.track} className="track-item">
                <span className="swatch" style={{ background: item.color }} />
                <strong>{item.track}</strong>
                <small>{item.value}%</small>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel project-panel">
        <div className="panel-heading">
          <div>
            <p className="panel-kicker">Flagship proof</p>
            <h2>The projects currently carrying the story</h2>
          </div>
        </div>
        <div className="project-grid">
          {portfolioProjects.map((project) => (
            <article key={project.name} className="project-card">
              <div className="project-topline">
                <strong>{project.name}</strong>
                <span>{project.status}</span>
              </div>
              <p className="project-category">{project.category}</p>
              <p>{project.proof}</p>
              <small>{project.impact}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="panel project-panel">
        <div className="panel-heading">
          <div>
            <p className="panel-kicker">Developer toolkit</p>
            <h2>Five implementation lanes now back the public suite and atlas surfaces</h2>
          </div>
        </div>
        <div className="project-grid">
          {toolkitLanes.map((lane) => (
            <article key={lane.lane} className="project-card">
              <div className="project-topline">
                <strong>{lane.lane}</strong>
                <span>{lane.count} repos</span>
              </div>
              <p className="project-category">Composable implementation lane</p>
              <p>{lane.summary}</p>
              <small>{lane.repos.join(" · ")}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="panel estate-panel">
        <div className="panel-heading">
          <div>
            <p className="panel-kicker">Estate map</p>
            <h2>Follow the live Kinetic Gain network</h2>
          </div>
        </div>
        <p className="estate-copy">
          This page is intentionally crawlable. It connects the apex narrative, protocol surfaces, tooling, and recent
          operator dashboards so buyers and search engines can trace the proof graph in plain HTML.
        </p>
        <div className="estate-grid">
          <article className="estate-card">
            <strong>Apex + hubs</strong>
            <ul>
              <li><a href="https://kineticgain.com/">kineticgain.com</a></li>
              <li><a href="https://docs.kineticgain.com/">docs.kineticgain.com</a></li>
              <li><a href="https://suite.kineticgain.com/">suite.kineticgain.com</a></li>
              <li><a href="https://directory.kineticgain.com/">directory.kineticgain.com</a></li>
              <li><a href="https://examples.kineticgain.com/">examples.kineticgain.com</a></li>
            </ul>
          </article>
          <article className="estate-card">
            <strong>Research + tooling</strong>
            <ul>
              <li><a href="https://pulse.kineticgain.com/">pulse.kineticgain.com</a></li>
              <li><a href="https://walker.kineticgain.com/">walker.kineticgain.com</a></li>
              <li><a href="https://bench.kineticgain.com/">bench.kineticgain.com</a></li>
              <li><a href="https://observe.kineticgain.com/">observe.kineticgain.com</a></li>
              <li><a href="https://mcp.kineticgain.com/">mcp.kineticgain.com</a></li>
            </ul>
          </article>
          <article className="estate-card">
            <strong>Commerce + field systems</strong>
            <ul>
              <li><a href="https://creators.kineticgain.com/">creators.kineticgain.com</a></li>
              <li><a href="https://bookings.kineticgain.com/">bookings.kineticgain.com</a></li>
              <li><a href="https://menus.kineticgain.com/">menus.kineticgain.com</a></li>
              <li><a href="https://stores.kineticgain.com/">stores.kineticgain.com</a></li>
              <li><a href="https://catalog.kineticgain.com/">catalog.kineticgain.com</a></li>
            </ul>
          </article>
          <article className="estate-card">
            <strong>Governance + compliance</strong>
            <ul>
              <li><a href="https://permits.kineticgain.com/">permits.kineticgain.com</a></li>
              <li><a href="https://crops.kineticgain.com/">crops.kineticgain.com</a></li>
              <li><a href="https://shipments.kineticgain.com/">shipments.kineticgain.com</a></li>
              <li><a href="https://downtime.kineticgain.com/">downtime.kineticgain.com</a></li>
              <li><a href="https://dispatch.kineticgain.com/">dispatch.kineticgain.com</a></li>
            </ul>
          </article>
          <article className="estate-card">
            <strong>Biotech + donor intelligence</strong>
            <ul>
              <li><a href="https://diagnostics.kineticgain.com/">diagnostics.kineticgain.com</a></li>
              <li><a href="https://trials.kineticgain.com/">trials.kineticgain.com</a></li>
              <li><a href="https://care.kineticgain.com/">care.kineticgain.com</a></li>
              <li><a href="https://donors.kineticgain.com/">donors.kineticgain.com</a></li>
              <li><a href="https://backup.kineticgain.com/">backup.kineticgain.com</a></li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}

export default App;
