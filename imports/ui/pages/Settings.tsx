import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  FormLabel,
  IconButton,
  Input,
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
  ChangeEmailModal,
  ChangeFullNameModal,
  ChangePasswordModal,
  ChangeUsernameModal,
} from "/imports/ui/components/modals";
import { useMeteorAuth } from "/imports/ui/providers";
import { meteorMethodPromise } from "/imports/utils";
import { TOAST_PRESET } from "/imports/constants/toast";
import { uploadToImgBB } from "/imports/api/imgbb";

export const Settings = () => {
  const toast = useToast();
  const { user, userId, loggedIn } = useMeteorAuth();

  const { username = "", emails = [], profile } = user || {};
  const { firstName, lastName, phoneNumber, profilePictureUrl } = profile || {};

  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const [newFirstNameInput, setNewFirstNameInput] = useState("");
  const [newLastNameInput, setNewLastNameInput] = useState("");

  const [oldEmailInput, setOldEmailInput] = useState("");
  const [newEmailInput, setNewEmailInput] = useState("");
  const [newEmailReentryInput, setNewEmailReentryInput] = useState("");

  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [newPasswordReentryInput, setNewPasswordReentryInput] = useState("");

  const [newUsernameInput, setNewUsernameInput] = useState("");

  const changeFullName = async () => {
    try {
      await meteorMethodPromise("changeFullName", {
        firstName: newFirstNameInput,
        lastName: newLastNameInput,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const uploadProfilePicture = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];

      try {
        const response = await uploadToImgBB(file, userId ?? "");
        if (response.data && response.status === 200) {
          await meteorMethodPromise("changeProfilePicture", response.data?.url);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const changeUsername = async () => {
    try {
      await meteorMethodPromise("changeUsername", newUsernameInput);
      toast({
        ...TOAST_PRESET,
        title: "Success",
        description: `Username successfully changed to ${newUsernameInput}`,
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

  const changeEmail = async () => {
    try {
      await meteorMethodPromise("changeEmail", newEmailInput);
    } catch (error) {
      console.error(error);
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

  useEffect(() => {
    if (loggedIn) {
      setNewFirstNameInput(firstName ?? "");
      setNewLastNameInput(lastName ?? "");
    }
  }, [loggedIn]);

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
        <Avatar
          bgColor="orange.500"
          alignSelf="center"
          size="xl"
          name={fullName}
          color="white"
          as={FormLabel}
          _hover={{ cursor: "pointer" }}
          htmlFor="profile-picture-upload"
          src={profilePictureUrl}
        />
        <Input
          type="file"
          display="none"
          id="profile-picture-upload"
          accept="image/*"
          onChange={uploadProfilePicture}
          name="profile-picture"
        />
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
                <Td display="flex" justifyContent="space-between">
                  <Text>{fullName}</Text>
                  <ChangeFullNameModal
                    newFirstNameInput={newFirstNameInput}
                    setNewFirstNameInput={setNewFirstNameInput}
                    newLastNameInput={newLastNameInput}
                    setNewLastNameInput={setNewLastNameInput}
                    changeFullName={changeFullName}
                  />
                </Td>
              </Tr>
              <Tr>
                <Th textColor="white">Username</Th>
                <Td display="flex" justifyContent="space-between">
                  <Text>{username}</Text>
                  <ChangeUsernameModal
                    oldUsername={username}
                    newUsername={newUsernameInput}
                    setNewUsername={setNewUsernameInput}
                    applyUsernameChange={changeUsername}
                  />
                </Td>
              </Tr>
              <Tr>
                <Th textColor="white">Email</Th>
                <Td display="flex" justifyContent="space-between">
                  <Box>
                    {emails.map(({ address }) => (
                      <Tr key={address}>{address}</Tr>
                    ))}
                  </Box>
                  <ChangeEmailModal
                    currentEmail={emails[0]?.address}
                    oldEmailInput={oldEmailInput}
                    setOldEmailInput={setOldEmailInput}
                    newEmailInput={newEmailInput}
                    setNewEmailInput={setNewEmailInput}
                    changeEmail={changeEmail}
                    newEmailReentryInput={newEmailReentryInput}
                    setNewEmailReentryInput={setNewEmailReentryInput}
                  />
                </Td>
              </Tr>
              <Tr>
                <Th textColor="white">Phone</Th>
                <Td display="flex" justifyContent="space-between">
                  <Text>{phoneNumber}</Text>
                  <IconButton
                    colorScheme="orange"
                    icon={<EditIcon />}
                    aria-label="phone-edit"
                    isDisabled={true}
                  />
                </Td>
              </Tr>
              <Tr>
                <Th textColor="white" borderBottom={0}>
                  Password
                </Th>
                <Td display="flex" justifyContent="end" borderBottom={0}>
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
