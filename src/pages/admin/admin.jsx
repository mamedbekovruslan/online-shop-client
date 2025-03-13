import {
  Box,
  Flex,
  Input,
  Text,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getUsers, addUser, deleteUser, updateUser } from "../../api/auth";
import { AddUserForm, UserTable, DeleteUserModal } from "./components";

export const Admin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      console.error("Ошибка загрузки пользователей:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleAddUser = async (user) => {
    await addUser(user);
    fetchUsers();
  };

  const handleDeleteUser = async () => {
    await deleteUser(deleteUserId);
    setDeleteUserId(null);
    onClose();
    fetchUsers();
  };

  const handleUpdateUser = async (id, updatedUser) => {
    await updateUser(id, updatedUser);
    setEditingUser(null);
    fetchUsers();
  };

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setFilteredUsers((prev) =>
      [...prev].sort((a, b) =>
        newOrder === "asc"
          ? a.username.localeCompare(b.username)
          : b.username.localeCompare(a.username)
      )
    );
  };

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>
        Управление учетными записями
      </Text>
      <Flex direction={{ base: "column", lg: "row" }} gap={6}>
        <AddUserForm onAddUser={handleAddUser} />
        <Box w={{ base: "100%", lg: "75%" }}>
          <Input
            placeholder="Поиск по username..."
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            mb={4}
          />
          <UserTable
            users={filteredUsers}
            isLoading={isLoading}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={(id) => {
              setDeleteUserId(id);
              onOpen();
            }}
            sortOrder={sortOrder}
            handleSort={handleSort}
          />
        </Box>
      </Flex>

      <DeleteUserModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDeleteUser}
      />
    </Box>
  );
};
