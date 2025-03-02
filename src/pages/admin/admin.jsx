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
} from "@chakra-ui/react";
import { deleteUser, getUsers, updateUser, addUser } from "../../api/auth";

export const Admin = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
    }
  };

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

  // Обработчик изменения полей нового пользователя
  const handleNewUserChange = (field, value) => {
    setNewUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Добавление нового пользователя
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert("Заполните все поля!");
      return;
    }

    try {
      await addUser(newUser);
      setNewUser({ username: "", email: "", password: "", role: "user" });
      fetchUsers(); // Обновляем список пользователей после добавления
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error);
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>
        Управление учетными записями
      </Text>

      {/* Форма добавления нового пользователя */}
      <Box p={4} border="1px solid #ccc" borderRadius="md" mb={4}>
        <Text fontSize="xl" mb={2}>
          Добавить нового пользователя
        </Text>
        <VStack spacing={2} align="stretch">
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
          <Button colorScheme="green" onClick={handleAddUser}>
            Добавить
          </Button>
        </VStack>
      </Box>

      {/* Таблица пользователей */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Имя пользователя</Th>
            <Th>Email</Th>
            <Th>Роль</Th>
            <Th>Действия</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>
                {editingUser === user.id ? (
                  <Input
                    value={user.username}
                    onChange={(e) =>
                      handleInputChange(user.id, "username", e.target.value)
                    }
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
                      handleInputChange(user.id, "email", e.target.value)
                    }
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
                      handleInputChange(user.id, "role", e.target.value)
                    }
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
                  <Button
                    colorScheme="green"
                    onClick={() => handleUpdateUser(user.id)}
                  >
                    Сохранить
                  </Button>
                ) : (
                  <Button
                    colorScheme="blue"
                    onClick={() => setEditingUser(user.id)}
                  >
                    Редактировать
                  </Button>
                )}
                <Button
                  colorScheme="red"
                  ml={2}
                  onClick={() => {
                    setDeleteUserId(user.id);
                    onOpen();
                  }}
                >
                  Удалить
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Модальное окно для удаления */}
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
