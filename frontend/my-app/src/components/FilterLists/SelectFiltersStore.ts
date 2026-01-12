import { create } from 'zustand';

export type StoreFilters = {
  [filterKey: string]: number[];
};

export interface FiltersStore {
  filters: {
    [store: string]: StoreFilters;
  };
  setFilters: (store: string, filterKey: string, values: number[]) => void;
  resetStore: (store: string) => void;
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  filters: {},

  setFilters: (store, filterKey, values) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [store]: {
          ...(state.filters[store] ?? {}),
          [filterKey]: values.slice(),
        },
      },
    })),

  resetStore: (store) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [store]: {},
      },
    })),
}));
