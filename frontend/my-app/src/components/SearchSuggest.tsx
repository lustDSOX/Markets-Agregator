"use client";
import { useMemo, useState } from "react";
import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react";

export type SearchSuggestProps = {
  inputValue: string;
  onInputValueChange: (next: string) => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
  width?: string | number;
};

/** Заглушка-источник подсказок */
const SUGGESTIONS_STUB: string[] = [
  "футболка женская",
  "футболка мужская",
  "футболка женская оверсайз",
  "футболка",
  "футболка для мальчика",
  "футболка мужская оверсайз",
  "футболка для девочки",
  "футболка белая",
  "футболка черная",
];

export function SearchSuggest({
    inputValue,
    onInputValueChange,
    onSelect,
    placeholder = "Поиск...",
    width = "100%",
}: SearchSuggestProps) {
    const { contains } = useFilter({ sensitivity: "base" });

    const initialItems = useMemo(
        () => SUGGESTIONS_STUB.map((label) => ({ label, value: label })),
        []
    );
    const { collection, filter } = useListCollection({
        initialItems,
        filter: contains,
    });
    const [open, setOpen] = useState(false);

    return (
        <Combobox.Root
        width={width}
        collection={collection}
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        inputValue={inputValue}
        onInputValueChange={(e) => {
            filter(e.inputValue);
            onInputValueChange(e.inputValue);
        }}
        openOnClick
        >
        <Combobox.Control>
            <Combobox.Input
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            fontSize="md"
            />
        </Combobox.Control>

        <Portal>
            <Combobox.Positioner zIndex={10}>
            <Combobox.Content 
                maxH="56" 
                overflowY="auto" 
                border="1px solid gray"
                borderRadius="md"
                overflow="hidden"
                boxShadow="2xl"
                >
                <Combobox.Empty>Ничего не найдено</Combobox.Empty>
                {collection.items.map((item) => (
                <Combobox.Item
                    key={item.value}
                    item={item}
                    onClick={() => {
                    onInputValueChange(item.value);
                    onSelect?.(item.value);
                    setOpen(false);
                    }}
                    fontSize="md"
                    fontWeight="medium"
                    py={3}
                >
                    {item.label}
                    <Combobox.ItemIndicator />
                </Combobox.Item>
                ))}
            </Combobox.Content>
            </Combobox.Positioner>
        </Portal>
        </Combobox.Root>
    );
}
