import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, getProducts } from "../../api/auth";
import { addToCart, updateQuantity } from "../../redux/cartSlice";

export const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // Показываем загрузку при изменении товара
        setRelatedProducts([]); // Очищаем список связанных товаров перед загрузкой

        const response = await getProduct(id);
        setProduct(response.data);

        // Загружаем товары из той же категории
        const relatedResponse = await getProducts({
          category_id: response.data.category_id,
        });

        setRelatedProducts(
          relatedResponse.data.filter((item) => item.id !== response.data.id)
        );
      } catch (err) {
        console.error("Ошибка при загрузке товара:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Теперь useEffect срабатывает при каждом изменении id

  if (loading) {
    return <Text>Загрузка...</Text>;
  }

  if (!product) {
    return <Text>Товар не найден</Text>;
  }

  const cartItem = cartItems.find((item) => item.id === product.id);

  return (
    <Flex direction="column" p={4} alignItems="center">
      {/* Фото товара */}
      <Image
        src={`http://89.111.170.174:3000${product.photo}`}
        alt={product.name}
        boxSize="250px"
        objectFit="contain"
        mb={4}
      />

      {/* Информация о товаре */}
      <Text fontSize="2xl">{product.name}</Text>
      <Text fontSize="lg">Цена: {product.price} р.</Text>
      <Text>Кол-во на складе: {product.quantity} шт.</Text>

      {cartItem ? (
        <Flex align="center" justify="center" mt={4}>
          <Button
            size="sm"
            padding="20px 10px"
            onClick={() =>
              dispatch(updateQuantity({ id: product.id, change: -1 }))
            }
            isDisabled={cartItem.quantity <= 1}
          >
            ➖
          </Button>
          <Text mx={5}>{cartItem.quantity}</Text>
          <Button
            size="sm"
            padding="20px 10px"
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

      {/* Товары из той же категории */}
      {relatedProducts.length > 0 && (
        <Box w="100%" mt={4}>
          <Text fontSize="xl" mb={4}>
            Товары из той же категории
          </Text>
          <Box
            overflowX="auto"
            whiteSpace="nowrap"
            css={{
              "&::-webkit-scrollbar": { height: "5px" },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "5px",
              },
              scrollbarWidth: "thin",
            }}
          >
            {relatedProducts.map((relatedProduct) => (
              <Box
                key={relatedProduct.id}
                display="inline-block"
                minWidth="200px"
                maxWidth="200px"
                borderRadius="8px"
                p={3}
                m={2}
                cursor="pointer"
                textAlign="center"
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <Image
                  src={`http://89.111.170.174:3000${relatedProduct.photo}`}
                  alt={relatedProduct.name}
                  boxSize="150px"
                  objectFit="contain"
                  m="auto"
                  mb={2}
                />
                <Text fontSize="sm">{relatedProduct.name}</Text>
                <Text fontSize="sm">Цена: {relatedProduct.price} р.</Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Flex>
  );
};
