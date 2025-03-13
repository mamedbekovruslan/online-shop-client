// pages/Home/Home.jsx
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useBreakpointValue,
  Spinner,
} from "@chakra-ui/react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCategories, getProducts } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { CategoryFilter } from "./components/category-filter/category-filter";
import { ProductList } from "./components";

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
        const filtered = response.data.filter(
          (product) => product.quantity > 0
        );
        setProducts(filtered);
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
    const sorted = [...filteredProducts].sort((a, b) =>
      newOrder === "asc" ? a.price - b.price : b.price - a.price
    );
    setProducts(sorted);
  };

  return (
    <Flex direction="column" w="100%" p={isMobile ? 0 : 4}>
      <Flex
        direction={{ base: "column", lg: "row" }}
        align="flex-start"
        gap={6}
      >
        <CategoryFilter
          categories={categories}
          loading={loadingCategories}
          selected={selectedCategory}
          setSelected={setSelectedCategory}
        />

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
            <ProductList
              products={filteredProducts}
              cartItems={cartItems}
              dispatch={dispatch}
              navigate={navigate}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  );
};
