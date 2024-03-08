import React, { FormEvent } from "react";
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

import { Color } from "/imports/constants";
import { isValidEmail } from "/imports/utils";

type ChangeEmailModalProps = {
  currentEmail: string;
  oldEmailInput: string;
  setOldEmailInput: (oldEmailInput: string) => void;
  newEmailInput: string;
  setNewEmailInput: (newEmailInput: string) => void;
  changeEmail: () => void;
  newEmailReentryInput: string;
  setNewEmailReentryInput: (newEmailReentryInput: string) => void;
};
export const ChangeEmailModal = (props: ChangeEmailModalProps) => {
  const {
    currentEmail,
    oldEmailInput,
    setOldEmailInput,
    newEmailInput,
    setNewEmailInput,
    newEmailReentryInput,
    setNewEmailReentryInput,
    changeEmail,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isFormValid = [
    newEmailInput,
    newEmailReentryInput,
    newEmailInput !== currentEmail,
    oldEmailInput,
    oldEmailInput === currentEmail,
    newEmailInput === newEmailReentryInput,
    isValidEmail(oldEmailInput),
    isValidEmail(newEmailInput),
    isValidEmail(newEmailReentryInput),
  ].every((criteria) => !!criteria);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      changeEmail();
      setOldEmailInput("");
      setNewEmailInput("");
      setNewEmailReentryInput("");
      onClose();
    }
  };

  const oldEmailErrorMessage = () => {
    if (!oldEmailInput) {
      return "Current email required";
    }
    if (!isValidEmail(oldEmailInput)) {
      return "Must be valid email";
    }
  };

  return (
    <Box>
      <IconButton
        colorScheme="orange"
        icon={<EditIcon />}
        aria-label="change-email"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="orange" textColor="white">
          <ModalHeader>Change Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleFormSubmit}
              id="change-email-form"
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <FormControl
                isInvalid={!oldEmailInput || !isValidEmail(oldEmailInput)}
              >
                <Input
                  value={oldEmailInput}
                  onChange={(e) => setOldEmailInput(e.target.value)}
                  placeholder="Enter current email"
                  bgColor={Color.WHITE}
                  color={Color.BLACK}
                />
                <FormErrorMessage>{oldEmailErrorMessage()}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={!newEmailInput || !isValidEmail(newEmailInput)}
              >
                <Input
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  placeholder="Enter new email"
                  bgColor={Color.WHITE}
                  color={Color.BLACK}
                />
                <FormErrorMessage>New email required</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={
                  !newEmailReentryInput ||
                  newEmailInput !== newEmailReentryInput
                }
              >
                <Input
                  value={newEmailReentryInput}
                  onChange={(e) => setNewEmailReentryInput(e.target.value)}
                  placeholder="Re-enter new email"
                  bgColor={Color.WHITE}
                  color={Color.BLACK}
                />
                <FormErrorMessage>New email re-entry required</FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter display="flex" gap={2}>
            <Button
              colorScheme="blue"
              type="submit"
              form="change-email-form"
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
