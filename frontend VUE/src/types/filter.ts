import type { MarketplaceName } from "./marketplace";

export interface FilterItem {
  id: number;
  name: string;
}

export interface MarketplaceFilter {
  name: string;
  key: string;
  type?: 'toggle' | string;
  maxselect?: number;
  items: FilterItem[];
  fullKey?: string;
  isTop?: boolean;
  quickOrder?: number;
  selectedValue?: Record<string, any>,
}

export type MarketplaceFilters = Record<MarketplaceName, MarketplaceFilter[]>;
