import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
  Badge,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HamburgerIcon, UnlockIcon } from "@chakra-ui/icons";
import { FiLogOut } from "react-icons/fi";

export const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (storedUsername) {
      setUsername(storedUsername);
      setIsAdmin(role === "admin");
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
    <Flex
      w="100%"
      justifyContent={isMobile ? "space-between" : "center"}
      alignItems="center"
      bg="teal"
      p={4}
      position="relative"
    >
      {isMobile ? (
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<HamburgerIcon />}
            borderWidth={2}
            borderColor="white"
            color="white"
            colorScheme="whiteAlpha"
            variant="outline"
          />
          <MenuList>
            <MenuItem as={Link} to="/">
              Главная
            </MenuItem>
            {isAdmin && (
              <MenuItem as={Link} to="/manage-product">
                Управление
              </MenuItem>
            )}
            <MenuItem as={Link} to="/cart">
              Корзина
            </MenuItem>
            {isAdmin && (
              <MenuItem as={Link} to="/admin">
                Админка
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      ) : (
        <Flex gap={4} align="center">
          <Link to="/">
            <Badge
              colorScheme="whiteAlpha"
              variant="solid"
              p={1}
              borderRadius="4px"
            >
              Главная
            </Badge>
          </Link>
          {isAdmin && (
            <Link to="/manage-product">
              <Badge
                colorScheme="whiteAlpha"
                variant="solid"
                p={1}
                borderRadius="4px"
              >
                Управление
              </Badge>
            </Link>
          )}
          <Link to="/cart">
            <Badge
              colorScheme="whiteAlpha"
              variant="solid"
              p={1}
              borderRadius="4px"
            >
              Корзина
            </Badge>
          </Link>
          {isAdmin && (
            <Link to="/admin">
              <Badge
                colorScheme="whiteAlpha"
                variant="solid"
                p={1}
                borderRadius="4px"
              >
                Админка
              </Badge>
            </Link>
          )}
          {isAdmin ? (
            <Link to="/all-orders">
              <Badge
                colorScheme="whiteAlpha"
                variant="solid"
                p={1}
                borderRadius="4px"
              >
                Заказы клиентов
              </Badge>
            </Link>
          ) : (
            <Link to="/orders">
              <Badge
                colorScheme="whiteAlpha"
                variant="solid"
                p={1}
                borderRadius="4px"
              >
                Мои заказы
              </Badge>
            </Link>
          )}
        </Flex>
      )}

      <Flex
        align="center"
        position={isMobile ? "unset" : "absolute"}
        right="20px"
      >
        {username ? (
          <>
            <Text color="white" fontWeight="bold" mr={3}>
              {username}
            </Text>

            <IconButton
              icon={<FiLogOut />}
              fontSize="25px"
              _hover={{ background: "transparent" }}
              aria-label="Выход"
              variant="ghost"
              color="white"
              onClick={handleLogout}
            />
          </>
        ) : (
          <IconButton
            icon={<UnlockIcon />}
            fontSize="25px"
            _hover={{ background: "transparent" }}
            aria-label="Вход"
            variant="ghost"
            color="white"
            onClick={() => navigate("/auth")}
          />
        )}
      </Flex>
    </Flex>
  );
};
