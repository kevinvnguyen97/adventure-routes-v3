import React, { FormEvent, useEffect, useState } from "react";
import {
  Box,
  Input,
  Image,
  Button,
  InputGroup,
  Link,
  VStack,
  useToast,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Link as NavigationLink } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

import {
  Color,
  MINIMUM_PASSWORD_LENGTH,
  MINIMUM_USERNAME_LENGTH,
} from "/imports/constants";
import { isValidEmail } from "/imports/utils";

export const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordReentry, setPasswordReentry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const isFormValid = [
    firstName,
    lastName,
    username,
    username.length >= MINIMUM_USERNAME_LENGTH,
    email,
    isValidEmail(email),
    password,
    password.length >= MINIMUM_PASSWORD_LENGTH,
    passwordReentry,
    password === passwordReentry,
    phoneNumber,
    isValidPhoneNumber(phoneNumber, "US"),
  ].every((criteria) => !!criteria);

  const toast = useToast();

  const submitRegister = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isFormValid) {
      toast({
        title: "Form not valid",
        description: "All fields need to be filled in correctly",
        status: "error",
      });
      return;
    }

    Accounts.createUser(
      {
        username,
        password,
        email,
        profile: {
          firstName,
          lastName,
          phoneNumber: parsePhoneNumber(phoneNumber, "US").formatNational(),
        },
      },
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
            description: `${username} registered`,
            status: "success",
          });
        }
      }
    );
  };

  useEffect(() => {
    document.title = "Register - Adventure Routes";
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={5}
      width="100%"
      maxWidth={400}
      paddingTop={5}
      margin="auto"
      alignItems="center"
    >
      <Image src="/large_logo.png" width="100%" height="auto" />
      <form
        onSubmit={submitRegister}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
        }}
      >
        <VStack>
          <InputGroup gap={2}>
            <FormControl isInvalid={!firstName}>
              <Input
                placeholder="First Name"
                backgroundColor={Color.WHITE}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value.trim())}
              />
              <FormErrorMessage>First name required</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!lastName}>
              <Input
                placeholder="Last Name"
                backgroundColor={Color.WHITE}
                value={lastName}
                onChange={(e) => setLastName(e.target.value.trim())}
              />
              <FormErrorMessage>Last name required</FormErrorMessage>
            </FormControl>
          </InputGroup>
          <FormControl
            isInvalid={!username || username.length < MINIMUM_USERNAME_LENGTH}
          >
            <Input
              placeholder="Username"
              backgroundColor={Color.WHITE}
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
            />
            <FormErrorMessage>
              {!username
                ? "Username required"
                : `Username needs to be at least ${MINIMUM_USERNAME_LENGTH} characters long`}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={!phoneNumber || !isValidPhoneNumber(phoneNumber, "US")}
          >
            <Input
              placeholder="Phone Number"
              type="tel"
              inputMode="tel"
              backgroundColor={Color.WHITE}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.trim())}
            />
            <FormErrorMessage>
              {!phoneNumber ? "Phone number required" : "Invalid phone number"}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!email || !isValidEmail(email)}>
            <Input
              placeholder="Email"
              type="email"
              inputMode="email"
              backgroundColor={Color.WHITE}
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
            <FormErrorMessage>
              {!email ? "Email required" : "Invalid email"}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={!password || password.length < MINIMUM_PASSWORD_LENGTH}
          >
            <Input
              placeholder="Password"
              type="password"
              backgroundColor={Color.WHITE}
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
            />
            <FormErrorMessage>
              {!password
                ? "Password required"
                : `Password needs to be at least ${MINIMUM_PASSWORD_LENGTH} characters long`}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={!passwordReentry || password !== passwordReentry}
          >
            <Input
              placeholder="Re-enter Password"
              type="Password"
              backgroundColor={Color.WHITE}
              value={passwordReentry}
              onChange={(e) => setPasswordReentry(e.target.value.trim())}
            />
            <FormErrorMessage>
              {!passwordReentry
                ? "Password re-entry required"
                : "Passwords do not match"}
            </FormErrorMessage>
          </FormControl>
          <Button type="submit" colorScheme="orange" isDisabled={!isFormValid}>
            Register
          </Button>
        </VStack>
      </form>
      <Link as={NavigationLink} to="/login" color="red">
        Already have an account? Login here
      </Link>
    </Box>
  );
};
