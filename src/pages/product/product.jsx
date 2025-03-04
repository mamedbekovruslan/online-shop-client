import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct } from "../../api/auth";
import { addToCart } from "../../redux/cartSlice";

export const Product = () => {
  const { id } = useParams(); // Получаем id товара из URL
  const dispatch = useDispatch();
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

  return (
    <Flex direction="column" p={4} alignItems="center">
      <Image src={product.photo} alt={product.name} boxSize="300px" mb={4} />
      <Text fontSize="2xl">{product.name}</Text>
      <Text fontSize="lg">Цена: {product.price} р.</Text>
      <Text>Кол-во на складе: {product.quantity} шт.</Text>
      <Button
        colorScheme="blue"
        mt={4}
        onClick={() => dispatch(addToCart(product))}
      >
        Купить
      </Button>
    </Flex>
  );
};
