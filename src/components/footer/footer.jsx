import { Flex } from "@chakra-ui/react";

export const Footer = () => {
  const fullYear = new Date().getFullYear();

  return (
    <Flex
      w="100%"
      justifyContent="center"
      bg="teal"
      padding={5}
      color="white"
      pos="absolute"
      bottom={0}
    >
      Copyright © {fullYear}
    </Flex>
  );
};
