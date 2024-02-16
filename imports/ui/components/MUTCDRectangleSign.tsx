import React, { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import { Color, MUTCDFont } from "/imports/constants";

type MUTCDRectangleProps = {
  fontFamily?: string;
  children: ReactNode;
};
export const MUTCDRectangleSign = (props: MUTCDRectangleProps) => {
  const { children, fontFamily = MUTCDFont.HWYGOTHIC } = props;
  return (
    <Box
      backgroundColor={Color.MUTCD_GREEN}
      color={Color.WHITE}
      letterSpacing={2}
      padding={0.5}
      borderRadius={10}
    >
      <Box
        fontFamily={fontFamily}
        fontWeight={500}
        padding={2}
        borderWidth={2}
        borderRadius={10}
        borderColor={Color.WHITE}
      >
        {children}
      </Box>
    </Box>
  );
};
