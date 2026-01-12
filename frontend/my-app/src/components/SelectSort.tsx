import {
  Select,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import { memo } from 'react';
import { MdSort } from "react-icons/md";


const sortOptions = createListCollection({
  items: [
    { label: 'По возрастанию цены', value: 'price_asc' },
    { label: 'По убыванию цены', value: 'price_desc' },
    { label: 'По рейтингу', value: 'rating' },
  ],
});

type SortOrder = 'price_asc' | 'price_desc' | 'rating';

interface SelectSortProps {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}

const SelectSort = memo(({ value, onChange }: SelectSortProps) => (
    <Select.Root
        collection={sortOptions}
        value={[value]}
        onValueChange={(details: { value: string[]; }) => onChange(details.value[0] as SortOrder)}
        width="20%"
        defaultValue={["price_asc"]}
    >
        <Select.HiddenSelect />
        <Select.Control>
            <Select.Trigger display="flex" justifyContent="flex-start">
                <MdSort size={20}/>
                <Select.ValueText />
            </Select.Trigger>

            <Select.IndicatorGroup>
                <Select.Indicator />
            </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
            <Select.Positioner>
                <Select.Content>
                    {sortOptions.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator />
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Positioner>
        </Portal>
    </Select.Root>
));

export default SelectSort;
