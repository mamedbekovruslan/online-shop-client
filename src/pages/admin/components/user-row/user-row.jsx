import {
  Td,
  Tr,
  Input,
  Select,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineSave,
  AiOutlineClose,
} from "react-icons/ai";
import { useState } from "react";

export const UserRow = ({
  user,
  isEditing,
  onEdit,
  onCancel,
  onUpdateUser,
  onDeleteUser,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Tr>
      <Td>
        {isEditing ? (
          <Input
            value={editedUser.username}
            onChange={(e) => handleChange("username", e.target.value)}
            size="sm"
            width={isMobile ? "200px" : "unset"}
          />
        ) : (
          user.username
        )}
      </Td>
      <Td>
        {isEditing ? (
          <Input
            value={editedUser.email}
            onChange={(e) => handleChange("email", e.target.value)}
            size="sm"
            width={isMobile ? "200px" : "unset"}
          />
        ) : (
          user.email
        )}
      </Td>
      <Td>
        {isEditing ? (
          <Select
            value={editedUser.role}
            onChange={(e) => handleChange("role", e.target.value)}
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
        {isEditing ? (
          <>
            <IconButton
              icon={<AiOutlineSave />}
              aria-label="Сохранить"
              colorScheme="green"
              size="sm"
              onClick={() => onUpdateUser(user.id, editedUser)}
              mr={1}
            />
            <IconButton
              icon={<AiOutlineClose />}
              aria-label="Отмена"
              colorScheme="red"
              size="sm"
              onClick={onCancel}
            />
          </>
        ) : (
          <>
            <IconButton
              icon={<AiOutlineEdit />}
              aria-label="Редактировать"
              colorScheme="blue"
              size="sm"
              mr={1}
              onClick={onEdit}
            />
            <IconButton
              icon={<AiOutlineDelete />}
              aria-label="Удалить"
              colorScheme="red"
              size="sm"
              onClick={() => onDeleteUser(user.id)}
            />
          </>
        )}
      </Td>
    </Tr>
  );
};
