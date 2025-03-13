import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useBreakpointValue,
  Select,
  Skeleton,
  Spinner,
} from "@chakra-ui/react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
} from "../../redux/cartSlice";
import { useEffect, useState } from "react";
import { getCategories, getProducts } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const isMobile = useBreakpointValue({ base: true, lg: false });

  const itemWidth = useBreakpointValue({
    base: "100%",
    sm: "48%",
    md: "32%",
    lg: "23.7%",
  });

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
      setLoadingProducts(true);
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSortByPrice = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    const sortedProducts = [...filteredProducts].sort((a, b) =>
      newOrder === "asc" ? a.price - b.price : b.price - a.price
    );
    setProducts(sortedProducts);
  };

  return (
    <Flex direction="column" w="100%" p={isMobile ? 0 : 4}>
      <Flex
        direction={{ base: "column", lg: "row" }}
        align="flex-start"
        gap={6}
      >
        {/* Категории */}
        <Box w={{ base: "100%", lg: "15%" }}>
          <Text fontSize="xl" mb={4}>
            Категории
          </Text>

          {loadingCategories ? (
            [...Array(categories)].map((_, i) => (
              <Skeleton height="30px" mb={2} key={i} borderRadius="md" />
            ))
          ) : isMobile ? (
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              mb={4}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          ) : (
            categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                padding="0px 0px 0px 10px"
                w="100%"
                justifyContent="flex-start"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))
          )}
        </Box>

        {/* Товары */}
        <Box w={{ base: "100%", lg: "85%" }}>
          <Flex
            justify={{ base: "flex-start", md: "space-between" }}
            direction={{ base: "column", md: "row" }}
            align="center"
            mb={4}
            gap={4}
          >
            <Text fontSize="xl" position="relative" top="-7px">
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

          <Input
            placeholder="Поиск товара..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb={6}
          />

          {loadingProducts ? (
            <Flex justify="center" align="center" h="200px">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <Flex wrap="wrap" gap={4}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const cartItem = cartItems.find(
                    (item) => item.id === product.id
                  );

                  return (
                    <Box
                      key={product.id}
                      p={4}
                      borderRadius="md"
                      w={itemWidth}
                      textAlign="center"
                      cursor="pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                      border="1px solid #eee"
                      bg="white"
                      height="350px"
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Box
                          width="100%"
                          height="180px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          overflow="hidden"
                          mb={3}
                        >
                          {product.photo ? (
                            <img
                              src={`http://89.111.170.174:3000${product.photo}`}
                              alt={product.name}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <Text fontSize="sm" color="gray.500">
                              Нет фото
                            </Text>
                          )}
                        </Box>

                        <Text fontWeight="semibold">{product.name}</Text>
                        <Text fontSize="sm">Цена: {product.price} р.</Text>
                        <Text fontSize="sm">Кол-во: {product.quantity}</Text>
                      </Box>

                      {cartItem ? (
                        <Flex align="center" justify="center" mt={2}>
                          <Button
                            size="sm"
                            padding="20px 10px"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (cartItem.quantity === 1) {
                                dispatch(removeFromCart(product.id));
                              } else {
                                dispatch(
                                  updateQuantity({ id: product.id, change: -1 })
                                );
                              }
                            }}
                          >
                            ➖
                          </Button>
                          <Text mx={5}>{cartItem.quantity}</Text>
                          <Button
                            size="sm"
                            padding="20px 10px"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(
                                updateQuantity({ id: product.id, change: 1 })
                              );
                            }}
                            isDisabled={cartItem.quantity >= product.quantity} // ⛔ запрещаем больше чем есть
                          >
                            ➕
                          </Button>
                        </Flex>
                      ) : (
                        <Button
                          colorScheme="teal"
                          mt={2}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(addToCart(product));
                          }}
                        >
                          Купить
                        </Button>
                      )}
                    </Box>
                  );
                })
              ) : (
                <Text mt={4}>Товары не найдены</Text>
              )}
            </Flex>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};
