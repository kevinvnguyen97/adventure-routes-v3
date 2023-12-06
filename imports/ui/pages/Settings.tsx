import React, { useState } from "react";
import {
  Box,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useMeteorAuth } from "/imports/ui/providers/Auth";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

import { ChangePasswordModal } from "/imports/ui/components/ChangePasswordModal";
import { ChangeUsernameModal } from "/imports/ui/components/ChangeUsernameModal";

export const Settings = () => {
  const toast = useToast();
  const { user } = useMeteorAuth();

  const { username, emails = [], profile } = user || {};
  const { firstName, lastName, phoneNumber } = profile || {};

  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [newPasswordReentryInput, setNewPasswordReentryInput] = useState("");

  const [newUsernameInput, setNewUsernameInput] = useState("");

  const userId = Meteor.userId() ?? "";

  const changeUsername = () => {
    Accounts.setUsername(userId, newUsernameInput);
  };

  const changePassword = () => {
    Accounts.changePassword(
      oldPasswordInput,
      newPasswordInput,
      (error: Error | Meteor.Error | Meteor.TypedError | undefined) => {
        if (error) {
          console.error(error);
          toast({
            title: error.name,
            description: error.message,
            status: "error",
            position: "top",
          });
        } else {
          toast({
            title: "Success",
            description: "Password successfully changed",
            status: "success",
            position: "top",
          });
        }
      }
    );
  };

  return (
    <Box
      margin="auto"
      width="auto"
      padding={5}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      textAlign="center"
      gap={2}
    >
      <Text color="white" fontWeight="bold" fontSize={40}>
        Settings
      </Text>
      <TableContainer>
        <Table
          size="md"
          variant="simple"
          backgroundColor="white"
          borderRadius={5}
          bgColor="darkorange"
          textColor="white"
        >
          <Tbody>
            <Tr>
              <Th textColor="white">Name</Th>
              <Td>{[firstName, lastName].filter(Boolean).join(" ")}</Td>
            </Tr>
            <Tr>
              <Th textColor="white">Username</Th>
              <Td display="flex" justifyContent="space-between">
                <Text>{username}</Text>
                <ChangeUsernameModal
                  newUsername={newUsernameInput}
                  setNewUsername={setNewUsernameInput}
                  applyUsernameChange={changeUsername}
                />
              </Td>
            </Tr>
            <Tr>
              <Th textColor="white">Email(s)</Th>
              <Td display="flex" justifyContent="space-between">
                <Box>
                  {emails.map(({ address }) => (
                    <Tr key={address}>{address}</Tr>
                  ))}
                </Box>
                <IconButton
                  colorScheme="orange"
                  icon={<EditIcon />}
                  aria-label="phone-edit"
                />
              </Td>
            </Tr>
            <Tr>
              <Th>Phone</Th>
              <Td display="flex" justifyContent="space-between">
                <Text>{phoneNumber}</Text>
                <IconButton
                  colorScheme="orange"
                  icon={<EditIcon />}
                  aria-label="phone-edit"
                />
              </Td>
            </Tr>
            <Tr>
              <Th>Password</Th>
              <Td display="flex" justifyContent="end">
                <ChangePasswordModal
                  oldPassword={oldPasswordInput}
                  setOldPassword={setOldPasswordInput}
                  newPassword={newPasswordInput}
                  setNewPassword={setNewPasswordInput}
                  newPasswordReentry={newPasswordReentryInput}
                  setNewPasswordReentry={setNewPasswordReentryInput}
                  changePassword={changePassword}
                />
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
