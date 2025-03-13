import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
  Flex,
  IconButton,
  useBreakpointValue,
  Skeleton,
} from "@chakra-ui/react";
import { deleteUser, getUsers, updateUser, addUser } from "../../api/auth";
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineSave,
} from "react-icons/ai";

export const Admin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // Фильтрованные пользователи
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchUsername, setSearchUsername] = useState(""); // Поиск по username
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Состояние для нового пользователя
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Фильтрация по username
  useEffect(() => {
    if (searchUsername) {
      setFilteredUsers(
        users.filter((user) =>
          user.username.toLowerCase().includes(searchUsername.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchUsername, users]);

  const handleDeleteUser = async () => {
    try {
      await deleteUser(deleteUserId);
      setUsers(users.filter((user) => user.id !== deleteUserId));
      setDeleteUserId(null);
      onClose();
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };

  const handleUpdateUser = async (id) => {
    const updatedUser = users.find((user) => user.id === id);
    try {
      await updateUser(id, updatedUser);
      setEditingUser(null);
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error);
    }
  };

  const handleInputChange = (id, field, value) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, [field]: value } : user
      )
    );
  };

  const handleNewUserChange = (field, value) => {
    setNewUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert("Заполните все поля!");
      return;
    }

    try {
      await addUser(newUser);
      setNewUser({ username: "", email: "", password: "", role: "user" });
      fetchUsers();
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error);
    }
  };

  // Сортировка по username
  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a.username < b.username) return newOrder === "asc" ? -1 : 1;
      if (a.username > b.username) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sortedUsers);
  };

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>
        Управление учетными записями
      </Text>

      <Flex
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        align="flex-start"
        gap={6}
      >
        {/* Форма добавления */}
        <Box
          p={4}
          borderRadius="md"
          w={{ base: "100%", lg: "25%" }}
          border="1px solid #e2e8f0"
        >
          <Text fontSize="lg" mb={2}>
            Добавить пользователя
          </Text>
          <VStack spacing={3} align="stretch">
            <Input
              placeholder="Имя пользователя"
              value={newUser.username}
              onChange={(e) => handleNewUserChange("username", e.target.value)}
            />
            <Input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => handleNewUserChange("email", e.target.value)}
            />
            <Input
              placeholder="Пароль"
              type="password"
              value={newUser.password}
              onChange={(e) => handleNewUserChange("password", e.target.value)}
            />
            <Select
              value={newUser.role}
              onChange={(e) => handleNewUserChange("role", e.target.value)}
            >
              <option value="admin">admin</option>
              <option value="moder">moder</option>
              <option value="user">user</option>
            </Select>
            <Button colorScheme="teal" onClick={handleAddUser}>
              Добавить
            </Button>
          </VStack>
        </Box>

        {/* Таблица */}
        <Box w={{ base: "100%", lg: "75%" }}>
          <Input
            placeholder="Поиск по username..."
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            mb={4}
          />

          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th onClick={handleSort} cursor="pointer">
                    Имя пользователя{" "}
                    {sortOrder === "asc" ? (
                      <AiOutlineArrowUp />
                    ) : (
                      <AiOutlineArrowDown />
                    )}
                  </Th>
                  <Th>Email</Th>
                  <Th>Роль</Th>
                  <Th>Действия</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading
                  ? Array(5)
                      .fill(null)
                      .map((_, index) => (
                        <Tr key={index}>
                          <Td>
                            <Skeleton height="20px" />
                          </Td>
                          <Td>
                            <Skeleton height="20px" />
                          </Td>
                          <Td>
                            <Skeleton height="20px" />
                          </Td>
                          <Td>
                            <Skeleton height="32px" width="70px" />
                          </Td>
                        </Tr>
                      ))
                  : filteredUsers
                      .filter((user) => user.username !== "admin")
                      .map((user) => (
                        <Tr key={user.id}>
                          <Td>
                            {editingUser === user.id ? (
                              <Input
                                value={user.username}
                                onChange={(e) =>
                                  handleInputChange(
                                    user.id,
                                    "username",
                                    e.target.value
                                  )
                                }
                                size="sm"
                                width={isMobile ? "200px" : "unset"}
                              />
                            ) : (
                              user.username
                            )}
                          </Td>
                          <Td>
                            {editingUser === user.id ? (
                              <Input
                                value={user.email}
                                onChange={(e) =>
                                  handleInputChange(
                                    user.id,
                                    "email",
                                    e.target.value
                                  )
                                }
                                size="sm"
                                width={isMobile ? "200px" : "unset"}
                              />
                            ) : (
                              user.email
                            )}
                          </Td>
                          <Td>
                            {editingUser === user.id ? (
                              <Select
                                value={user.role}
                                onChange={(e) =>
                                  handleInputChange(
                                    user.id,
                                    "role",
                                    e.target.value
                                  )
                                }
                                size="sm"
                                width={isMobile ? "100px" : "unset"}
                              >
                                <option value="admin">admin</option>
                                <option value="moder">moder</option>
                                <option value="user">user</option>
                              </Select>
                            ) : (
                              user.role
                            )}
                          </Td>
                          <Td>
                            {editingUser === user.id ? (
                              <>
                                <IconButton
                                  icon={<AiOutlineSave />}
                                  aria-label="Сохранить"
                                  colorScheme="green"
                                  size="sm"
                                  onClick={() => handleUpdateUser(user.id)}
                                  mr={isMobile ? 1 : 2}
                                />
                                <IconButton
                                  icon={<AiOutlineClose />}
                                  aria-label="Отмена"
                                  colorScheme="red"
                                  size="sm"
                                  onClick={() => setEditingUser(null)}
                                />
                              </>
                            ) : (
                              <>
                                <IconButton
                                  icon={<AiOutlineEdit />}
                                  aria-label="Редактировать"
                                  onClick={() => setEditingUser(user.id)}
                                  size="sm"
                                  colorScheme="blue"
                                  mr={isMobile ? 1 : 2}
                                />
                                <IconButton
                                  icon={<AiOutlineDelete />}
                                  aria-label="Удалить"
                                  onClick={() => {
                                    setDeleteUserId(user.id);
                                    onOpen();
                                  }}
                                  size="sm"
                                  colorScheme="red"
                                />
                              </>
                            )}
                          </Td>
                        </Tr>
                      ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>

      {/* Модальное окно */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Подтверждение удаления</ModalHeader>
          <ModalBody>
            <Text>Вы уверены, что хотите удалить этого пользователя?</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Отмена</Button>
            <Button colorScheme="red" ml={3} onClick={handleDeleteUser}>
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
