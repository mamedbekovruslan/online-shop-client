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
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { HamburgerIcon, UnlockIcon } from "@chakra-ui/icons";
import { FiLogOut } from "react-icons/fi";

export const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (storedUsername) {
      setUsername(storedUsername);
      setIsAdmin(role === "admin");
    }
  }, []);

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUsername(null);
    setIsAdmin(false);
    onClose();
    navigate("/auth");
  };

  return (
    <>
      <Flex
        w="100%"
        justifyContent={isMobile ? "space-between" : "center"}
        alignItems="center"
        bg="teal"
        p={4}
        position="relative"
      >
        <h1
          style={{
            position: "absolute",
            left: isMobile ? "66px" : "20px",
            fontSize: "20px",
            color: "white",
          }}
        >
          ECom
        </h1>

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
              {!isAdmin && (
                <MenuItem as={Link} to="/orders">
                  Мои заказы
                </MenuItem>
              )}
              {isAdmin && (
                <MenuItem as={Link} to="/admin">
                  Админка
                </MenuItem>
              )}
              {isAdmin && (
                <MenuItem as={Link} to="/all-orders">
                  Заказы клиентов
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
                onClick={onOpen}
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

      {/* ✅ Модальное окно подтверждения выхода */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Выход из аккаунта
            </AlertDialogHeader>

            <AlertDialogBody>
              Вы уверены, что хотите выйти из своей учетной записи?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Нет
              </Button>
              <Button colorScheme="red" onClick={confirmLogout} ml={3}>
                Да
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
