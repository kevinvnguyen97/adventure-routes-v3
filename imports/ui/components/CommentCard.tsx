import React from "react";
import { Meteor } from "meteor/meteor";
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
import { Comment } from "/imports/api/adventureRoutes";
import { useUserInfo } from "/imports/ui/providers";
import { DateTime } from "luxon";

type CommentCardProps = {
  comment: Comment;
  deleteComment: () => void;
};
export const CommentCard = (props: CommentCardProps) => {
  const { comment, deleteComment } = props;
  const { commentText, date, userId: commentUserId } = comment;

  const userId = Meteor.userId();

  const { data: user } = useUserInfo(commentUserId);
  const { username, profile } = user;
  const { profilePictureUrl } = profile || {};

  const formattedDate = DateTime.fromJSDate(date).toFormat(
    "LLLL d, yyyy h:mm:ss a"
  );

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
        <Avatar bgColor="orange.500" src={profilePictureUrl} />
        {username}
      </CardHeader>
      {userId === commentUserId && (
        <ModalCloseButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteComment();
          }}
        />
      )}
      <CardBody paddingTop={0} paddingBottom={0} fontSize="large">
        {commentText}
      </CardBody>
      <CardFooter display="flex" justifyContent="end" paddingBottom={2}>
        <Text>{formattedDate}</Text>
      </CardFooter>
    </Card>
  );
};
