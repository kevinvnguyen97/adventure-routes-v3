import React, { FormEvent, useState } from "react";
import { Box, Input, Image, Button, Link, useToast } from "@chakra-ui/react";
import { Link as NavigationLink } from "react-router-dom";
import { Meteor } from "meteor/meteor";

export const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();

  const submitLogin = (e: FormEvent) => {
    e.preventDefault();
    Meteor.loginWithPassword(
      usernameOrEmail,
      password,
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
          const { username = "" } = Meteor.user() || {};
          toast({
            title: "Success",
            description: `Successfully logged in as ${username}`,
            status: "success",
            position: "top",
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
      width={400}
      paddingTop={5}
      margin="auto"
      alignItems="center"
    >
      <Image src="/large_logo.png" width={500} height="auto" />
      <form
        onSubmit={submitLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
        }}
      >
        <Input
          placeholder="Username or Email"
          backgroundColor="white"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          backgroundColor="white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" colorScheme="orange">
          Login
        </Button>
      </form>
      <Link as={NavigationLink} to="/register">
        Register Here
      </Link>
    </Box>
  );
};
