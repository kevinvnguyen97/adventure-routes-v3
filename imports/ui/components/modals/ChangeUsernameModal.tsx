import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
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
import { Color, MINIMUM_USERNAME_LENGTH } from "/imports/constants";

type ChangeUsernameModalProps = {
  oldUsername: string;
  newUsername: string;
  setNewUsername: (newUsername: string) => void;
  applyUsernameChange: () => void;
};
export const ChangeUsernameModal = (props: ChangeUsernameModalProps) => {
  const { oldUsername, newUsername, setNewUsername, applyUsernameChange } =
    props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isFormValid = [
    !!newUsername,
    newUsername.length >= MINIMUM_USERNAME_LENGTH,
    oldUsername !== newUsername,
  ].every((criteria) => !!criteria);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      applyUsernameChange();
      setNewUsername("");
      onClose();
    }
  };

  const usernameErrorMessage = () => {
    if (!newUsername) {
      return "Username required";
    } else if (newUsername.length < MINIMUM_USERNAME_LENGTH) {
      return `Username must be at least ${MINIMUM_USERNAME_LENGTH} characters long`;
    } else if (oldUsername === newUsername) {
      return "Username input must not be the current username";
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
        <ModalContent backgroundColor={Color.ORANGE} textColor={Color.WHITE}>
          <ModalHeader>Change Username</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleFormSubmit}
              id="change-username-form"
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <FormControl
                isRequired
                isInvalid={
                  !newUsername ||
                  newUsername.length < MINIMUM_USERNAME_LENGTH ||
                  oldUsername === newUsername
                }
              >
                <Input
                  placeholder="New Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  backgroundColor={Color.WHITE}
                  textColor={Color.BLACK}
                  focusBorderColor="orange.400"
                  errorBorderColor="red.500"
                  required
                />
                <FormErrorMessage>{usernameErrorMessage()}</FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter display="flex" gap={2}>
            <Button
              colorScheme="orange"
              type="submit"
              form="change-username-form"
              isDisabled={!isFormValid}
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
