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
  freshness: "24h" | "7d" | "30d";
  subdomain: string;
  description: string;
};
