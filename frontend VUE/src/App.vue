<script lang="ts">

export default{
  data() {
    return {
      searchQuery: '',
      showFilters: false
    }
  },

  methods: {
    handleSearch(query: string) {
      this.searchQuery = query
      console.log(this.searchQuery)
    },
    closeFilters() {
      this.showFilters = false;
    }
  }
}
</script>

<template>
  <div class="main balanced-dividers-vertical">
    <MyHeader/>

    <div class="flex balanced-dividers">
      <MarketsList/>

      <div class="flex flex-col flex-1 space-y-2">
        <SearchInput @search = "handleSearch"/>
        <div class="flex balanced-dividers">
          <SortFilter/>
          <PriceFilter/>
          <button 
            class="hover:underline p-2"
            @click="showFilters = true"
          >
            [ allFilters ]
          </button>
        </div>
      </div>
    </div>

    <ProductList/>
  </div>

  <MyModal :show="showFilters">
    <AllFilters :selectedMarketplaces="['ozon', 'wildberries']" @close="closeFilters"/>
  </MyModal>

</template>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border: 0;
    outline: none;
    font-family: 'Consolas';
    font-size: max(0.7vw, 15px);
    line-height: normal;
  }

  .main {
    display: flex;
    flex-direction: column;
    margin: 1em 3em;
  }

  .balanced-dividers > * {
    @apply py-2;
  }

  .balanced-dividers > *:not(:first-child) {
    @apply border-l-2 border-solid border-[#333] pl-4 ml-4;
  }

  .balanced-dividers-vertical > * {
    @apply px-2;
  }

  .balanced-dividers-vertical > *:not(:first-child) {
    @apply border-t-2 border-solid border-[#333] pt-4 mt-4;
  }


  .ascii-logo {
    white-space: pre;
    font-size: max(0.2vw, 3px);
    line-height: 1;
  }
</style>
