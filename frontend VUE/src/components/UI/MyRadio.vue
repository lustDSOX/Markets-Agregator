<script lang="ts">
interface Option {
  label: string;
  value: string;
}

export default {
  name: 'MyRadio',
  
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
      type: String,
      default: ''
    }
  },
  
  computed: {
    selectedLabel(): string {
      const selected = this.options.find(opt => opt.value === this.modelValue);
      return selected ? selected.label : 'не выбрано';
    }
  },
  
  methods: {
    isSelected(value: string): boolean {
      return this.modelValue === value;
    },
    
    selectOption(option: Option): void {
      this.$emit('update:modelValue', option.value);
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
    
    <!-- Всегда видимый список с прокруткой -->
    <div class="overflow-y-auto bg-[#0e0e0e] border border-[#333] border-dashed">
      <div
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        class="px-2 py-1 cursor-pointer hover:bg-[#252525] whitespace-nowrap flex items-center space-x-2">
        <span class="text-cyan-50 w-6">{{ isSelected(option.value) ? '(•)' : '( )' }}</span>
        <span>{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>


