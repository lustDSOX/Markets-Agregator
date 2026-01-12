import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Center,
  CloseButton,
  Dialog,
  Portal,
  Separator,
  Spinner,
} from '@chakra-ui/react';
import type { CheckboxFilterType, ToggleFilterType } from '../types/Filter';
import SmallFilterList from './FilterLists/SmallFilterList';
import LargeFilterList from './FilterLists/LargeFilterList';
import { useFiltersStore, type StoreFilters } from './FilterLists/SelectFiltersStore';

interface FiltersModalProps {
  store: string;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  smallFilters: ToggleFilterType[];
  largeFilters: CheckboxFilterType[];
  onLoadMore: (filterKey: string) => void;
}

const EMPTY: StoreFilters = Object.freeze({});

const FiltersModal: React.FC<FiltersModalProps> = ({
  store,
  isLoading,
  isOpen,
  onClose,
  smallFilters,
  largeFilters,
}) => {

  const globalForStoreRaw = useFiltersStore(useCallback((s) => s.filters[store], [store]));

  const globalForStore = globalForStoreRaw ?? EMPTY;

  const setFiltersGlobal = useFiltersStore((s) => s.setFilters);
  const resetStoreGlobal = useFiltersStore((s) => s.resetStore);

  const [local, setLocal] = useState<StoreFilters>({});
  const openedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !openedRef.current) {
      openedRef.current = true;
      const copy: StoreFilters = {};
      for (const k of Object.keys(globalForStore)) copy[k] = [...globalForStore[k]];
      setLocal(copy);
    }
    if (!isOpen && openedRef.current) {
      openedRef.current = false;
    }
  }, [isOpen, globalForStore]);

  const toggleId = useCallback((filterKey: string, id: number) => {
    setLocal((prev) => {
      const src = prev[filterKey] ?? [];
      const exists = src.includes(id);
      const next = exists ? src.filter((x) => x !== id) : [...src, id];
      if (src === next) return prev;
      return { ...prev, [filterKey]: next };
    });
  }, []);

  const resetLocal = useCallback(() => {
    setLocal({});
  }, []);

  // быстрый возврат к значениям из глобали
  // const resetToGlobal = useCallback(() => {
  //   const copy: StoreFilters = {};
  //   for (const k of Object.keys(globalForStore)) copy[k] = [...globalForStore[k]];
  //   setLocal(copy);
  // }, [globalForStore]);

  const handleApply = useCallback(() => {
    resetStoreGlobal(store);
    Object.entries(local).forEach(([key, values]) => setFiltersGlobal(store, key, values));
    onClose();
  }, [local, onClose, resetStoreGlobal, setFiltersGlobal, store]);

  const selectedByKey = useMemo(() => local, [local]);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(d) => !d.open && onClose()}
      size="cover"
      placement="center"
      trapFocus={false}
      unmountOnExit={false}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>Фильтры {store}</Dialog.Header>
            <Dialog.Body pb={4} overflowX="auto">
              {isLoading ? (
                <Center py={8}>
                  <Spinner size="lg" />
                </Center>
              ) : (
                <>
                  <SmallFilterList
                    store={store}
                    filters={smallFilters}
                    selectedByKey={selectedByKey}
                    onToggle={toggleId}
                  />
                  <Separator my={6} />
                  <LargeFilterList
                    store={store}
                    filters={largeFilters}
                    selectedByKey={selectedByKey}
                    onSelect={toggleId}
                  />
                </>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Button mr={3} onClick={handleApply}>
                Применить
              </Button>
              <Button variant="ghost" onClick={resetLocal}>
                Сбросить
              </Button>
              {/* <Button variant="ghost" onClick={resetToGlobal}>
                Восстановить из текущих глобальных
              </Button> */}
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default memo(FiltersModal);
