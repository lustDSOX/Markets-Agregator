import { Box, Input, HStack, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import type { RangeFilter } from '../../types/Filter';

interface RangeFilterProps {
    filter: RangeFilter;
    value: [number, number];
    onChange: (value: [number, number]) => void;
}

const RangeFilter = ({ filter, value, onChange }: RangeFilterProps) => {

    function isPriceFilter(filter: RangeFilter): filter is RangeFilter & { 
        minPriceU: number; 
        maxPriceU: number 
        } {
        return filter.key === 'priceU' && 
                filter.minPriceU !== undefined && 
                filter.maxPriceU !== undefined;
    }
    if (!isPriceFilter(filter)) {
        console.warn('RangeFilter используется с неподдерживаемым фильтром:');
        return null;
    }
    const minRub = filter.minPriceU / 100;
    const maxRub = filter.maxPriceU / 100;
    
    const [minValue, setMinValue] = useState<string>((value[0] / 100).toString());
    const [maxValue, setMaxValue] = useState<string>((value[1] / 100).toString());


    useEffect(() => {
        setMinValue((value[0] / 100).toString());
        setMaxValue((value[1] / 100).toString());
    }, [value]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setMinValue(val);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setMaxValue(val);
    
    };

    const handleBlur = () => {
        let minNum = Number(minValue);
        let maxNum = Number(maxValue);
        
        if (isNaN(minNum)) minNum = minRub;
        if (isNaN(maxNum)) maxNum = maxRub;
        
        minNum = Math.max(minRub, Math.min(minNum, maxRub));
        maxNum = Math.min(maxRub, Math.max(maxNum, minRub));
        
        if (minNum > maxNum) {
        [minNum, maxNum] = [maxNum, minNum];
        }
        
        setMinValue(minNum.toString());
        setMaxValue(maxNum.toString());
        onChange([minNum * 100, maxNum * 100]);
    };

  return (
    <Box mb={6}>
      <Text fontWeight="bold" mb={2}>{filter.name}</Text>
      
      <HStack gap={3}>
        <Box flex={1}>
          <Text fontSize="sm" mb={1}>От</Text>
          <Input
            value={minValue}
            onChange={handleMinChange}
            onBlur={handleBlur}
            placeholder="От"
            type="number"
            min={minRub}
            max={maxRub}
          />
        </Box>
        
        <Box flex={1}>
          <Text fontSize="sm" mb={1}>До</Text>
          <Input
            value={maxValue}
            onChange={handleMaxChange}
            onBlur={handleBlur}
            placeholder="До"
            type="number"
            min={minRub}
            max={maxRub}
          />
        </Box>
      </HStack>
    </Box>
  );
};

export default RangeFilter;