import React, { useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

import {
  useAdventureRoutesForUser,
  useMeteorAuth,
} from "/imports/ui/providers";
import { AdventureRouteCard, MapFormModal } from "/imports/ui/components";

export const Dashboard = () => {
  const { data: adventureRoutesForUser } = useAdventureRoutesForUser();
  const { user } = useMeteorAuth();
  const { username } = user || {};

  useEffect(() => {
    document.title = "Dashboard - Adventure Routes";
  }, []);

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
        <Box
          display="flex"
          flexDirection="row"
          gap={3}
          alignItems="center"
          justifyContent="center"
        >
          {adventureRoutesForUser.map((adventureRoute) => (
            <AdventureRouteCard adventureRoute={adventureRoute} />
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};
