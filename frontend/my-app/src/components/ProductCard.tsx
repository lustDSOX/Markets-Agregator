import {
  Card,
  Image,
  Badge,
  Stack,
  Text,
  Button,
  Box,
  Flex,
  Icon
} from "@chakra-ui/react";
import type { Product } from "../types/Product";
import { FaStar } from "react-icons/fa";
import { memo } from "react";

const ProductCard = memo((props: Product) => {
  const {
    images,
    name,
    brand,
    product_price,
    basic_price,
    discount_percent,
    reviewRating,
    count_feedbacks,
    storeIcon,
    link,
    store,
  } = props;
  const ColorScheme = store =="ozon"
      ? "blue"
      : store =="wildberries"
      ? "purple"
      : "gray";

  return (
    <Card.Root maxW="xs" overflow="visible" borderRadius="md" boxShadow="sm">
      
      <Card.Header p={0} position="relative">
          <Box
            bg="gray.100"
            _dark={{ bg: "gray.800" }}
            overflow="hidden"
            backgroundSize="cover"
          >
            <Image
              src={images[0]}
              alt={name}
              objectFit="cover"
              backgroundSize="cover"
              w="100%"
              h="100%"
              loading="lazy"
            />
          </Box>
        {discount_percent && (
          <Badge
            position="absolute"
            bottom="2"
            px="2"
            mx="4"
            colorScheme="red"
            fontSize="0.75em"
          >
            {Math.round(discount_percent)}% OFF
          </Badge>
        )}
        <Box position="absolute" top="-2" right="-2" zIndex={1}>
          <Box
            bg="white"
            _dark={{ bg: "gray.900" }}
            borderRadius="full"
            p="1"
            border="2px solid"
            borderColor={ColorScheme}
            boxShadow="md"
          >
            <Image src={storeIcon} alt="store" boxSize="8" objectFit="contain" />
          </Box>
        </Box>
      </Card.Header>


      <Card.Body px="4" pt="2" pb="0">
        <Stack gap="1">
          <Text fontSize="md" truncate>
            {brand ? `${brand} / ${name}` : name}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="black">
            {product_price} ₽{" "}
            {basic_price && (
              <Text
                as="span"
                fontSize="md"
                color="gray.500"
                textDecoration="line-through"
                fontWeight="normal"
              >
                {basic_price} ₽
              </Text>
            )}
          </Text>
        </Stack>
      </Card.Body>

      <Card.Footer
        px="4"
        pb="4"
        flexDirection="column"
      >
        {count_feedbacks? (
          <Flex align="center" gridGap="1" width="-webkit-fill-available">
            <Icon as={FaStar} boxSize={4} color="gray.400" />
            <Text fontSize="small" fontWeight="bold">
              {reviewRating}
            </Text>
            <Text fontSize="small" color="gray.600">
              {count_feedbacks.toLocaleString()} отзывов
            </Text>
          </Flex>
        ) : (
          <Text fontSize="sm" color="gray.500">
            Нет отзывов
          </Text>
        )}
        <Button asChild
          width="-webkit-fill-available"
          bgColor={ColorScheme}
          flexShrink={0}
          _hover={{
            bg: "white",
            color: `${ColorScheme}.600`,
            border: "1px solid",
            borderColor: `${ColorScheme}.600`,
            textDecoration: "underline",
          }}
        >
            <a 
              href={link}target="_blank" 
              rel="noopener noreferrer" 
            >
                В магазин
            </a>
        </Button>
      </Card.Footer>
    </Card.Root>
  );
});
export default ProductCard;