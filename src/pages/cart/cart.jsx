import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, clearCart } from "../../redux/cartSlice";
import { placeOrder } from "../../api/auth";

export const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const availableItems = cartItems.filter((item) => item.quantity > 0);

  const totalAmount = availableItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        items: availableItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };
      await placeOrder(orderData);
      dispatch(clearCart());
      alert("Заказ успешно оформлен!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Ошибка при оформлении заказа.");
    }
  };

  return (
    <Flex direction="column">
      <Text fontSize="2xl" mb={4}>
        Корзина
      </Text>
      {availableItems.length === 0 ? (
        <Text>Корзина пуста</Text>
      ) : (
        <>
          {availableItems.map((item) => (
            <Flex
              key={item.id}
              p={4}
              border="1px solid #ccc"
              m={2}
              align="center"
            >
              <Box flex="1">
                <Text>{item.name}</Text>
                <Text>Цена: {item.price} р.</Text>
                <Text>Кол-во: {item.quantity}</Text>
              </Box>
              <Button
                colorScheme="red"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                ❌
              </Button>
            </Flex>
          ))}
          <Box mt={4}>
            <Text fontSize="xl">Итого: {totalAmount} р.</Text>
            <Button colorScheme="green" onClick={handlePlaceOrder} mt={2}>
              Оформить заказ
            </Button>
          </Box>
        </>
      )}
    </Flex>
  );
};
