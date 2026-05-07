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
  operatingTracks,
  portfolioProjects,
  topSignals
} from "./data";

const signalTone = {
  positive: "signal-card positive",
  watch: "signal-card watch",
  neutral: "signal-card neutral"
} as const;

function App() {
  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Portfolio Command Center</p>
          <h1>One flagship surface for the systems, workflows, and decisions this portfolio proves.</h1>
          <p className="hero-text">
            This command center turns the broader GitHub portfolio into an executive operating view across revenue,
            platform, growth, and security systems. It is built to feel like a strategic control layer, not a gallery.
          </p>
          <div className="hero-links">
            <span>Revenue</span>
            <span>Platform</span>
            <span>Growth</span>
            <span>Security</span>
          </div>
        </div>

        <div className="hero-map">
          <div className="map-node strong">Decision Layer</div>
          <div className="map-grid">
            <div className="map-node">Forecasting</div>
            <div className="map-node">Attribution</div>
            <div className="map-node">Identity</div>
            <div className="map-node">Content Ops</div>
            <div className="map-node">Cloud Cost</div>
            <div className="map-node">Incident Command</div>
          </div>
          <div className="map-footer">
            <span>Integrated execution</span>
            <span>Executive visibility</span>
            <span>Operator-grade workflows</span>
          </div>
        </div>
      </header>

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
    </div>
  );
}

export default App;
