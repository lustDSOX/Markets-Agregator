import { Box, RadioGroup } from '@chakra-ui/react';
import type { RadioFilter } from '../../types/Filter';

interface RadioFilterProps {
  filterKey: string;
  filter: RadioFilter;
  selected: number;
  onChange: (filterKey: string, value: number) => void;
}

const RadioFilter = ({ filterKey, filter, selected, onChange }: RadioFilterProps) => {
  let options: { label: string; value: number | null }[] = [];

  if (filterKey === "fdlvr") {
    const minTime = filter.minTime ?? 0;
    const maxTime = Math.min(filter.maxTime ?? 0, 120); // ограничиваем 5 днями (120 часов)

    options = [
      { label: "Любое", value: 0 },
       ...(minTime < 24 ? [{ label: "Сегодня", value: 0 }] : []),
      ...(minTime <= 24 ? [{ label: "Завтра", value: 24 }] : []),
      ...(minTime <= 48 ? [{ label: "Послезавтра", value: 48 }] : []),
      ...(maxTime > 48 && maxTime <= 72 ? [{ label: "До 3 дней", value: 72 }] : []),
      ...(maxTime > 72 ? [{ label: "До 5 дней", value: 120 }] : [])
    ];
  } 
  else return null;

  // Если значение не выбрано, устанавливаем "Любое" по умолчанию
  const currentValue = selected !== null ? String(selected) : "";

  return (
    <Box>
      <RadioGroup.Root
        value={currentValue}
        onChange={(val) => onChange(filterKey, Number(val))}
      >
        {options.map((opt, idx) => (
          <RadioGroup.Item key={idx} value={String(opt.value)}>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText>{opt.label}</RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </Box>
  );
};

export default RadioFilter;