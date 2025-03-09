import { Box, Button, Flex, Text, Image } from "@chakra-ui/react";
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
    <Flex direction="column">
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
              // border="1px solid #ccc"
              align="center"
              cursor="pointer"
              onClick={() => navigate(`/product/${item.id}`)} // Кликабельность товаров
            >
              {/* Контейнер для фото */}
              <Box
                width="100px" // Фиксированная ширина фото
                height="100px" // Фиксированная высота фото
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                mr={4}
              >
                {item.photo ? (
                  <Image
                    src={`http://89.111.170.174:3000${item.photo}`}
                    alt={item.name}
                    maxW="100%"
                    maxH="100%"
                    objectFit="contain" // Обрезка и сохранение пропорций
                  />
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    Нет фото
                  </Text>
                )}
              </Box>

              {/* Информация о товаре */}
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

              {/* Удаление товара */}
              <Button
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
            <Button colorScheme="teal" mt={2}>
              Оформить заказ
            </Button>
          </Box>
        </>
      )}
    </Flex>
  );
};
