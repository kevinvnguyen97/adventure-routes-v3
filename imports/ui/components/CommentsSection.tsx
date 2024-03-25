import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import {
  InputGroup,
  Textarea,
  Button,
  Box,
  useToast,
  Text,
} from "@chakra-ui/react";
import { CommentCard, LoadingScreen } from "/imports/ui/components";
import { Color } from "/imports/constants";
import { useCommentsForAdventureRoute } from "/imports/ui/providers";
import { meteorMethodPromise } from "/imports/utils";
import { TOAST_PRESET } from "/imports/constants/toast";

type CommentsSectionProps = {
  adventureRouteId: string;
};
export const CommentsSection = (props: CommentsSectionProps) => {
  const userId = Meteor.userId() ?? "";
  const { adventureRouteId } = props;
  const { data: comments, isLoading: isCommentsLoading } =
    useCommentsForAdventureRoute(adventureRouteId);
  const toast = useToast();

  const [newComment, setNewComment] = useState("");

  const createComment = async () => {
    try {
      await meteorMethodPromise("upsertComment", {
        userId,
        adventureRouteId,
        commentText: newComment,
        date: new Date(),
      });
      toast({
        ...TOAST_PRESET,
        title: "Success",
        description: "Comment posted successfully",
        status: "success",
      });
      setNewComment("");
    } catch (error) {
      const meteorError = error as Meteor.Error;
      console.error(error);
      toast({
        ...TOAST_PRESET,
        title: "Error",
        description: meteorError.message,
        status: "error",
      });
    }
  };
  const deleteComment = async (commentId: string) => {
    await meteorMethodPromise("deleteComment", commentId);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <InputGroup>
        <Textarea
          bgColor={Color.WHITE}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Enter comment"
          focusBorderColor="orange.400"
        />
        <Button
          size="sm"
          colorScheme="orange"
          position="absolute"
          bottom={2}
          right={2}
          zIndex={1}
          onClick={createComment}
        >
          Post
        </Button>
      </InputGroup>
      {isCommentsLoading ? (
        <LoadingScreen />
      ) : comments.length > 0 ? (
        <>
          {comments.map((comment) => (
            <CommentCard
              key={`${comment.userId}${comment.date}`}
              comment={comment}
              deleteComment={() => deleteComment(comment._id ?? "")}
            />
          ))}
        </>
      ) : (
        <Text color={Color.WHITE} textAlign="center">
          No comments
        </Text>
      )}
    </Box>
  );
};
