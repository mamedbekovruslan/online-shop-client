import { Flex } from "@chakra-ui/react";

export const Content = ({ children }) => {
  return (
    <Flex
      maxW="1240px"
      w="100%"
      px={{ base: 4, md: 8 }} // отступы по бокам на маленьких экранах
      mb="100px"
      mx="auto" // центрирует контейнер по горизонтали
      justifyContent="center"
    >
      {children}
    </Flex>
  );
};
