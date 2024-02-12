import React, { useEffect } from "react";
import { Box, Text, SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";

import {
  useAdventureRoutesForUser,
  useMeteorAuth,
} from "/imports/ui/providers";
import {
  AdventureRouteCard,
  LoadingScreen,
  MapFormModal,
} from "/imports/ui/components";

export const Dashboard = () => {
  const { data: adventureRoutesForUser, isLoading } =
    useAdventureRoutesForUser();
  const { user } = useMeteorAuth();
  const { username } = user || {};

  useEffect(() => {
    document.title = "Dashboard - Adventure Routes";
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box
        margin="auto"
        paddingTop={5}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        textAlign="center"
        gap={2}
      >
        <Text color="white" fontWeight="bold" fontSize={40}>
          {username}'s Routes
        </Text>
        <MapFormModal />
        <SimpleGrid columnGap={3} rowGap={3} minChildWidth={350}>
          {adventureRoutesForUser.map((adventureRoute) => (
            <AdventureRouteCard
              adventureRoute={adventureRoute}
              key={adventureRoute._id}
            />
          ))}
        </SimpleGrid>
      </Box>
    </motion.div>
  );
};
