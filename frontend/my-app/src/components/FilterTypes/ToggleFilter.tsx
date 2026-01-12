import { Box, Switch } from '@chakra-ui/react';
import { memo, useCallback } from 'react';
import type { FilterItem, ToggleFilterType } from "../../types/Filter"

interface ToggleFilterProps {
  filter: ToggleFilterType;
  filterKey: string;
  item: FilterItem;
  selected: boolean;
  onToggle: (filterKey: string, itemId: number) => void;
}

const ToggleFilter = memo(({ 
  filter,
  filterKey, 
  item, 
  selected, 
  onToggle 
}: ToggleFilterProps) => {
  const handleChange = useCallback(() => {
    onToggle(filterKey, item.id);
  }, [filterKey, item.id, onToggle]);

  return (
    <Box>
      <Box fontWeight="bold" mb={2}>{filter.name}</Box>
      <Switch.Root checked={selected} onCheckedChange={handleChange}>
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
    </Box>
  );
}, (prev, next) => 
  prev.selected === next.selected && 
  prev.item.id === next.item.id &&
  prev.filterKey === next.filterKey
);

export default ToggleFilter;
