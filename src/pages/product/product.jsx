import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct } from "../../api/auth";
import { addToCart, updateQuantity } from "../../redux/cartSlice";

export const Product = () => {
  const { id } = useParams(); // Получаем id товара из URL
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items); // Данные корзины
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке товара:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <Text>Загрузка...</Text>;
  }

  if (!product) {
    return <Text>Товар не найден</Text>;
  }

  // Проверяем, есть ли товар в корзине
  const cartItem = cartItems.find((item) => item.id === product.id);

  return (
    <Flex direction="column" p={4} alignItems="center">
      {/* Фото товара */}
      <Image
        src={`http://89.111.170.174:3000${product.photo}`}
        alt={product.name}
        boxSize="300px"
        objectFit="contain"
        // border="1px solid #ddd"
        // boxShadow="md"
        mb={4}
      />

      {/* Информация о товаре */}
      <Text fontSize="2xl">{product.name}</Text>
      <Text fontSize="lg">Цена: {product.price} р.</Text>
      <Text>Кол-во на складе: {product.quantity} шт.</Text>

      {/* Если товар уже в корзине, показываем + и - */}
      {cartItem ? (
        <Flex align="center" justify="center" mt={4}>
          <Button
            size="sm"
            onClick={() =>
              dispatch(updateQuantity({ id: product.id, change: -1 }))
            }
            isDisabled={cartItem.quantity <= 1}
          >
            ➖
          </Button>
          <Text mx={2}>{cartItem.quantity}</Text>
          <Button
            size="sm"
            onClick={() =>
              dispatch(updateQuantity({ id: product.id, change: 1 }))
            }
          >
            ➕
          </Button>
        </Flex>
      ) : (
        <Button
          colorScheme="teal"
          mt={4}
          onClick={() => dispatch(addToCart(product))}
        >
          Купить
        </Button>
      )}
    </Flex>
  );
};
