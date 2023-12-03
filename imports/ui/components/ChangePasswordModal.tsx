import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
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

type ChangePasswordModalProps = {
  oldPassword: string;
  setOldPassword: (oldPassword: string) => void;
  newPassword: string;
  setNewPassword: (newPassword: string) => void;
  newPasswordReentry: string;
  setNewPasswordReentry: (newPasswordReentry: string) => void;
  changePassword: () => void;
};
export const ChangePasswordModal = (props: ChangePasswordModalProps) => {
  const {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    newPasswordReentry,
    setNewPasswordReentry,
    changePassword,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isFormValid = [
    !!oldPassword,
    oldPassword.length > 8,
    !!newPassword,
    newPassword.length > 8,
    newPassword === newPasswordReentry,
  ].every((criteria) => !!criteria);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      changePassword();
      setOldPassword("");
      setNewPassword("");
      onClose();
    }
  };

  return (
    <Box>
      <Button colorScheme="orange" leftIcon={<EditIcon />} onClick={onOpen}>
        Change Password
      </Button>
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
              <FormControl isRequired isInvalid={!oldPassword}>
                <Input
                  placeholder="Old Password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  backgroundColor="white"
                  textColor="black"
                  focusBorderColor="orange.400"
                  errorBorderColor="red.500"
                  required
                />
              </FormControl>
              <FormControl isRequired isInvalid={!newPassword}>
                <Input
                  placeholder="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  backgroundColor="white"
                  textColor="black"
                  focusBorderColor="orange.400"
                  errorBorderColor="red.500"
                  required
                />
              </FormControl>
              <FormControl isRequired isInvalid={!newPasswordReentry}>
                <Input
                  placeholder="Re-enter New Password"
                  type="password"
                  value={newPasswordReentry}
                  onChange={(e) => setNewPasswordReentry(e.target.value)}
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
