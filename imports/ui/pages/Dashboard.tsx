import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  SimpleGrid,
  useDisclosure,
  Button,
  Input,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

import {
  useAdventureRoutesForUser,
  useMeteorAuth,
  useUserInfo,
} from "/imports/ui/providers";
import { AdventureRouteCard, LoadingScreen } from "/imports/ui/components";
import { MapFormModal } from "/imports/ui/components/modals";
import { Color } from "/imports/constants";
import { useNavigate, useParams } from "react-router-dom";

export const Dashboard = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { user: loggedInUser, userId: loggedInUserId } = useMeteorAuth();
  const { data: otherUser, isLoading: isOtherUserLoading } = useUserInfo(id);
  const { data: adventureRoutesForUser, isLoading } = useAdventureRoutesForUser(
    (id || loggedInUserId) ?? ""
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { username: loggedInUsername } = loggedInUser || {};
  const { username: otherUsername } = otherUser || {};

  const [routeInput, setRouteInput] = useState("");

  const filteredRoutes = adventureRoutesForUser.filter(({ name }) =>
    name.toLowerCase().includes(routeInput.toLowerCase())
  );

  useEffect(() => {
    if (id && loggedInUserId && id === loggedInUserId) {
      navigate("/", { replace: true });
    }
    if (id) {
      document.title = `${otherUsername} - Adventure Routes`;
    } else {
      document.title = "Dashboard - Adventure Routes";
    }
  }, [id]);

  if (isLoading || (isOtherUserLoading && id)) {
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
        flexDirection="column"
        paddingTop={5}
        textAlign="center"
        gap={2}
      >
        <Text color={Color.WHITE} fontWeight="bold" fontSize={40}>
          {id ? otherUsername : loggedInUsername}'s Routes
        </Text>
        <Input
          type="search"
          value={routeInput}
          onChange={(e) => setRouteInput(e.target.value)}
          bgColor={Color.WHITE}
          placeholder="Search a route"
          size="lg"
          width={400}
        />
        <Text textColor={Color.WHITE} fontSize="large">
          or
        </Text>
        {(!id || id === loggedInUserId) && (
          <Button
            onClick={onOpen}
            colorScheme="orange"
            marginBottom={2}
            width="auto"
          >
            Create a Route
          </Button>
        )}
        <SimpleGrid
          columnGap={3}
          rowGap={3}
          minChildWidth={350}
          alignContent="center"
          autoColumns="max-content"
        >
          {filteredRoutes.map((adventureRoute) => (
            <AdventureRouteCard
              adventureRoute={adventureRoute}
              key={adventureRoute._id}
            />
          ))}
        </SimpleGrid>
        <MapFormModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </motion.div>
  );
};
