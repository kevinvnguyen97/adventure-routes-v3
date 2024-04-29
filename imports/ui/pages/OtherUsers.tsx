import React, { useEffect } from "react";
import { SimpleGrid } from "@chakra-ui/react";
import { useAllUsers } from "/imports/ui/providers";
import { LoadingScreen, UserCard } from "/imports/ui/components";

export const OtherUsers = () => {
  const { data: users, isLoading: areUsersLoading } = useAllUsers();

  useEffect(() => {
    document.title = "Other Users - Adventure Routes";
  }, []);
  if (areUsersLoading) {
    return <LoadingScreen />;
  }
  return (
    <SimpleGrid gap={3} minChildWidth={275} columnGap={3} alignContent="center">
      {users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </SimpleGrid>
  );
};
