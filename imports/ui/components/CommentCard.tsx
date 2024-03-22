import React from "react";
import {
  Card,
  CardHeader,
  Avatar,
  ModalCloseButton,
  CardBody,
  CardFooter,
  Text,
} from "@chakra-ui/react";
import { Color } from "/imports/constants";

export const CommentCard = () => {
  return (
    <Card colorScheme="orange" bgColor={Color.DARK_ORANGE} color={Color.WHITE}>
      <CardHeader
        fontWeight="bold"
        display="flex"
        alignItems="center"
        gap={2}
        fontSize="x-large"
        paddingBottom={1}
        paddingTop={2}
        _hover={{ cursor: "pointer" }}
      >
        <Avatar bgColor="orange.500" />
        Hello
      </CardHeader>
      <ModalCloseButton />
      <CardBody paddingTop={0} paddingBottom={0} fontSize="large">
        This is my comment.
      </CardBody>
      <CardFooter display="flex" justifyContent="end" paddingBottom={2}>
        <Text>{`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}</Text>
      </CardFooter>
    </Card>
  );
};
