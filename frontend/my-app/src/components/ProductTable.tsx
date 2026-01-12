import { memo } from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import ProductCard from './ProductCard';
import type { Product } from '../types/Product';
import {v4 as uuidv4} from 'uuid';

interface ProductTableProps {
  products: Product[];
}

const ProductTable = memo(({ products }: ProductTableProps) => {
  if (products.length === 0) return null;

  return (
    <SimpleGrid
      columns={{ base: 2, md: 3, lg: 5, xl: 6}}
      gap={6}
      width="100%"
    >
      {products.map((product) => (
        <ProductCard 
          key={`${uuidv4()}`}
          {...product} 
        />
      ))}
    </SimpleGrid>
  );
});

export default ProductTable;