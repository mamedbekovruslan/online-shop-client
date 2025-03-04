import { Flex } from "@chakra-ui/react";

export const Content = ({ children }) => {
  return (
    <Flex w="100%" mb="100px" justifyContent="center">
      {children}
    </Flex>
  );
};
