import React, { memo, useCallback } from 'react';
import { Flex } from '@chakra-ui/react';
import type { FilterItem, ToggleFilterType } from '../../types/Filter';
import ToggleFilter from '../FilterTypes/ToggleFilter';
import type { StoreFilters } from '../FilterLists/SelectFiltersStore';

const EMPTY: number[] = [];

interface Props {
  store: string;
  filters: ToggleFilterType[];
  selectedByKey: StoreFilters;
  onToggle: (filterKey: string, id: number) => void;
}

const SmallFilterList: React.FC<Props> = memo(({ store, filters, selectedByKey, onToggle }) => {
  return (
    <Flex wrap="wrap" gap={10}>
      {filters.map((f) =>
        f.items.map((item) => {
          const ids = selectedByKey[f.key] ?? EMPTY;
          const selected = ids.includes(item.id);
          return (
            <ConnectedToggle
              key={`${store}:${f.key}:${item.id}`}
              filterKey={f.key}
              filter={f}
              item={item}
              selected={selected}
              onToggle={onToggle}
            />
          );
        })
      )}
    </Flex>
  );
});

export default SmallFilterList;

type ConnectedProps = {
  filterKey: string;
  item: FilterItem;
  filter: ToggleFilterType;
  selected: boolean;
  onToggle: (filterKey: string, id: number) => void;
};

const ConnectedToggle = memo<ConnectedProps>(({ filterKey, item, filter, selected, onToggle }) => {
  const handle = useCallback(() => onToggle(filterKey, item.id), [onToggle, filterKey, item.id]);

  return (
    <ToggleFilter
      filter={filter}
      filterKey={filterKey}
      item={item}
      selected={selected}
      onToggle={handle}
    />
  );
}, (prev, next) =>
  prev.selected === next.selected &&
  prev.item.id === next.item.id &&
  prev.filterKey === next.filterKey
);
