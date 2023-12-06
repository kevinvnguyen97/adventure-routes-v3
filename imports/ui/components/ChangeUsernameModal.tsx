import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FormEvent } from "react";

type ChangeUsernameModalProps = {
  newUsername: string;
  setNewUsername: (newUsername: string) => void;
  applyUsernameChange: () => void;
};
export const ChangeUsernameModal = (props: ChangeUsernameModalProps) => {
  const { newUsername, setNewUsername, applyUsernameChange } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isFormValid = [!!newUsername].every((criteria) => !!criteria);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      applyUsernameChange();
      setNewUsername("");
      onClose();
    }
  };

  return (
    <Box>
      <IconButton
        colorScheme="orange"
        icon={<EditIcon />}
        aria-label="username-edit"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="orange" textColor="white">
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleFormSubmit}
              id="change-password-form"
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <FormControl isRequired isInvalid={!newUsername}>
                <Input
                  placeholder="New Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  backgroundColor="white"
                  textColor="black"
                  focusBorderColor="orange.400"
                  errorBorderColor="red.500"
                  required
                />
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter display="flex" gap={2}>
            <Button
              colorScheme="blue"
              type="submit"
              form="change-password-form"
              disabled={!isFormValid}
            >
              Apply Changes
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
