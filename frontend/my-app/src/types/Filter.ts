export interface FilterItem {
  id: number;
  name: string;
}

interface BaseFilter {
  name: string;
  key: string;
  quickOrder?: number;
  isTop?: boolean;
  items? : FilterItem[];
}

export interface ToggleFilterType extends BaseFilter {
  type: 'toggle';
  items: FilterItem[];
}

export interface CheckboxFilterType extends BaseFilter {
  type: 'checkbox';
  items: FilterItem[];
  maxselect?: number;
  fullKey?: string;
}

export interface RangeFilterType extends BaseFilter {
  type: 'range';
  minPriceU: number;
  maxPriceU: number;
}

export interface RadioFilterType extends BaseFilter {
  type: 'radio';
  minTime?: number;
  maxTime?: number;
}

export function isToggleFilter(f: Filter): f is ToggleFilterType {
  return (f as ToggleFilterType).type === 'toggle';
}

export function isCheckboxFilter(f: Filter): f is CheckboxFilterType {
  if (!f.items) return false;
  return (f as any).type !== 'toggle' &&  f.items.length > 1;
}

export type Filter =
  | ToggleFilterType
  | CheckboxFilterType
  | RangeFilterType
  | RadioFilterType;
