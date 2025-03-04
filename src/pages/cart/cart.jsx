import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Flex direction="column" p={4}>
      <Text fontSize="2xl" mb={4}>
        Корзина
      </Text>
      {cartItems.length === 0 ? (
        <Text>Корзина пуста</Text>
      ) : (
        <>
          {cartItems.map((item) => (
            <Flex
              key={item.id}
              p={4}
              border="1px solid #ccc"
              m={2}
              align="center"
              cursor="pointer"
              onClick={() => navigate(`/product/${item.id}`)} // Кликабельность товаров
            >
              <Box flex="1">
                <Text fontSize="lg">{item.name}</Text>
                <Text>Цена: {item.price} р.</Text>
                <Flex align="center">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Останавливаем переход при клике
                      dispatch(updateQuantity({ id: item.id, change: -1 }));
                    }}
                    isDisabled={item.quantity <= 1}
                  >
                    ➖
                  </Button>
                  <Text mx={2}>{item.quantity}</Text>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(updateQuantity({ id: item.id, change: 1 }));
                    }}
                  >
                    ➕
                  </Button>
                </Flex>
              </Box>
              <Button
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeFromCart(item.id));
                }}
              >
                ❌
              </Button>
            </Flex>
          ))}
          <Box mt={4}>
            <Text fontSize="xl">Итого: {totalAmount} р.</Text>
            <Button colorScheme="green" mt={2}>
              Оформить заказ
            </Button>
          </Box>
        </>
      )}
    </Flex>
  );
};
