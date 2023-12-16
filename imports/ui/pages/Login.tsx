import React, { FormEvent, useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { Box, Input, Image, Button, Link, useToast } from "@chakra-ui/react";
import { Link as NavigationLink } from "react-router-dom";
import { motion } from "framer-motion";

import { TOAST_PRESET } from "/imports/constants/toast";

export const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
    </motion.div>
  );
};
