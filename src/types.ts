export type Signal = {
  label: string;
  value: string;
  delta: string;
  tone: "positive" | "watch" | "neutral";
};

export type SystemDomain = {
  domain: string;
  coverage: number;
  confidence: number;
  motion: string;
};

export type HealthPoint = {
  month: string;
  revenue: number;
  platform: number;
  growth: number;
};

export type PortfolioProject = {
  name: string;
  category: string;
  proof: string;
  impact: string;
  status: string;
};

export type OperatingTrack = {
  track: string;
  value: number;
  color: string;
};

export type CommandNote = {
  title: string;
  owner: string;
  detail: string;
};

export type ToolkitLane = {
  lane: string;
  count: number;
  summary: string;
  repos: string[];
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
