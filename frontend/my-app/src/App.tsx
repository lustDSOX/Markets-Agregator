import { useCallback, useMemo, useState } from 'react';
import { Box, Flex, Heading, Stack } from '@chakra-ui/react';
import SearchBar from './components/SearchBar';
import ProductTable from './components/ProductTable';
import type { Product } from './types/Product';
import StoreCheckbox from './components/StoreCheckbox';
import SelectSort from './components/SelectSort';


const App = () => {
  type SortOrder = 'price_asc' | 'price_desc' | 'rating';

  const [results, setResults] = useState<Product[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('price_asc');
  const [query, setQuery] = useState<string>('');

  const onSearch = useCallback(
    async (newQuery:string) => {
      const trimmed = newQuery.trim()
      console.log(trimmed)
      if (!trimmed || selectedStores.length === 0) return;
      setQuery(trimmed);

      try {
        // const params = new URLSearchParams({
        //   query: query.trim(),
        //   sort: sortOrder,
        //   stores: selectedStores.join(','),  
        // });
        console.log(encodeURIComponent(query.trim()));
        const response = await fetch("/ozon_data.json");
        console.log(response)
        // const response = await fetch(`http://localhost:8000/search?${params}`);

        if (!response.ok) {
          throw new Error("Ошибка при запросе к API");
        }

        const data = await response.json();

        const transformed = data.map((item: any) => ({
          ...item,
          storeIcon: `/icons/${item.store.toLowerCase()}.svg`,
        }));

        setResults(transformed);
      } catch (error) {
        console.error("Ошибка получения данных:", error);
      }
  }, [selectedStores, sortOrder]);


  const handleStoreToggle = useCallback((store: string) => {
    setSelectedStores((prev) =>
      prev.includes(store)
        ? prev.filter((s) => s !== store)
        : [...prev, store]
    );
  },[]);


  const handleSetSortOrder = useCallback((order: SortOrder) => {
    setSortOrder(order);
  }, []);

  const storeCheckboxes = useMemo(() => (
    <Stack direction="row" gap={4} mb={6}>
      <StoreCheckbox
        store="wildberries"
        iconSrc="/icons/wildberries.svg"
        checked={selectedStores.includes('wildberries')}
        onChange={() => handleStoreToggle('wildberries')}
      />
      <StoreCheckbox
        store="ozon"
        iconSrc="/icons/ozon.svg"
        checked={selectedStores.includes('ozon')}
        onChange={() => handleStoreToggle('ozon')}
      />
    </Stack>
  ), [selectedStores, handleStoreToggle]);

  return (
  <Box p={6}>
    <Heading mb={6}>Поиск товаров</Heading>

    <Flex mb={6} gap={4} align="center">
       <SearchBar 
            defaultQuery={query} 
            onSearch={onSearch} 
        />
        <SelectSort 
          value={sortOrder} 
          onChange={handleSetSortOrder} 
        />
    </Flex>

    {storeCheckboxes}

    <Box>
      <ProductTable products={results} />
    </Box>
  </Box>
  );
};

export default App;
