import React, { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import { Color, MUTCDFont } from "/imports/constants";
import { getTextColorBasedOnBackground } from "/imports/utils";

type MUTCDRectangleProps = {
  fontFamily?: string;
  children: ReactNode;
  signColor?: string;
};
export const MUTCDRectangleSign = (props: MUTCDRectangleProps) => {
  const {
    children,
    fontFamily = MUTCDFont.HWYGOTHIC,
    signColor = Color.MUTCD_GREEN,
  } = props;

  const textColor = getTextColorBasedOnBackground(signColor);

  return (
    <Box
      backgroundColor={signColor}
      color={textColor}
      letterSpacing={fontFamily === MUTCDFont.CLEARVIEW ? 1.5 : 2}
      padding={0.5}
      borderRadius={10}
      userSelect="none"
    >
      <Box
        fontFamily={fontFamily}
        fontWeight={500}
        padding={2}
        borderWidth={2}
        borderRadius={10}
        borderColor={textColor}
      >
        {children}
      </Box>
    </Box>
  );
};
