import {
  Checkbox
} from "@ark-ui/react";
import { Flex, IconButton, Image } from "@chakra-ui/react";
import { HiPlus, HiCheck, HiAdjustments } from "react-icons/hi";
import FiltersModal from "./FiltersModal";
import { useDisclosure } from '@chakra-ui/react';
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { isCheckboxFilter, isToggleFilter, type CheckboxFilterType, type Filter, type ToggleFilterType,} from "../types/Filter";
import { useFiltersStore} from "./FilterLists/SelectFiltersStore";

interface StoreCheckboxProps {
  store: string;
  iconSrc: string;
  checked: boolean;
  onChange: () => void;
}

const StoreCheckbox = memo(({
  store,
  iconSrc,
  checked,
  onChange,
}: StoreCheckboxProps) => {

  const handleChange = useCallback(() => {
    onChange();
  }, [onChange]);

const { open, onOpen, onClose } = useDisclosure();
const [smallFilters, setSmallFilters] = useState<ToggleFilterType[]>([]);
const [largeFilters, setLargeFilters] = useState<CheckboxFilterType[]>([]);
const [isFiltersLoading, setIsFiltersLoading] = useState(false);
const [filtersLoaded, setFiltersLoaded] = useState(false);

const globalForStore = useFiltersStore((s) => s.filters[store]);
const hasAnySelected = useMemo(() => Object.values(globalForStore ?? {}).some(a => Array.isArray(a) && a.length > 0), [globalForStore]);

const ColorScheme = store =="ozon"
      ? "blue"
      : store =="wildberries"
      ? "purple"
      : "gray";

const loadFilters = useCallback(async () => {
  if (filtersLoaded) return;
  
  setIsFiltersLoading(true);
  try {
    const response = await fetch(`/${store}_футболка.json`);
    const raw = await response.json();
    const data: Filter[] = Array.isArray(raw) ? raw : raw.current;
    
    console.log(data)
    const small = data.filter(isToggleFilter);
    const large = data.filter(isCheckboxFilter);
    
    setSmallFilters(small);
    setLargeFilters(large);
    setFiltersLoaded(true);
  } catch (error) {
    console.error('Ошибка загрузки фильтров:', error);
  } finally {
    setIsFiltersLoading(false);
  }
}, [store, filtersLoaded]);

useEffect(() => {
  if (open) {
    loadFilters();
  }
}, [open, loadFilters]);


const handleLoadMoreFilters = useCallback(
  (key: string) => console.log("Загрузить ещё для:", key),
  []
);

return (
  <Checkbox.Root value={store} checked={checked} onCheckedChange={handleChange}>
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Flex
        align="center"
        gap={2}
        px={3}
        py={2}
        borderWidth="1px"
        borderRadius="md"
        cursor="pointer"
        transition="all 0.2s"
        borderColor={checked ? ColorScheme : "gray.200"}
        bg={checked ? "gray.100" : "white"}
        _hover={{ borderColor: ColorScheme }}
      >
        {checked ? (
          <HiCheck size={18} color={ColorScheme} />
        ) : (
          <HiPlus size={18} color="gray" />
        )}

        <Image
          src={iconSrc}
          boxSize="40px"
          objectFit="contain"
        />
        <IconButton
          aria-label="Настройки фильтра"
          variant={hasAnySelected ? "surface" : "outline"}
          borderColor={hasAnySelected ? ColorScheme : "transperent"}
          size="sm"
          onClick={onOpen}
          title={hasAnySelected ? "Есть активные фильтры" : "Фильтры"}
        >
          <HiAdjustments />
        </IconButton>

      </Flex>
    </Checkbox.Control>

      <FiltersModal
        store={store}
        isOpen={open}
        smallFilters={smallFilters}
        largeFilters={largeFilters}
        onClose={onClose}
        onLoadMore={handleLoadMoreFilters}
        isLoading={isFiltersLoading}
      />


  </Checkbox.Root>
    
  );
});

export default StoreCheckbox;