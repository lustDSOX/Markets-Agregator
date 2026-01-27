<script>
import { useProductBase } from '@/stores/productBase';

export default{
    name: 'ProductList',
    setup() {
        const productBase = useProductBase();
        return { productBase };
    },
}
</script>

<template>
  <div class="grid grid-cols-5 gap-4 px-0">
    <ProductItem
      v-for="product in productBase.getProducts"
      :key="product.name"
      :product="product"
    />
  </div>
</template>