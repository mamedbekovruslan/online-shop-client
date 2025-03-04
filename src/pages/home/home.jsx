import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai"; // Иконки сортировки
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { useEffect, useState } from "react";
import { getCategories, getProducts } from "../../api/auth";
import { useNavigate } from "react-router-dom"; // Импортируем хук навигации

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Хук для перехода на страницу товара
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

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

  // Сортировка товаров по стоимости
  const handleSortByPrice = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      return newOrder === "asc" ? a.price - b.price : b.price - a.price;
    });

    setProducts(sortedProducts);
  };

  if (loadingCategories || loadingProducts) {
    return <Text>Загрузка...</Text>;
  }

  return (
    <Flex direction="column" w="100%" p={4}>
      {/* Поле поиска */}

      <Flex>
        {/* Блок категорий */}
        <Box mr={10}>
          <Text fontSize="xl" mb={10}>
            Категории
          </Text>
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              <Button
                variant={"ghost"}
                w="100%"
                justifyContent="flex-start"
                background="transparent !important"
                p={0}
              >
                {category.name}
              </Button>
            </div>
          ))}
        </Box>

        {/* Блок товаров */}
        <Box flex="1">
          <Flex justify="space-between" align="center">
            <Text fontSize="xl" mb={10}>
              Товары
            </Text>
            <Button onClick={handleSortByPrice}>
              Сортировка по цене{" "}
              {sortOrder === "asc" ? (
                <AiOutlineArrowUp />
              ) : (
                <AiOutlineArrowDown />
              )}
            </Button>
          </Flex>

          <Box>
            <Input
              placeholder="Поиск товара..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              mb={4}
            />
          </Box>

          {/* Грид для товаров */}
          <Flex wrap="wrap" gap="7px" justify="flex-start">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Box
                  key={product.id}
                  p={4}
                  border="1px solid #ccc"
                  cursor="pointer"
                  width="24.4%"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <Text>{product.name}</Text>
                  <Text>Цена: {product.price} р.</Text>
                  <Text>Кол-во: {product.quantity}</Text>
                  <Button
                    colorScheme="blue"
                    mt={2}
                    onClick={(e) => {
                      e.stopPropagation(); // Останавливаем всплытие события, чтобы не срабатывал navigate
                      dispatch(addToCart(product));
                    }}
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
