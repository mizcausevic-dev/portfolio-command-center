/**
 * Pure polar-math + layout helpers for the radial "constellation" diagram
 * (components/PortfolioConstellation.tsx). Kept independent of React so
 * they're trivial to unit-test.
 *
 * Same hub/leaf/arc/spoke geometry as the radial diagram pattern already
 * shipped on suite.kineticgain.com (mcp-constellation.js,
 * specs-constellation.js, verticals-constellation.js) — ported here as pure
 * TypeScript functions since this repo renders the SVG declaratively via
 * JSX instead of imperative DOM writes.
 */

export interface Point {
  x: number;
  y: number;
}

/** Canvas center, in the SVG's own 1000x1000 viewBox units. */
export const CX = 500;
export const CY = 500;

/** Point at radius `r` from (cx, cy), at compass-style degrees (0 = up, clockwise). */
export function polar(cx: number, cy: number, r: number, deg: number): Point {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** SVG text-anchor for a label positioned left/right/on the vertical center line. */
export function textAnchor(px: number, cx: number = CX): "start" | "middle" | "end" {
  const dx = px - cx;
  if (Math.abs(dx) < 9) return "middle";
  return dx > 0 ? "start" : "end";
}

/**
 * Hub circle radius, scaled from a real per-platform repo count (never
 * invented — see src/data.ts namedPlatforms[].count, derived from
 * repoCatalog). Defaults are tuned for this portfolio's real range (roughly
 * 19-181 repos per named platform as of the 726-repo catalog) rather than a
 * small tool-count scale: a formula tuned for single-digit counts would
 * saturate its cap almost immediately at this magnitude, and the size
 * differences between platforms would stop meaning anything.
 */
export function hubRadius(count: number, base = 16, perItem = 0.22, cap = 40): number {
  return base + Math.min(cap, Math.max(0, count) * perItem);
}

/**
 * Evenly fan `count` leaf angles across a hub's local arc, centered on the
 * hub's own angle. A single leaf points straight out from its hub.
 */
export function fanAngles(centerAngle: number, count: number, maxFan: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [centerAngle];
  const fan = Math.min(maxFan, (count - 1) * 12);
  const step = fan / (count - 1);
  return Array.from({ length: count }, (_, j) => centerAngle - fan / 2 + step * j);
}

export function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

/**
 * Real remainder beyond the leaves actually drawn on the diagram — the same
 * "+ N more" relationship src/data.ts already computes for each platform's
 * card footer (`remaining = count - repos.length`), so the diagram and the
 * card grid below it can never report a different number for the same
 * platform.
 */
export function moreCount(total: number, shown: number): number {
  return Math.max(total - shown, 0);
}
