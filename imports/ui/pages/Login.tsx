import React, { FormEvent, useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import {
  Box,
  Input,
  Image,
  Button,
  Link,
  useToast,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Link as NavigationLink } from "react-router-dom";

import { TOAST_PRESET } from "/imports/constants/toast";
import { Color } from "/imports/constants";

export const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = [usernameOrEmail, password].every(
    (criteria) => !!criteria
  );

  const toast = useToast();

  useEffect(() => {
    document.title = "Login - Adventure Routes";
  }, []);

  const submitLogin = (e: FormEvent) => {
    e.preventDefault();
    Meteor.loginWithPassword(
      usernameOrEmail,
      password,
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
          const { username = "" } = Meteor.user() || {};
          toast({
            ...TOAST_PRESET,
            title: "Success",
            description: `Logged in as ${username}`,
            status: "success",
          });
        }
      }
    );
  };

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
        onSubmit={submitLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
        }}
      >
        <FormControl isInvalid={!usernameOrEmail}>
          <Input
            placeholder="Username or Email"
            backgroundColor={Color.WHITE}
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <FormErrorMessage>Username or email required</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!password}>
          <Input
            placeholder="Password"
            type="password"
            backgroundColor={Color.WHITE}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormErrorMessage>Password required</FormErrorMessage>
        </FormControl>
        <Button type="submit" colorScheme="orange" isDisabled={!isFormValid}>
          Login
        </Button>
      </form>
      <Link as={NavigationLink} to="/register" color="red">
        Don't have an account? Register here
      </Link>
    </Box>
  );
};
