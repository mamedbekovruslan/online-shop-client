import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { ProductCard } from "../product-card/product-card";

export const ProductList = ({ products, cartItems, dispatch, navigate }) => {
  const itemWidth = useBreakpointValue({
    base: "100%",
    sm: "48%",
    md: "32%",
    lg: "23.7%",
  });

  return (
    <Flex wrap="wrap" gap={4}>
      {products.length > 0 ? (
        products.map((product) => {
          const cartItem = cartItems.find((item) => item.id === product.id);
          return (
            <Box key={product.id} w={itemWidth}>
              <ProductCard
                product={product}
                cartItem={cartItem}
                dispatch={dispatch}
                navigate={navigate}
              />
            </Box>
          );
        })
      ) : (
        <Text mt={4}>Товары не найдены</Text>
      )}
    </Flex>
  );
};
