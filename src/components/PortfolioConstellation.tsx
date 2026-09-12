import { useState } from "react";
import type { NamedPlatform, NamedPlatformRepo } from "../types";
import { CX, CY, fanAngles, hubRadius, moreCount, polar, textAnchor, truncate } from "../lib/constellationLayout";
import { SendToLlm } from "./SendToLlm";

const HUB_R = 300;
const LEAF_R = 400;
const ARC_R = 460;
const CENTER_R = 50;

// Category tones collapse onto the two BERT accents in this repo's own
// palette (src/styles.css :root) — reuse those tokens directly instead of
// inventing a separate diagram-only color scale.
const TONE_VAR: Record<NamedPlatform["tone"], string> = {
  bert: "var(--bert)",
  cyan: "var(--cyan)",
  plum: "var(--plum)",
  amber: "var(--amber)",
  rose: "var(--rose)"
};

interface DossierField {
  label: string;
  value: string;
}

interface DossierState {
  kind: string;
  title: string;
  desc: string;
  fields: DossierField[];
  linkLabel: string;
  linkHref?: string;
  linkExternal?: boolean;
  onLinkClick?: () => void;
}

interface Props {
  platforms: NamedPlatform[];
  totalRepos: number;
  onSelectPlatform: (name: string) => void;
}

/**
 * Radial hub/leaf map of the same named platforms as the platform-card grid
 * below it — same real `platforms` prop (src/data.ts -> namedPlatforms), so
 * the two views can never drift. Additive, not a replacement: the card grid
 * stays the default, zero-click reference surface; this is a second,
 * exploratory way to reach the same data, matching the pattern already
 * shipped on suite.kineticgain.com's homepage, /specs/, /mcp/, and
 * /verticals/ pages.
 *
 * Hub radius encodes each platform's real repo count (namedPlatforms[].count,
 * derived from repoCatalog in data.ts — never hand-typed); the count is also
 * printed as literal SVG text next to the node, so nothing depends on size or
 * color alone. Leaves are the same curated repo names already printed on the
 * platform card; the real remainder (count - repos.length) becomes a single
 * "+N more" node using the exact arithmetic data.ts already does for the
 * card's own footer text, rather than being invented or silently dropped.
 *
 * Accessibility (hard requirement): every hub/leaf/more node is a real
 * tabbable, labeled control (tabIndex 0, role="button", descriptive
 * aria-label built from real data) with an Enter/Space keydown handler
 * mirroring click; the SVG root is role="group" (never role="img") because
 * it has real interactive descendants; all animation is gated behind
 * prefers-reduced-motion (see styles.css); focus states get a visible
 * outline via :focus-visible.
 */
