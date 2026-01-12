import { Box, Checkbox, Input, Button, Stack } from '@chakra-ui/react';
import { useState, useMemo, memo, useCallback, useEffect } from 'react';
import type { CheckboxFilterType, FilterItem } from '../../types/Filter';

interface CheckboxFilterProps {
  filter: CheckboxFilterType;
  selectedIds: number[];
  onSelect: (itemId: number) => void;
}

const CheckboxFilter = ({ filter, selectedIds, onSelect }: CheckboxFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<FilterItem[]>(filter.items || []);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setItems(filter.items || []);
  }, [filter.items]);

  const visibleItems = useMemo(() => {
    let list = items || [];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((item) => item.name.toLowerCase().includes(q));
    }
    return list;
  }, [items, searchTerm]);

  const makeSelect = useCallback((id: number) => () => onSelect(id), [onSelect]);

  const handleLoadMore = useCallback(async () => {
    try {
      const response = await fetch('/ozon_type.json');
      const raw = await response.json();

      const rawItems: any[] = raw?.sections?.[0]?.items ?? raw?.items ?? raw ?? [];

      const mapped: FilterItem[] = rawItems
        .map((it) => {
          const id = Number(it?.id ?? it?.key);
          const name = (it?.name ?? it?.title?.text ?? '').toString();
          return Number.isFinite(id) && name
            ? ({ id, name } as FilterItem)
            : null;
        })
        .filter(Boolean) as FilterItem[];

      setItems((prev) => {
        const map = new Map<number, FilterItem>(prev.map((i) => [i.id, i]));
        for (const m of mapped) {
          if (!map.has(m.id)) map.set(m.id, m);
        }
        return Array.from(map.values());
      });
      setLoading(true)
    } catch (e) {
      console.error('onLoadMore error:', e);
    } finally {
    }
  }, [filter.key]);

  return (
    <Box mb={6}>
      <Box fontWeight="bold" mb={2}>{filter.name}</Box>

      <Input
        placeholder="Поиск..."
        size="sm"
        mb={3}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Stack gap={2} maxH="300px" overflowY="auto">
        {visibleItems.map((item) => {
          const selected = selectedIds.includes(item.id);
          return (
            <CheckboxItem
              key={item.id}
              item={item}
              selected={selected}
              disabled={
                !!filter.maxselect &&
                selectedIds.length >= filter.maxselect &&
                !selected
              }
              onToggle={makeSelect(item.id)}
            />
          );
        })}
      </Stack>

      <Button size="sm" mt={2} variant="outline" onClick={handleLoadMore} hidden={isLoading}>
        Получить все
      </Button>
    </Box>
  );
};

export default CheckboxFilter;

function RowContent({
  item,
  selected,
  disabled,
  onToggle,
}: {
  item: FilterItem;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <Checkbox.Root checked={selected} onChange={onToggle} disabled={disabled}>
      <Checkbox.HiddenInput />
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>{item.name}</Checkbox.Label>
    </Checkbox.Root>
  );
}

const CheckboxItem = memo(RowContent, (prev, next) =>
  prev.selected === next.selected &&
  prev.disabled === next.disabled &&
  prev.item.id === next.item.id
);
