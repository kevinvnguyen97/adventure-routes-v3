import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useAllUsers } from "/imports/ui/providers";
import { LoadingScreen, UserCard } from "/imports/ui/components";
import { motion } from "framer-motion";

export const OtherUsers = () => {
  const { data: users, isLoading: areUsersLoading } = useAllUsers();

  useEffect(() => {
    document.title = "Other Users - Adventure Routes";
  }, []);
  if (areUsersLoading) {
    return <LoadingScreen />;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box margin="auto" display="flex" gap={3}>
        {users.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </Box>
    </motion.div>
  );
};
