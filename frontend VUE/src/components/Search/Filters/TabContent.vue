<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { useMarketplaceStore } from '@/stores/marketplaceFilters';
import type { MarketplaceFilter } from '@/types/filter';
import type { MarketplaceName } from '@/types/marketplace';

export default defineComponent({
  name: 'TabContent',
  
  props: {
    tabName: {
      type: String as PropType<MarketplaceName>,
      required: true
    }
  },
  
  setup() {
    const marketplaceStore = useMarketplaceStore();
    return { marketplaceStore };
  },
  
  computed: {
    currentFilters(): MarketplaceFilter[] {
      return this.marketplaceStore.filters[this.tabName] || [];
    },
    
    toggleFilters(): MarketplaceFilter[] {
      return this.currentFilters.filter(f => this.getFilterType(f) === 'toggle');
    },
    
    otherFilters(): MarketplaceFilter[] {
      return this.currentFilters.filter(f => this.getFilterType(f) !== 'toggle');
    }
  },
  
  mounted() {
    if (!this.marketplaceStore.hasFilters(this.tabName)) {
      this.loadFilters();
    }
  },
  
  methods: {
    async loadFilters(): Promise<void> {
      try {
        if (!this.marketplaceStore.hasFilters(this.tabName)) {
          await this.marketplaceStore.loadFilters(this.tabName);
        }
      } catch (error) {
        console.error('Ошибка загрузки фильтров:', error);
      }
    },
    
    getFilterType(filter: MarketplaceFilter): 'toggle' | 'checkbox' | 'radio' {
      if (filter.type === 'toggle') return 'toggle';
      if (filter.maxselect === 1) return 'radio';
      return 'checkbox';
    },
    
    getFilterOptions(filter: MarketplaceFilter) {
      return filter.items.map(item => ({
        value: item.id,
        label: item.name
      }));
    },
    
    getFilterValue(filterKey: string): any {
      return this.marketplaceStore.getFilterValue(this.tabName, filterKey);
    },
    
    isToggleActive(filterKey: string): boolean {
      const value = this.getFilterValue(filterKey);
      if (value === undefined || value === null || value === false) {
        return false;
      }
      if (typeof value === 'object' && Object.keys(value).length === 0) {
        return false;
      }
      if (Array.isArray(value) && value.length === 0) {
        return false;
      }
      return true;
    },
    
    hasSelectedValues(filterKey: string): boolean {
      const value = this.getFilterValue(filterKey);
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null && value !== undefined;
    },
    
    handleToggleChange(filterKey: string, value: boolean): void {
      this.marketplaceStore.setFilterValue(this.tabName, filterKey, value);
    },
    
    handleFilterChange(filterKey: string, value: any): void {
      this.marketplaceStore.setFilterValue(this.tabName, filterKey, value);
    }
  }
});
</script>

<template>
  <div>
    <!-- Toggle фильтры -->
    <div v-if="toggleFilters.length > 0" class="grid grid-cols-4 gap-6 items-start mb-6">
      <MyToogle
        v-for="filter in toggleFilters"
        :key="filter.key"
        :is-active="isToggleActive(filter.key)"
        @update:is-active="handleToggleChange(filter.key, $event)"
      >
        {{ filter.name }}
      </MyToogle>
    </div>

    <div v-if="toggleFilters.length > 0 && otherFilters.length > 0" class="border-t border-gray-300 my-6"></div>

    <!-- Остальные фильтры -->
    <div v-if="otherFilters.length > 0" class="grid grid-cols-4 gap-6 items-start">
      <template v-for="filter in otherFilters" :key="filter.key">
        <!-- Checkbox фильтр -->
        <MyCheckbox
          v-if="getFilterType(filter) === 'checkbox'"
          :label="filter.name"
          :options="getFilterOptions(filter)"
          :model-value="getFilterValue(filter.key)"
          :is-full="!!filter.fullKey"
          @update:model-value="handleFilterChange(filter.key, $event)"
        />

        <!-- Radio фильтр -->
        <MyRadio
          v-else-if="getFilterType(filter) === 'radio'"
          :label="filter.name"
          :options="getFilterOptions(filter)"
          :model-value="getFilterValue(filter.key)"
          @update:model-value="handleFilterChange(filter.key, $event)"
        />
      </template>
    </div>
  </div>
</template>
