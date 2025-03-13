import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  useBreakpointValue,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../api/auth";
import { useState } from "react";

export const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Корзина пуста",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Необходимо авторизоваться",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      navigate("/auth");
      return;
    }

    try {
      setIsLoading(true);
      await placeOrder({ items: cartItems });
      dispatch({ type: "cart/clearCart" });
      toast({
        title: "Заказ успешно оформлен!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Ошибка при оформлении заказа", err);
      toast({
        title: "Ошибка при оформлении заказа",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              direction={{ base: "column", md: "row" }}
              p={4}
              border="1px solid #ccc"
              borderRadius="md"
              mb={4}
              align="center"
              gap={4}
              onClick={() => navigate(`/product/${item.id}`)}
              cursor="pointer"
              position="relative"
            >
              <Box
                width="100px"
                height="100px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                flexShrink={0}
              >
                {item.photo ? (
                  <Image
                    src={`http://89.111.170.174:3000${item.photo}`}
                    alt={item.name}
                    width="100px"
                    height="100px"
                    objectFit="contain"
                  />
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    Нет фото
                  </Text>
                )}
              </Box>

              <Flex
                direction="column"
                flex="1"
                textAlign={{ base: "center", md: "left" }}
              >
                <Text fontSize="lg">{item.name}</Text>
                <Text>Цена: {item.price} р.</Text>

                <Flex
                  align="center"
                  justify={{ base: "center", md: "flex-start" }}
                  mt={2}
                >
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(updateQuantity({ id: item.id, change: -1 }));
                    }}
                    isDisabled={item.quantity <= 1}
                  >
                    ➖
                  </Button>
                  <Text mx={3}>{item.quantity}</Text>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.quantity < item.stock) {
                        dispatch(updateQuantity({ id: item.id, change: 1 }));
                      }
                    }}
                    isDisabled={item.quantity >= item.stock}
                  >
                    ➕
                  </Button>
                </Flex>
              </Flex>

              <Button
                mt={{ base: 2, md: 0 }}
                position={isMobile ? "absolute" : "unset"}
                right={isMobile ? "8px" : "unset"}
                top={isMobile ? "0px" : "unset"}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeFromCart(item.id));
                }}
              >
                ❌
              </Button>
            </Flex>
          ))}

          <Box mt={4} textAlign={{ base: "center", md: "right" }}>
            <Text fontSize="xl">Итого: {totalAmount} р.</Text>
            <Button
              colorScheme="teal"
              mt={2}
              onClick={handlePlaceOrder}
              isLoading={isLoading}
              loadingText="Оформление..."
            >
              Оформить заказ
            </Button>
          </Box>
        </>
      )}
    </Flex>
  );
};
