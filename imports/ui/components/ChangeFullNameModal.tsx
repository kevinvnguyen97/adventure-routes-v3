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

type ChangeFullNameModalProps = {
  newFirstNameInput: string;
  setNewFirstNameInput: (newFirstNameInput: string) => void;
  newLastNameInput: string;
  setNewLastNameInput: (newLastNameInput: string) => void;
  changeFullName: () => void;
};
export const ChangeFullNameModal = (props: ChangeFullNameModalProps) => {
  const {
    newFirstNameInput,
    setNewFirstNameInput,
    newLastNameInput,
    setNewLastNameInput,
    changeFullName,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isFormValid = [newFirstNameInput, newLastNameInput].every(
    (criteria) => !!criteria
  );

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      changeFullName();
      onClose();
    }
  };

  return (
    <Box>
      <IconButton
        colorScheme="orange"
        icon={<EditIcon />}
        onClick={onOpen}
        aria-label="change-full-name-button"
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="orange" textColor="white">
          <ModalHeader>Change Full Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleFormSubmit}
              id="change-full-name-form"
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <FormControl isRequired isInvalid={!newFirstNameInput}>
                <Input
                  placeholder="First Name"
                  value={newFirstNameInput}
                  onChange={(e) => setNewFirstNameInput(e.target.value)}
                  backgroundColor="white"
                  textColor="black"
                  focusBorderColor="orange.400"
                  errorBorderColor="red.500"
                  required
                />
                <FormErrorMessage>First name required</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!newLastNameInput}>
                <Input
                  placeholder="Last Name"
                  value={newLastNameInput}
                  onChange={(e) => setNewLastNameInput(e.target.value)}
                  backgroundColor="white"
                  textColor="black"
                  focusBorderColor="orange.400"
                  errorBorderColor="red.500"
                  required
                />
                <FormErrorMessage>Last name required</FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter display="flex" gap={2}>
            <Button
              colorScheme="blue"
              type="submit"
              form="change-full-name-form"
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
