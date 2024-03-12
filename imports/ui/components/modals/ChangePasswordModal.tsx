import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
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

import { Color, MINIMUM_PASSWORD_LENGTH } from "/imports/constants";

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
    oldPassword.length >= MINIMUM_PASSWORD_LENGTH,
    !!newPassword,
    newPassword.length >= MINIMUM_PASSWORD_LENGTH,
    !!newPasswordReentry,
    newPassword === newPasswordReentry,
    oldPassword !== newPassword,
  ].every((criteria) => !!criteria);

  const newPasswordMessage = () => {
    if (!newPassword) {
      return "New password required";
    } else if (newPassword.length < MINIMUM_PASSWORD_LENGTH) {
      return `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters long`;
    } else if (oldPassword === newPassword) {
      return "New password cannot be the current password";
    }
  };

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
        <ModalContent backgroundColor={Color.ORANGE} textColor={Color.WHITE}>
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
                  backgroundColor={Color.WHITE}
                  textColor={Color.BLACK}
                  focusBorderColor="orange.400"
                  errorBorderColor="red.500"
                  required
                />
                <FormErrorMessage>Old password required</FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={
                  !newPassword ||
                  oldPassword === newPassword ||
                  newPassword.length < MINIMUM_PASSWORD_LENGTH
                }
              >
                <Input
                  placeholder="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  backgroundColor={Color.WHITE}
                  textColor={Color.BLACK}
                  focusBorderColor="orange.400"
                  errorBorderColor="red.500"
                  required
                />
                <FormErrorMessage>{newPasswordMessage()}</FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={
                  !newPasswordReentry || newPassword !== newPasswordReentry
                }
              >
                <Input
                  placeholder="Re-enter New Password"
                  type="password"
                  value={newPasswordReentry}
                  onChange={(e) => setNewPasswordReentry(e.target.value)}
                  backgroundColor={Color.WHITE}
                  textColor={Color.BLACK}
                  focusBorderColor="orange.400"
                  errorBorderColor="red.500"
                  required
                />
                <FormErrorMessage>
                  {!newPasswordReentry
                    ? "Password re-entry required"
                    : "Password re-entry must match new password"}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter display="flex" gap={2}>
            <Button
              colorScheme="blue"
              type="submit"
              form="change-password-form"
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
