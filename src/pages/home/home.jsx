// src/components/Home.js
import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getCategories } from "../../api/auth";

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загружаем категории при монтировании компонента
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data); // Сохраняем категории в состояние
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Text>Загрузка...</Text>;
  }

  return (
    <Flex>
      <Box>
        {categories.map((category) => (
          <div key={category.id}>
            <Text>{category.id}</Text>
            <Text>{category.name}</Text>
          </div>
        ))}
      </Box>
      <Box>
        <Text>Сортировки</Text>
        <Flex>
          <Box>Товар 1</Box>
          <Box>Товар 2</Box>
          <Box>Товар 3</Box>
          <Box>Товар 4</Box>
        </Flex>
      </Box>
    </Flex>
  );
};