export function PortfolioConstellation({ platforms, totalRepos, onSelectPlatform }: Props) {
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [dossier, setDossier] = useState<DossierState | null>(null);

  const N = platforms.length;
  const active = pinned ?? hovered;

  if (N === 0) {
    return null;
  }

  function hubDossier(p: NamedPlatform): DossierState {
    return {
      kind: "Named platform",
      title: p.name,
      desc: p.description,
      fields: [
        { label: "Repos", value: String(p.count) },
        { label: "Shown here", value: p.footer }
      ],
      linkLabel: "Filter the archive ↓",
      onLinkClick: () => onSelectPlatform(p.name)
    };
  }

  function leafDossier(p: NamedPlatform, repo: NamedPlatformRepo): DossierState {
    return {
      kind: p.name,
      title: repo.name,
      desc: `One of ${p.count} real repos in ${p.name}.`,
      fields: [],
      linkLabel: "Open repo →",
      linkHref: repo.url,
      linkExternal: true
    };
  }

  function moreDossier(p: NamedPlatform, extra: number): DossierState {
    return {
      kind: p.name,
      title: `+ ${extra} more repo${extra === 1 ? "" : "s"}`,
      desc: `${p.count} repos total in ${p.name}. The map shows the ${p.repos.length} curated on the card below; the rest are one filter click away.`,
      fields: [],
      linkLabel: "Filter the archive ↓",
      onLinkClick: () => onSelectPlatform(p.name)
    };
  }

  function togglePin(name: string) {
    setPinned((current) => (current === name ? null : name));
  }

  return (
    <section className="constellation" aria-labelledby="constellation-heading">
      <div className="constellation-head">
        <h3 id="constellation-heading">Platform constellation</h3>
        <p>
          The same {N} named platforms as the cards below, mapped by real repo count. Hover or tab
          through a hub to preview its curated repos; click a hub, or press Enter/Space, to filter
          the archive below.
        </p>
        <SendToLlm />
      </div>

      <div className="constellation-pillbar" role="group" aria-label="Filter by named platform">
        <button
          type="button"
          className={pinned === null ? "constellation-pill active" : "constellation-pill"}
          onClick={() => setPinned(null)}
        >
          All {N}
        </button>
        {platforms.map((p) => (
          <button
            key={p.name}
            type="button"
            className={pinned === p.name ? "constellation-pill active" : "constellation-pill"}
            style={
              pinned === p.name
                ? { background: TONE_VAR[p.tone], borderColor: TONE_VAR[p.tone], color: "var(--bg)" }
                : { borderColor: TONE_VAR[p.tone] }
            }
            onClick={() => {
              togglePin(p.name);
              setDossier(hubDossier(p));
            }}
          >
            {truncate(p.name, 28)} &middot; {p.count}
          </button>
        ))}
      </div>

      <div className="constellation-stage">
        <div className="constellation-sweep" aria-hidden="true" />
        <svg
          viewBox={`0 0 ${CX * 2} ${CY * 2}`}
          role="group"
          aria-label={`Radial map of ${N} named platforms across ${totalRepos} total repos`}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setPinned(null);
            }
          }}
        >
          {platforms.map((p, i) => {
            const angle = (360 / N) * i;
            const hubPos = polar(CX, CY, HUB_R, angle);
            const col = TONE_VAR[p.tone];
            const dim = active !== null && active !== p.name;

            const arcSpan = (360 / N) * 0.74;
            const a0 = angle - arcSpan / 2;
            const a1 = angle + arcSpan / 2;
            const arcP0 = polar(CX, CY, ARC_R, a0);
            const arcP1 = polar(CX, CY, ARC_R, a1);
            const largeArc = arcSpan > 180 ? 1 : 0;
            const arcPath = `M ${arcP0.x.toFixed(1)} ${arcP0.y.toFixed(1)} A ${ARC_R} ${ARC_R} 0 ${largeArc} 1 ${arcP1.x.toFixed(1)} ${arcP1.y.toFixed(1)}`;

            const spokeStart = polar(CX, CY, CENTER_R, angle);
            const hubR = hubRadius(p.count);
            const lblPos = polar(CX, CY, HUB_R + hubR + 42, angle);
            const hubAnchor = textAnchor(lblPos.x);

            const extra = moreCount(p.count, p.repos.length);
            const leafSlots = p.repos.length + (extra > 0 ? 1 : 0);
            const fan = Math.min((360 / N) * 0.85, 60);
            const angles = fanAngles(angle, leafSlots, fan);

            return (
              <g key={p.name} className={dim ? "constellation-group dim" : "constellation-group"}>
                <path className="arc" d={arcPath} stroke={col} />
                <line
                  className="spoke"
                  x1={spokeStart.x}
                  y1={spokeStart.y}
                  x2={hubPos.x}
                  y2={hubPos.y}
                  stroke={col}
                />

                {p.repos.map((repo, j) => {
                  const leafAngle = angles[j];
                  const leafPos = polar(CX, CY, LEAF_R, leafAngle);
                  const lp = polar(CX, CY, LEAF_R + 13, leafAngle);
                  const leafAnchor = textAnchor(lp.x);
                  return (
                    <g key={repo.name}>
                      <path
                        className="branch"
                        stroke={col}
                        d={`M ${hubPos.x.toFixed(1)} ${hubPos.y.toFixed(1)} L ${leafPos.x.toFixed(1)} ${leafPos.y.toFixed(1)}`}
                      />
                      <g
                        className="node-leaf hoverable"
                        tabIndex={0}
                        role="button"
                        aria-label={`${repo.name}, repo in ${p.name}. Activate for details and a link to the repo.`}
                        onMouseEnter={() => setDossier(leafDossier(p, repo))}
                        onFocus={() => setDossier(leafDossier(p, repo))}
                        onClick={(event) => {
                          event.stopPropagation();
                          setDossier(leafDossier(p, repo));
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setDossier(leafDossier(p, repo));
                          }
                        }}
                      >
                        <circle cx={leafPos.x} cy={leafPos.y} r={5.5} fill="var(--bg)" stroke={col} />
                        <circle className="beacon" cx={leafPos.x} cy={leafPos.y} r={2} fill={col} />
                      </g>
                      <text className="lbl-leaf" x={lp.x} y={lp.y} fill="var(--muted)" textAnchor={leafAnchor}>
                        {truncate(repo.name, 20)}
                      </text>
                    </g>
                  );
                })}

                {extra > 0 &&
                  (() => {
                    const leafAngle = angles[p.repos.length];
                    const leafPos = polar(CX, CY, LEAF_R, leafAngle);
                    const lp = polar(CX, CY, LEAF_R + 13, leafAngle);
                    const leafAnchor = textAnchor(lp.x);
                    return (
                      <g key="more">
                        <path
                          className="branch branch-more"
                          stroke={col}
                          d={`M ${hubPos.x.toFixed(1)} ${hubPos.y.toFixed(1)} L ${leafPos.x.toFixed(1)} ${leafPos.y.toFixed(1)}`}
                        />
                        <g
                          className="node-leaf node-more hoverable"
                          tabIndex={0}
                          role="button"
                          aria-label={`${extra} more repos in ${p.name}. Activate to filter the archive and see all ${p.count}.`}
                          onMouseEnter={() => setDossier(moreDossier(p, extra))}
                          onFocus={() => setDossier(moreDossier(p, extra))}
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelectPlatform(p.name);
                            setDossier(moreDossier(p, extra));
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              onSelectPlatform(p.name);
                              setDossier(moreDossier(p, extra));
                            }
                          }}
                        >
                          <circle cx={leafPos.x} cy={leafPos.y} r={6} fill="var(--bg)" stroke={col} strokeDasharray="2 2" />
                        </g>
                        <text className="lbl-leaf lbl-more" x={lp.x} y={lp.y} fill={col} textAnchor={leafAnchor}>
                          +{extra} more
                        </text>
                      </g>
                    );
                  })()}

                <g
                  className="node-hub hoverable"
                  tabIndex={0}
                  role="button"
                  aria-label={`${p.name}, named platform, ${p.count} repo${p.count === 1 ? "" : "s"}. Activate to see details and filter the archive.`}
                  onMouseEnter={() => {
                    setHovered(p.name);
                    setDossier(hubDossier(p));
                  }}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => {
                    setHovered(p.name);
                    setDossier(hubDossier(p));
                  }}
                  onBlur={() => setHovered(null)}
                  onClick={(event) => {
                    event.stopPropagation();
                    togglePin(p.name);
                    setDossier(hubDossier(p));
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      togglePin(p.name);
                      setDossier(hubDossier(p));
                    }
                  }}
                >
                  <circle className="ring" cx={hubPos.x} cy={hubPos.y} r={hubR + 6} stroke={col} />
                  <circle className="core" cx={hubPos.x} cy={hubPos.y} r={hubR} fill="var(--bg)" stroke={col} />
                  <circle cx={hubPos.x} cy={hubPos.y} r={3.2} fill={col} />
                </g>
                <text className="lbl-hub" x={lblPos.x} y={lblPos.y} fill={col} textAnchor={hubAnchor}>
                  {truncate(p.name.toUpperCase(), 20)} &middot; {p.count}
                </text>
              </g>
            );
          })}

          <circle className="center-ring" cx={CX} cy={CY} r={70} />
          <circle className="center-core" cx={CX} cy={CY} r={CENTER_R} />
          <text className="center-lbl" x={CX} y={CY - 6} textAnchor="middle">
            PORTFOLIO
          </text>
          <text className="center-sub" x={CX} y={CY + 10} textAnchor="middle">
            {totalRepos} REPOS
          </text>
          <text className="center-sub" x={CX} y={CY + 22} textAnchor="middle">
            {N} PLATFORMS
          </text>
        </svg>
      </div>

      <div className={dossier ? "constellation-dossier show" : "constellation-dossier"}>
        {dossier && (
          <>
            <button
              type="button"
              className="constellation-dossier-close"
              aria-label="Close details"
              onClick={() => setDossier(null)}
            >
              &times;
            </button>
            <div className="constellation-dossier-kind">{dossier.kind}</div>
            <h4>{dossier.title}</h4>
            <p>{dossier.desc}</p>
            {dossier.fields.length > 0 && (
              <div className="constellation-dossier-fields">
                {dossier.fields.map((f) => (
                  <div className="field" key={f.label}>
                    <span>{f.label}</span>
                    <strong>{f.value}</strong>
                  </div>
                ))}
              </div>
            )}
            {dossier.onLinkClick ? (
              <button type="button" className="constellation-dossier-link" onClick={dossier.onLinkClick}>
                {dossier.linkLabel}
              </button>
            ) : (
              <a
                className="constellation-dossier-link"
                href={dossier.linkHref}
                target={dossier.linkExternal ? "_blank" : undefined}
                rel={dossier.linkExternal ? "noreferrer" : undefined}
              >
                {dossier.linkLabel}
              </a>
            )}
          </>
        )}
      </div>
    </section>
  );
}
