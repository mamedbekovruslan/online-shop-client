import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

export const DeleteUserModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Подтверждение удаления</ModalHeader>
        <ModalBody>
          <Text>Вы уверены, что хотите удалить этого пользователя?</Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Отмена</Button>
          <Button colorScheme="red" ml={3} onClick={onConfirm}>
            Удалить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
