<script >
import { useProductBase } from '@/stores/productBase';

export default{
  name:"SearchInput",

  data(){
    return{
      searchQuery:"",
    }
  },

  methods:{
    search(){
      this.$emit("search",this.searchQuery)
      this.searchQuery = ""
      this.productBase.loadProducts()
    }
  },

  setup() {
    const productBase = useProductBase();
    return { productBase };
  },
}
</script>

<template>
    <div
      class="flex items-center w-full
      border-[#333] border-solid border-2
      px-2 py-3">

      <span
        class="mr-2 select-none"  
      >
      search>
      </span>

      <input 
        type="text"
        class="flex-1 border-none"
        placeholder="введите запрос..."
        v-model="searchQuery"
        @keypress.enter="search"
        >

    </div>
</template>
