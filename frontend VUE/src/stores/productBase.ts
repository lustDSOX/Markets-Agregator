import { defineStore } from "pinia";
import type { Products } from "@/types/product";


export const useProductBase = defineStore('productBase', {
    state: () => ({
        productBase: [] as Products[]
    }),

    actions: {
        async loadProducts() {
            const data = await import('@/assets/testData/wildberries.json');
            const products = data.default as Products[];
            this.productBase = products
        }
    },

    getters: {
        getProducts: (state) => state.productBase
    }
})