import { defineStore } from 'pinia';
import type { MarketplaceFilters, MarketplaceFilter } from '@/types/filter';
import type { MarketplaceName } from '@/types/marketplace';

export const useMarketplaceStore = defineStore('marketplaceFilters', {
  state: () => ({
    filters: {
      WILDBERRIES: [] as MarketplaceFilter[],
      OZON: [] as MarketplaceFilter[],
      YANDEX: [] as MarketplaceFilter[],
    },

    activeMarketplace: null as MarketplaceName | null,
  }),

  getters: {
    getCurrentFilters: (state) => {
      if (!state.activeMarketplace) return [];
      return state.filters[state.activeMarketplace] || [];
    },

    getFilterByKey: (state) => (marketplace: MarketplaceName, key: string) => {
      return state.filters[marketplace]?.find(f => f.key === key);
    },

    hasFilters: (state) => (marketplace: MarketplaceName) => {
      return (state.filters[marketplace]?.length ?? 0) > 0;
    },

    getFilterValue: (state) => (marketplace: MarketplaceName, key: string) => {
      const filter = state.filters[marketplace]?.find(f => f.key === key);
      return filter?.selectedValue;
    },
  },

  actions: {
    async loadAllFilters(marketplace: MarketplaceName) {
      if (this.hasFilters(marketplace)) {
        return;
      }
      const data = await import('@/assets/testData/wildberries_футболка.json');
      const filters = data.default as MarketplaceFilter[];
      this.filters[marketplace] = filters.map(filter => ({
        ...filter,
        selectedValue: filter.selectedValue ?? this.getDefaultValueForFilter(filter)
      }));
    },

    async loadFilters(marketplace: MarketplaceName, keys: string[]) {
      const data = await import('@/assets/testData/wildberries_футболка.json');
      const filters = data.default as MarketplaceFilter[];
      this.filters[marketplace] = filters.filter(filter => keys.includes(filter.key));
    },

    setFilterValue(marketplace: MarketplaceName, key: string, value: any) {
      const filter = this.getFilterByKey(marketplace, key);
      if (filter) {
        filter.selectedValue = value;
      }
    },

    setActiveMarketplace(marketplace: MarketplaceName) {
      this.activeMarketplace = marketplace;
    },

    clearFilters(marketplace: MarketplaceName) {
      this.filters[marketplace] = [];
    },

    getDefaultValueForFilter(filter: MarketplaceFilter): any {
      if (filter.type === 'toggle') {
        return false;
      } else if (filter.maxselect === 1) {
        return null;
      } else {
        return [];
      }
    },
  }
});
