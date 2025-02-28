import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { useEffect, useState } from "react";
import { getCategories, getProducts } from "../../api/auth";

export const Home = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ category_id: selectedCategory });
        const filteredProducts = response.data.filter(
          (product) => product.quantity > 0
        );
        setProducts(filteredProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  if (loadingCategories || loadingProducts) {
    return <Text>Загрузка...</Text>;
  }

  return (
    <Flex>
      <Box>
        <Text>Категории</Text>
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
          >
            <Button>{category.name}</Button>
          </div>
        ))}
      </Box>
      <Box>
        <Text>Товары</Text>
        <Flex>
          {products.map((product) => (
            <Box key={product.id} p={4} border="1px solid #ccc" m={2}>
              <Text>{product.name}</Text>
              <Text>Цена: {product.price} р.</Text>
              <Text>Кол-во: {product.quantity}</Text>
              <Button
                colorScheme="blue"
                onClick={() => dispatch(addToCart(product))}
              >
                Купить
              </Button>
            </Box>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};
