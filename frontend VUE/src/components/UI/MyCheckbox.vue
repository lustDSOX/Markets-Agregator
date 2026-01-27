<script lang="ts">
interface Option {
  label: string;
  value: string;
}

export default {
  name: 'MyCheckbox',
  
  props: {
    label: {
      type: String,
      required: true
    },
    options: {
      type: Array as () => Option[],
      required: true
    },
    modelValue: {
      type: Array as () => string[],
      default: () => []
    },
    isFull: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      isOpen: false,
      searchQuery: '' as string
    };
  },
  
  computed: {
    selectedCount(): number {
      return this.modelValue.length;
    },
    
    filteredOptions(): Option[] {
      if (!this.searchQuery) {
        return this.options;
      }
      const query = this.searchQuery.toLowerCase();
      return this.options.filter(option => 
        option.label.toLowerCase().includes(query)
      );
    }
  },
  
  methods: {
    isSelected(value: string): boolean {
      return this.modelValue.includes(value);
    },
    
    toggleOption(option: Option): void {
      const selected = [...this.modelValue];
      const index = selected.indexOf(option.value);
      
      if (index > -1) {
        selected.splice(index, 1);
      } else {
        selected.push(option.value);
      }
      
      this.$emit('update:modelValue', selected);
    },
    
    close(): void {
      this.isOpen = false;
      this.searchQuery = '';
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

<template>
  <div class="inline-block">
    <!-- Заголовок -->
    <div class="px-2 py-1 border-b border-[#333] border-dashed">
      {{ label }}
    </div>
    
    <!-- Поле поиска -->
    <div class="px-2 py-1 border-b border-[#333] border-dashed bg-[#0e0e0e]">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск..."
        class="w-full bg-transparent outline-none text-white placeholder-gray-500"
      />
    </div>
    
    <!-- Всегда видимый список с прокруткой -->
    <div class="overflow-y-auto bg-[#0e0e0e] border border-[#333] border-dashed">
        <div
            v-for="option in filteredOptions"
            :key="option.value"
            @click="toggleOption(option)"
            class="px-2 py-1 cursor-pointer hover:bg-[#252525] whitespace-nowrap flex items-center space-x-2">
            <span class="text-cyan-50 w-6">{{ isSelected(option.value) ? '[■]' : '[ ]' }}</span>
            <span>{{ option.label }}</span>
        </div>
      
        <div v-if="filteredOptions.length === 0" class="px-2 py-1 text-gray-500">
            Ничего не найдено
        </div>

        <button v-if="isFull" class="hover:underline px-2 py-1">
            Показать все &#8595
        </button>
    </div>
  </div>
</template>
