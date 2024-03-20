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
import { isValidPhoneNumber } from "libphonenumber-js";
import { Color } from "/imports/constants";

type ChangePhoneModalProps = {
  newPhoneNumber: string;
  setNewPhoneNumber: (newPhoneNumber: string) => void;
  applyPhoneNumberChange: () => void;
};
export const ChangePhoneModal = (props: ChangePhoneModalProps) => {
  const { newPhoneNumber, setNewPhoneNumber, applyPhoneNumberChange } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isFormValid = [
    !!newPhoneNumber,
    isValidPhoneNumber(newPhoneNumber, "US"),
  ].every((criteria) => !!criteria);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      applyPhoneNumberChange();
      setNewPhoneNumber("");
      onClose();
    }
  };

  return (
    <Box>
      <IconButton
        colorScheme="orange"
        icon={<EditIcon />}
        aria-label="phone-edit"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor={Color.ORANGE} textColor={Color.WHITE}>
          <ModalHeader>Change Phone Number</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleFormSubmit}
              id="change-phone-form"
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <FormControl
                isRequired
                isInvalid={
                  !newPhoneNumber || !isValidPhoneNumber(newPhoneNumber, "US")
                }
              >
                <Input
                  placeholder="New Phone Number"
                  type="tel"
                  inputMode="tel"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  backgroundColor={Color.WHITE}
                  textColor={Color.BLACK}
                  focusBorderColor="orange.400"
                  errorBorderColor="red.500"
                  required
                />
                <FormErrorMessage>
                  {!newPhoneNumber
                    ? "Phone number required"
                    : "Phone number must be valid"}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter display="flex" gap={2}>
            <Button
              colorScheme="orange"
              type="submit"
              form="change-phone-form"
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
