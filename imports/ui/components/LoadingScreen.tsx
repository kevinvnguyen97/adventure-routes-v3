import React from "react";
import { Box, Spinner } from "@chakra-ui/react";
import { Color } from "/imports/constants";

export const LoadingScreen = () => {
  return (
    <Box minWidth="1000px" height="calc(100vh - 84px)" justifyContent="center">
      <Spinner color={Color.WHITE} margin="auto" size="xl" />
    </Box>
  );
};
