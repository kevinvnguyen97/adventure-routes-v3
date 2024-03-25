import React from "react";
import { Box, Spinner } from "@chakra-ui/react";
import { Color } from "/imports/constants";

type LoadingScreenProps = {
  spinnerColor?: string;
};
export const LoadingScreen = (props: LoadingScreenProps) => {
  const { spinnerColor = Color.WHITE } = props;
  return (
    <Box minWidth="1000px" height="calc(100vh - 84px)" justifyContent="center">
      <Spinner
        color={spinnerColor}
        margin="auto"
        position="fixed"
        top={0}
        bottom={0}
        left={0}
        right={0}
        size="xl"
      />
    </Box>
  );
};
