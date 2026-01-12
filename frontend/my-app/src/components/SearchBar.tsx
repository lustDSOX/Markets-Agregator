"use client";
import React, { memo, useState } from "react";
import { Group, Button, Box } from "@chakra-ui/react";
import { SearchSuggest } from "./SearchSuggest";


interface SearchBarProps {
  defaultQuery?: string;
  onSearch: (q: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = memo(
  ({ defaultQuery = "", onSearch }) => {
    const [query, setQuery] = useState(defaultQuery);

    const runSearch = () => {
      const q = query.trim();
      if (q) onSearch(q);
    };

    return (
      <Group attached width="100%">
        <Box flex="1">
          <SearchSuggest
            inputValue={query}
            onInputValueChange={setQuery}
            width="100%"
            placeholder="Введите запрос"
          />
        </Box>

        <Button
          bg="bg.subtle"
          variant="outline"
          _hover={{ bg: "gray.100", borderColor: "gray.400", border: "1px solid gray" }}
          onClick={runSearch}
        >
          Поиск
        </Button>
      </Group>
    );
  }
);

export default SearchBar;
