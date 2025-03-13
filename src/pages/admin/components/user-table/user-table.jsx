import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Skeleton,
  TableContainer,
} from "@chakra-ui/react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { UserRow } from "../user-row/user-row";

export const UserTable = ({
  users,
  isLoading,
  editingUser,
  setEditingUser,
  onUpdateUser,
  onDeleteUser,
  sortOrder,
  handleSort,
}) => {
  return (
    <TableContainer w="100%" overflowX="auto">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th cursor="pointer" onClick={handleSort}>
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
                .map((_, idx) => (
                  <Tr key={idx}>
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
            : users
                .filter((user) => user.username !== "admin")
                .map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    isEditing={editingUser === user.id}
                    onEdit={() => setEditingUser(user.id)}
                    onCancel={() => setEditingUser(null)}
                    onUpdateUser={onUpdateUser}
                    onDeleteUser={onDeleteUser}
                  />
                ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
