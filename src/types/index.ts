export type WithId<T> = T & { id: string };

export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  label: string;
  value: string;
  helper?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}
