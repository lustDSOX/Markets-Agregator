import React, { memo, useCallback } from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import type { CheckboxFilterType } from '../../types/Filter';
import CheckboxFilter from '../FilterTypes/CheckboxFilter';
import type { StoreFilters } from '../FilterLists/SelectFiltersStore';

const EMPTY: number[] = [];

interface LargeFilterListProps {
  store: string;
  filters: CheckboxFilterType[];
  selectedByKey: StoreFilters;
  onSelect: (filterKey: string, id: number) => void;
}

const LargeFilterList: React.FC<LargeFilterListProps> = ({
  store,
  filters,
  selectedByKey,
  onSelect,
}) => {
  return (
    <SimpleGrid width="100%" columns={{ base: 2, md: 3, lg: 4 }} gap={4}>
      {filters.map((f) => {
        const ids = selectedByKey[f.key] ?? EMPTY; 
        return (
          <ConnectedCheckbox
            key={`${store}:${f.key}`}
            filter={f}
            selectedIds={ids}
            onSelect={onSelect}
          />
        );
      })}
    </SimpleGrid>
  );
};

export default memo(LargeFilterList);

const ConnectedCheckbox = memo(function ConnectedCheckbox({
  filter,
  selectedIds,
  onSelect,
}: {
  filter: CheckboxFilterType;
  selectedIds: number[];
  onSelect: (filterKey: string, id: number) => void;
}) {
  const selectOne = useCallback(
    (id: number) => onSelect(filter.key, id),
    [onSelect, filter.key]
  );

  return (
    <CheckboxFilter
      filter={filter}
      selectedIds={selectedIds}
      onSelect={selectOne}
    />
  );
});
