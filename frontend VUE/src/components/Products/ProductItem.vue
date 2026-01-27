<script>
import { MARKETPLACES } from '@/assets/ascii/Marketplaces';

export default{
    name: 'ProductItem',
    props: {
        product: {
            type: Object,
            required: true
        }
    },
    computed: {
        marketplace() {
            return MARKETPLACES[this.product.store] || {};
        }
    }
}
</script>

<style scoped>
.product-card:hover {
  border-color: var(--accent-color) !important;
}
</style>

<template>
    <div>
        <div class="flex flex-col border-double border-4 border-black hover:border-solid product-card"
             :style="{ '--accent-color': marketplace.accentColor }">
            <div class="relative">
                <img :src="product.images[0]" :alt="product.name">
                <div class="absolute top-0 right-0 bg-white p-1">
                    <pre class="ascii-logo"
                         :style="{ color: marketplace.accentColor }">{{ marketplace.logo }}</pre>
                </div>
            </div>
 
            <div class="flex flex-col p-2">
                <span class="uppercase min-h-[1.5em]">{{ product.brand }}</span>
                <span class="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{{ product.name }}</span>
                <div class="flex space-x-3">
                    <span class="text-xl font-bold">{{ product.product_price }} ₽</span>
                    <span class="line-through text-sm">{{ product.basic_price }} ₽</span>
                </div>
                <div class="flex items-center">
                    <span>★</span>
                    <span>{{ product.reviewRating }}</span>
                    <span>({{ product.count_feedbacks }} отзывов)</span>
                </div>
                <button class="border-dashed py-2 border-2 border-[#333] mt-2 hover:underline hover:border-solid product-card">
                    Перейти в магазин
                </button>
            </div>
        </div>
    </div>
</template>