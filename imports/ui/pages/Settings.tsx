import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  FormLabel,
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
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { parsePhoneNumber } from "libphonenumber-js";

import {
  ChangeEmailModal,
  ChangeFullNameModal,
  ChangePasswordModal,
  ChangePhoneModal,
  ChangeUsernameModal,
} from "/imports/ui/components/modals";
import { useMeteorAuth } from "/imports/ui/providers";
import { meteorMethodPromise } from "/imports/utils";
import { uploadToImgBB } from "/imports/api/imgbb";
import { Color } from "/imports/constants";

export const Settings = () => {
  const toast = useToast();
  const { user, userId } = useMeteorAuth();

  const { username = "", emails = [], profile } = user || {};
  const { firstName, lastName, phoneNumber, profilePictureUrl } = profile || {};

  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const [newFirstNameInput, setNewFirstNameInput] = useState("");
  const [newLastNameInput, setNewLastNameInput] = useState("");

  const [newPhoneNumberInput, setNewPhoneNumberInput] = useState("");

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

  const changePhoneNumber = async () => {
    try {
      await meteorMethodPromise("changePhoneNumber", newPhoneNumberInput);
      toast({
        title: "Success",
        description: `Phone number updated successfully to ${parsePhoneNumber(
          newPhoneNumberInput
        ).formatNational()}`,
        status: "success",
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
        if (response.data) {
          await meteorMethodPromise("changeProfilePicture", response.data?.url);
          toast({
            title: "Success",
            description: "Profile picture successfully updated",
            status: "success",
          });
        }
      } catch (error) {
        const meteorError = error as Meteor.Error;
        console.error(meteorError);
        toast({
          title: meteorError.name,
          description: meteorError.message,
          status: "error",
        });
      }
    }
  };

  const changeUsername = async () => {
    try {
      await meteorMethodPromise("changeUsername", newUsernameInput);
      toast({
        title: "Success",
        description: `Username successfully changed to ${newUsernameInput}`,
        status: "success",
      });
    } catch (error) {
      if (error) {
        const meteorError = error as Meteor.Error;
        console.error(meteorError);
        toast({
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
      toast({
        title: "Success",
        description: `Successfully changed email to ${newEmailInput}`,
        status: "success",
      });
    } catch (error) {
      if (error) {
        const meteorError = error as Meteor.Error;
        console.error(meteorError);
        toast({
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
            title: error.name,
            description: error.message,
            status: "error",
          });
        } else {
          toast({
            title: "Success",
            description: "Password successfully changed",
            status: "success",
          });
        }
      }
    );
  };

  useEffect(() => {
    document.title = "Settings - Adventure Routes";
  }, []);
  useEffect(() => {
    if (user) {
      setNewFirstNameInput(firstName ?? "");
      setNewLastNameInput(lastName ?? "");
      setNewUsernameInput(username);
    }
  }, [user]);

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
      <Text color={Color.WHITE} fontWeight="bold" fontSize={40}>
        Settings
      </Text>
      <Avatar
        bgColor="orange.500"
        alignSelf="center"
        size="xl"
        name={fullName}
        color={Color.WHITE}
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
          backgroundColor={Color.WHITE}
          borderRadius={5}
          bgColor="darkorange"
          textColor={Color.WHITE}
        >
          <Tbody>
            <Tr>
              <Th textColor={Color.WHITE}>Name</Th>
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
              <Th textColor={Color.WHITE}>Username</Th>
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
              <Th textColor={Color.WHITE}>Email</Th>
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
              <Th textColor={Color.WHITE}>Phone</Th>
              <Td display="flex" justifyContent="space-between">
                <Text>{phoneNumber}</Text>
                <ChangePhoneModal
                  newPhoneNumber={newPhoneNumberInput}
                  setNewPhoneNumber={setNewPhoneNumberInput}
                  applyPhoneNumberChange={changePhoneNumber}
                />
              </Td>
            </Tr>
            <Tr>
              <Th textColor={Color.WHITE} borderBottom={0}>
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
  );
};
