<template>
    <div class="flex items-center space-x-4">
        <div>
            <span class="pr-2">minPrice></span>
            <input 
                type="text" 
                class="border-b-2 border-[#333]"
                :value="formattedMinPrice"
                @input="handleMinPrice"
                @keypress="validateNumberInput"
                @paste="handlePaste"
            >
        </div>
        
        <div>
            <span class="pr-2">maxPrice></span>
            <input 
                type="text" 
                class="border-b-2 border-[#333]"
                :value="formattedMaxPrice"
                @input="handleMaxPrice"
                @keypress="validateNumberInput"
                @paste="handlePaste"
            >
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "PriceFilter",

    data() {
        return {
            minPrice: null as number | null,
            maxPrice: null as number | null
        }
    },

    computed: {
        formattedMinPrice(): string {
            if (this.minPrice === null || this.minPrice === 0) return '';
            return this.minPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        },
        
        formattedMaxPrice(): string {
            if (this.maxPrice === null || this.maxPrice === 0) return '';
            return this.maxPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }
    },

    methods: {
        validateNumberInput(event: KeyboardEvent): void {
            const char = event.key;
            // Разрешаем только цифры
            if (!/^\d$/.test(char)) {
                event.preventDefault();
            }
        },
        
        handlePaste(event: ClipboardEvent): void {
            event.preventDefault();
            const pastedText = event.clipboardData?.getData('text') || '';
            const numbersOnly = pastedText.replace(/\D/g, '');
            if (numbersOnly) {
                const target = event.target as HTMLInputElement;
                target.value = numbersOnly;
                target.dispatchEvent(new Event('input', { bubbles: true }));
            }
        },
        
        parseNumber(value: string): number | null {
            const cleaned = value.replace(/\s/g, '').replace(/[^\d]/g, '');
            if (!cleaned) return null;
            const parsed = parseInt(cleaned, 10);
            return isNaN(parsed) ? null : parsed;
        },
        
        handleMinPrice(event: Event): void {
            const target = event.target as HTMLInputElement;
            const numericValue = this.parseNumber(target.value);
            this.minPrice = numericValue;
            this.$emit('priceChange', { min: this.minPrice, max: this.maxPrice });
        },
        
        handleMaxPrice(event: Event): void {
            const target = event.target as HTMLInputElement;
            const numericValue = this.parseNumber(target.value);
            this.maxPrice = numericValue;
            this.$emit('priceChange', { min: this.minPrice, max: this.maxPrice });
        }
    }
}
</script>
