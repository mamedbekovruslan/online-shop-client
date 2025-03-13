import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Удалить товар</ModalHeader>
      <ModalBody>Вы действительно хотите удалить этот товар?</ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Нет</Button>
        <Button colorScheme="red" onClick={onConfirm} ml={3}>
          Да
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
