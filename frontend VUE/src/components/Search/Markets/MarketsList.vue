<script>
    export default{
        name:'MarketsList',

        data() {
            return {
                selectedOzon: false,
                selectedWb: false,
                selectedYandex: false
            };
        }
    }   
</script>

<template>
    <div class="w-max">
        <span>
            *select marketplaces
        </span>
        <ul class="list-none space-y-2 mt-2">
            <MarketItem marketplace="ozon" v-model="selectedOzon"/>
            <MarketItem marketplace="wildberries" v-model="selectedWb"/>
            <MarketItem marketplace="yandex" v-model="selectedYandex"/>
        </ul>
    </div>
</template>