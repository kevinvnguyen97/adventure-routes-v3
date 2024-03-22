import React from "react";
import { InputGroup, Textarea, Button, Box } from "@chakra-ui/react";
import { CommentCard } from "/imports/ui/components";
import { Color } from "/imports/constants";

export const CommentsSection = () => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <InputGroup>
        <Textarea
          bgColor={Color.WHITE}
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
        >
          Post
        </Button>
      </InputGroup>
      <CommentCard />
      <CommentCard />
    </Box>
  );
};
