<script lang="ts">

import { MARKETPLACES} from '@/assets/ascii/Marketplaces';

export default {
    name: "MarketItem",

    props: {
        marketplace: {
            type: String,
            required: true,
        },

        modelValue: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        currentLogo():string {
            return MARKETPLACES[this.marketplace]?.logo || '';
        },

        accentColor():string {
            return MARKETPLACES[this.marketplace]?.accentColor || '';
        },

        isSelected():boolean {
            return this.modelValue;
        },

        logoStyle(): Record<string, string> {
            if (this.isSelected) {
                return {
                    color: this.accentColor,
                };
            }
            return {};
        },

    },

    emits: ['update:modelValue'],

    methods: {
        toogleSelection() {
            this.$emit('update:modelValue', !this.modelValue);
        },
    },
}
</script>


<template>
    <div 
        class="flex-row flex items-center cursor-pointer"
        @click="toogleSelection"
    >
        <span>{{ isSelected ? '[■]' : '[ ]' }}</span>
        <pre 
            class="ascii-logo ml-2 w-3/4"
            :style="logoStyle"
        >{{ currentLogo }}</pre>
    </div>
</template>
