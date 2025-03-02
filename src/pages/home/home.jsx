import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // Состояние для поиска

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories([{ id: "all", name: "Все" }, ...response.data]);
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
        const response = await getProducts(
          selectedCategory === "all" ? {} : { category_id: selectedCategory }
        );
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

  // Фильтрация товаров по названию
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loadingCategories || loadingProducts) {
    return <Text>Загрузка...</Text>;
  }

  return (
    <Flex direction="column" p={4}>
      {/* Поле поиска */}
      <Input
        placeholder="Поиск товара..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />

      <Flex>
        {/* Блок категорий */}
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

        {/* Блок товаров */}
        <Box>
          <Text>Товары</Text>
          <Flex wrap="wrap">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
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
              ))
            ) : (
              <Text mt={4}>Товары не найдены</Text>
            )}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};
