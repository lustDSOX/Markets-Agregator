<script lang="ts">
import { MARKETPLACES } from '@/assets/ascii/Marketplaces';

export default{
    name: 'AllFilters',
    props: {
        selectedMarketplaces: {
            type: Array as () => string[],
            default: () => []
        },
    },
    data() {
        return {
            activeTab: '' as string,
            tabs: [],
            visitedTabs: {} as Record<string, boolean>,
            // Deprecated: These are now in TabContent component but kept for fallback
            checkboxOptions: [
                { label: 'Опция 1', value: 'option1' },
                { label: 'Опция 2', value: 'option2' },
                { label: 'Опция 3', value: 'option3' }
            ],
            selectedCheckboxes: [] as string[],
            radioOptions: [
                { label: 'Радио 1', value: 'radio1' },
                { label: 'Радио 2', value: 'radio2' },
                { label: 'Радио 3', value: 'radio3' }
            ],
            selectedRadio: '' as string
        };
    },
    mounted() {
        // Set first marketplace as active tab if marketplaces are provided
        if (this.marketplaceTabs.length > 0 && this.marketplaceTabs[0]) {
            this.activeTab = this.marketplaceTabs[0].id;
            // Mark first tab as visited
            this.visitedTabs[this.marketplaceTabs[0].id] = true;
        }
    },
    watch: {
        marketplaceTabs: {
            handler(newTabs) {
                if (newTabs.length > 0 && !this.activeTab) {
                    this.activeTab = newTabs[0].id;
                } else if (newTabs.length === 0) {
                    this.activeTab = '';
                }
            },
            immediate: true
        }
    },
    computed: {
        marketplaceTabs() {
            return (this.selectedMarketplaces as string[]).map((name) => ({
                id: name,
                name: name,
                logo: MARKETPLACES[name]?.logo || '',
                accentColor: MARKETPLACES[name]?.accentColor || '#FFFFFF'
            }));
        }
    },
    methods: {
        setActiveTab(tabId: string): void {
            this.activeTab = tabId;
            // Mark tab as visited when activated
            this.visitedTabs[tabId] = true;
        },
        closeFilters(): void {
            this.$emit('close');
        }
    },
};
</script>

<template>
    <div class="w-[80vw] h-[70vh] bg-[#0e0e0e] text-white flex flex-col">

        <!-- Шапка окна -->
        <div class="bg-black flex items-center justify-between h-8">
            <div class="flex items-center gap-2 h-full">
                <img src="../../../assets/traher.jpg" alt="traher" class="h-full p-1">
                <span>Select ∅:\MARKETHUB\filters\allFilters.ts</span>
            </div>
            <button @click="closeFilters" class="hover:bg-red-600 aspect-video h-full">✕</button>
        </div>

        <!-- Навигация по вкладкам -->
        <div class="flex border-b border-white border-dashed w-full balanced-dividers p-2">
            <template v-if="marketplaceTabs.length > 0">
                <button
                    v-for="tab in marketplaceTabs"
                    :key="tab.id"
                    @click="setActiveTab(tab.id)"
                    class=" text-left group inline-flex items-center h-6 border-white"
                >
                    <span class="invisible group-hover:visible text-cyan-50 flex items-center h-full">></span>
                    <pre
                        class="flex items-center h-full ascii-logo"
                        :style="{ color: activeTab === tab.id ? tab.accentColor : 'white' }"
                    >{{ tab.logo }}</pre>
                </button>
            </template>
            <template v-else>
                <p>marketplace has not been selected</p>
            </template>
        </div>


        <!-- Содержимое вкладок -->
        <div class="flex-1 overflow-y-auto p-2">
            <div v-for="tab in marketplaceTabs" :key="tab.id" v-show="activeTab === tab.id">
                <TabContent
                    v-if="visitedTabs[tab.id]"
                    :tab-id="tab.id"
                    :tab-name="tab.name"
                />
            </div>
            
            <div v-show="activeTab && marketplaceTabs.length > 0 && !marketplaceTabs.some(tab => tab.id === activeTab) && !['tab1', 'tab2', 'tab3'].includes(activeTab)">
                <p>Содержимое вкладки не найдено</p>
            </div>
        </div>

    </div>
</template>
