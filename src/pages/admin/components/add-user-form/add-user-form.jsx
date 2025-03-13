import { Box, Text, VStack, Input, Select, Button } from "@chakra-ui/react";
import { useState } from "react";

export const AddUserForm = ({ onAddUser }) => {
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert("Заполните все поля!");
      return;
    }

    onAddUser(newUser);
    setNewUser({ username: "", email: "", password: "", role: "user" });
  };

  return (
    <Box
      p={4}
      border="1px solid #e2e8f0"
      borderRadius="md"
      w={{ base: "100%", lg: "25%" }}
    >
      <Text fontSize="lg" mb={2}>
        Добавить пользователя
      </Text>
      <VStack spacing={3} align="stretch">
        <Input
          placeholder="Имя пользователя"
          value={newUser.username}
          onChange={(e) => handleChange("username", e.target.value)}
        />
        <Input
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <Input
          placeholder="Пароль"
          type="password"
          value={newUser.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />
        <Select
          value={newUser.role}
          onChange={(e) => handleChange("role", e.target.value)}
        >
          <option value="admin">admin</option>
          <option value="moder">moder</option>
          <option value="user">user</option>
        </Select>
        <Button colorScheme="teal" onClick={handleSubmit}>
          Добавить
        </Button>
      </VStack>
    </Box>
  );
};
