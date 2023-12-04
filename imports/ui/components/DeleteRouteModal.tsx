import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

type DeleteRouteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  deleteAdventureRoute: () => void;
};
export const DeleteRouteModal = (props: DeleteRouteModalProps) => {
  const { isOpen, onClose, deleteAdventureRoute } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor="orange" textColor="white">
        <ModalHeader>Delete Route Confirmation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete this route? This process is{" "}
          <b>irreversible</b>.
        </ModalBody>
        <ModalFooter display="flex" gap={2}>
          <Button colorScheme="red" onClick={deleteAdventureRoute}>
            Delete Adventure Route
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
