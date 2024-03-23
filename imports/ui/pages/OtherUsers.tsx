import React from "react";
import { Box } from "@chakra-ui/react";
import { useAllUsers } from "/imports/ui/providers";
import { LoadingScreen, UserCard } from "/imports/ui/components";

export const OtherUsers = () => {
  const { data: users, isLoading: areUsersLoading } = useAllUsers();
  if (areUsersLoading) {
    return <LoadingScreen />;
  }
  return (
    <Box margin="auto" display="flex" gap={3}>
      {users.map((user) => (
        <UserCard user={user} />
      ))}
    </Box>
  );
};
