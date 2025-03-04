import { Flex } from "@chakra-ui/react";

export const Content = ({ children }) => {
  return (
    <Flex w="1240px" mb="100px" justifyContent="center">
      {children}
    </Flex>
  );
};
