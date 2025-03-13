import { Box, Button, Flex, Text } from "@chakra-ui/react";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
} from "../../../../redux/cartSlice";

export const ProductCard = ({ product, cartItem, dispatch, navigate }) => (
  <Box
    p={4}
    borderRadius="md"
    w="100%"
    textAlign="center"
    cursor="pointer"
    onClick={() => navigate(`/product/${product.id}`)}
    border="1px solid #eee"
    bg="white"
    height="350px"
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
  >
    <Box>
      <Box
        width="100%"
        height="180px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        mb={3}
      >
        {product.photo ? (
          <img
            src={`http://89.111.170.174:3000${product.photo}`}
            alt={product.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <Text fontSize="sm" color="gray.500">
            Нет фото
          </Text>
        )}
      </Box>

      <Text fontWeight="semibold">{product.name}</Text>
      <Text fontSize="sm">Цена: {product.price} р.</Text>
      <Text fontSize="sm">Кол-во: {product.quantity}</Text>
    </Box>

    {cartItem ? (
      <Flex align="center" justify="center" mt={2}>
        <Button
          size="sm"
          padding="20px 10px"
          onClick={(e) => {
            e.stopPropagation();
            if (cartItem.quantity === 1) {
              dispatch(removeFromCart(product.id));
            } else {
              dispatch(updateQuantity({ id: product.id, change: -1 }));
            }
          }}
        >
          ➖
        </Button>
        <Text mx={5}>{cartItem.quantity}</Text>
        <Button
          size="sm"
          padding="20px 10px"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(updateQuantity({ id: product.id, change: 1 }));
          }}
          isDisabled={cartItem.quantity >= product.quantity}
        >
          ➕
        </Button>
      </Flex>
    ) : (
      <Button
        colorScheme="teal"
        mt={2}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(addToCart(product));
        }}
      >
        Купить
      </Button>
    )}
  </Box>
);
