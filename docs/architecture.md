# Portfolio Command Center Architecture

## Service Overview

Portfolio Command Center is a flagship frontend project that unifies the broader GitHub portfolio into one executive-grade operating surface. Instead of presenting each repo as an isolated artifact, it organizes the work into a decision layer across revenue systems, platform governance, growth operations, and security workflows.

## Request Flow

1. Static TypeScript datasets model portfolio signals, domain maturity, system health, flagship project roles, and operating notes.
2. The React application translates those datasets into signal cards, charts, coverage views, and flagship proof panels.
3. Recharts visualizations provide a concise view of maturity and operating mix without overwhelming the page.

## Interface Map

- `Hero`
  - positions the project as the portfolio-wide control layer
- `Signal cards`
  - quantify breadth, maturity, and readiness
- `System health chart`
  - shows maturity across revenue, platform, and growth systems
- `Command notes`
  - explains how the portfolio has evolved strategically
- `Coverage map`
  - shows depth by domain
- `Operating mix`
  - explains how the work distributes across the system
- `Flagship proof grid`
  - highlights the most important repos carrying the story

## Design Notes

- The visual system is intentionally cooler and more command-center oriented than the other frontend projects so it reads like a master control layer.
- Typography blends editorial serif headings with product-ready sans-serif supporting copy.
- Charts are used sparingly and strategically to reinforce portfolio narrative rather than create noise.

## Future Upgrades

- live repo health sync
- deeper drilldowns by project domain
- motion between command views
- case-study links once the owned site pages are live
