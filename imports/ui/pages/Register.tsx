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
} from "@chakra-ui/react";
import { Link as NavigationLink } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { TOAST_PRESET } from "/imports/constants/toast";

export const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const toast = useToast();

  const submitRegister = async (e: FormEvent) => {
    e.preventDefault();

    await Accounts.createUserAsync(
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
            ...TOAST_PRESET,
            title: error.name,
            description: error.message,
            status: "error",
          });
        } else {
          toast({
            ...TOAST_PRESET,
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
      width={400}
      paddingTop={5}
      margin="auto"
      alignItems="center"
    >
      <Image src="/large_logo.png" width={500} height="auto" />
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
            <Input
              placeholder="First Name"
              backgroundColor="white"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              backgroundColor="white"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </InputGroup>
          <Input
            placeholder="Username"
            backgroundColor="white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Phone Number"
            type="tel"
            backgroundColor="white"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            backgroundColor="white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            backgroundColor="white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="Re-enter Password"
            type="Password"
            backgroundColor="white"
          />
          <Button type="submit" colorScheme="orange">
            Register
          </Button>
        </VStack>
      </form>
      <Link as={NavigationLink} to="/login">
        Login Here
      </Link>
    </Box>
  );
};
