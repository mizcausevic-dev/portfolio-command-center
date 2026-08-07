export type SnapshotStat = {
  label: string;
  value: string;
};

export type NamedPlatformRepo = {
  name: string;
  url: string;
};

export type NamedPlatform = {
  name: string;
  count: number;
  description: string;
  repos: NamedPlatformRepo[];
  footer: string;
  tone: "bert" | "cyan" | "plum" | "amber" | "rose";
  // Real, owned live surface for this platform where one exists. Optional on
  // purpose: only set where a genuine URL is known — never invented per repo.
  liveSurface?: { label: string; url: string };
};

// Metric hierarchy: a couple of large hero numbers, then the rest demoted into
// labelled supporting clusters ("Core Engine" vs "Velocity").
export type MetricStat = {
  label: string;
  value: string;
};

export type MetricCluster = {
  group: string;
  stats: MetricStat[];
};

export type LanguageAtlasEntry = {
  language: string;
  repos: number;
  color: string;
};

export type IndustryVerticalEntry = {
  vertical: string;
  repos: number;
};

export type RepoEntry = {
  name: string;
  slug: string;
  url: string;
  platform: string;
  vertical: string;
  language: string;
  freshness: "24h" | "7d" | "30d" | "older";
  subdomain: string;
  description: string;
  topics?: string[];
};
