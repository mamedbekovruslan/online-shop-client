import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const role = localStorage.getItem("role"); // Получаем роль пользователя

    if (storedUsername) {
      setUsername(storedUsername);
      setIsAdmin(role === "admin"); // Проверяем, является ли пользователь админом
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUsername(null);
    setIsAdmin(false);
    navigate("/auth");
  };

  return (
    <Flex w="100%" justifyContent="center" bg="teal" padding={5}>
      <Box display="flex" justifyContent="space-between">
        <Link to="/" style={{ color: "white", marginRight: "10px" }}>
          Главная
        </Link>
        {isAdmin && (
          <Link
            to="/manage-product"
            style={{ color: "white", marginRight: "10px" }}
          >
            Управление
          </Link>
        )}
        <Link to="/cart" style={{ color: "white", marginRight: "10px" }}>
          Корзина
        </Link>
        {isAdmin && (
          <Link to="/admin" style={{ color: "white", marginRight: "10px" }}>
            Админка
          </Link>
        )}
      </Box>
      <Box
        position="absolute"
        top={username ? "3" : "5"}
        right="5"
        display="flex"
        alignItems="center"
      >
        {username ? (
          <>
            <Text color="white" mr={3}>
              {username}
            </Text>
            <Button colorScheme="transparent" onClick={handleLogout}>
              Выход
            </Button>
          </>
        ) : (
          <Link to="/auth" style={{ color: "white" }}>
            Вход
          </Link>
        )}
      </Box>
    </Flex>
  );
};
