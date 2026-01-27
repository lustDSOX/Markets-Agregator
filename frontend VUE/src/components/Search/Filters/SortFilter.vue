<template>
  <div class="relative inline-block w-[18vw]" v-click-outside="close">
    <button
      @click="isOpen = !isOpen"
      class="appearance-none p-2
      cursor-pointer text-left hover:underline
      border-2 border-transparent w-full"
      :style="sortStyle">
      sort[ {{ selectedLabel }} ]
    </button>
    
    <div 
      v-show="isOpen"
      class="absolute z-10 w-full
      border-[#333] border-dashed border-2 border-t-0">
      <div
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        class="px-4 py-2 cursor-pointer hover:underline whitespace-nowrap">
        > {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
interface Option {
  label: string;
  value: string;
}

export default{
  name: 'SortFilter',
  
  data() {
    return {
      isOpen: false,
      sort: 'popularity' as string,
      options: [
        { label: 'По популярности', value: 'popularity' },
        { label: 'По возрастанию цены', value: 'price_asc' },
        { label: 'По убыванию цены', value: 'price_desc' },
        { label: 'По рейтингу', value: 'rating' }
      ] as Option[]
    };
  },
  
  computed: {
    selectedLabel(): string {
      const selected = this.options.find(opt => opt.value === this.sort);
      return selected ? selected.label : '';
    },

    sortStyle(): Record<string, string> {
        if (this.isOpen) {
            return {
                border: '2px dashed #333',
            };
        }
        return {};
    },
  },
  
  methods: {
    selectOption(option: Option): void {
      this.sort = option.value;
      this.isOpen = false;
      this.$emit('sortChange', this.sort);
    },
    
    close(): void {
      this.isOpen = false;
    }
  },
  
  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.clickOutsideEvent = (event: Event) => {
          if (!(el === event.target || el.contains(event.target as Node))) {
            binding.value();
          }
        };
        document.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent);
      }
    }
  }
};
</script>
