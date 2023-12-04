import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { MapFormModal } from "../components/MapFormModal";
import { useAdventureRoutesForUser } from "/imports/ui/providers/AdventureRoutes";
import { useMeteorAuth } from "../providers/Auth";
import { AdventureRouteCard } from "/imports/ui/components/AdventureRouteCard";

export const Dashboard = () => {
  const { data: adventureRoutesForUser } = useAdventureRoutesForUser();
  const { user } = useMeteorAuth();
  const { username } = user || {};

  return (
    <Box
      margin="auto"
      width={400}
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
      {adventureRoutesForUser.map((adventureRoute) => (
        <AdventureRouteCard adventureRoute={adventureRoute} />
      ))}
    </Box>
  );
};
