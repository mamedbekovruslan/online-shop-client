import { Box, Button, Flex, ListItem, UnorderedList } from "@chakra-ui/react";

export const Home = () => {
  return (
    <Flex w="100%">
      <Box w="30%">
        <Button>Телефоны</Button>
        <Button>Ноутбуки</Button>
        <Button>Игровые приставки</Button>
        <Button>Телевизоры</Button>
        <Button>Аксесуары</Button>
      </Box>
      <Box w="70%">Товары</Box>
    </Flex>
  );
};
