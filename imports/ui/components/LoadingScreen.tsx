import React from "react";
import { Spinner } from "@chakra-ui/react";

export const LoadingScreen = () => {
  return (
    <Spinner
      position="absolute"
      color="white"
      top={0}
      bottom={0}
      left={0}
      right={0}
      margin="auto"
    />
  );
};
