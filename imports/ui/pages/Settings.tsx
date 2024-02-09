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
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { motion } from "framer-motion";

import {
  ChangePasswordModal,
  ChangeUsernameModal,
} from "/imports/ui/components";
import { useMeteorAuth } from "/imports/ui/providers";
import { meteorMethodPromise } from "/imports/utils";
import { TOAST_PRESET } from "/imports/constants/toast";

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

  const changeUsername = async () => {
    try {
      await meteorMethodPromise("changeUsername", newUsernameInput);
      toast({
        ...TOAST_PRESET,
        title: "Success",
        description: `Username changed successfully to ${newUsernameInput}`,
        status: "success",
      });
    } catch (error) {
      if (error) {
        const meteorError = error as Meteor.Error;
        console.error(meteorError);
        toast({
          ...TOAST_PRESET,
          title: meteorError.name,
          description: meteorError.message,
          status: "error",
        });
      }
    }
  };

  const changePassword = () => {
    Accounts.changePassword(
      oldPasswordInput,
      newPasswordInput,
      (error: Error | Meteor.Error | Meteor.TypedError | undefined) => {
        if (error) {
          console.error(error);
          toast({
            ...TOAST_PRESET,
            title: error.name,
            description: error.message,
            status: "error",
          });
        } else {
          toast({
            ...TOAST_PRESET,
            title: "Success",
            description: "Password successfully changed",
            status: "success",
          });
        }
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
    </motion.div>
  );
};
