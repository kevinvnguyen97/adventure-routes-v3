import React from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Input,
  InputGroup,
  Text,
  Image,
  CloseButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
// import { MapFormModal } from "../components/MapFormModal";
// import { useAdventureRoutesForUser } from "../providers/adventureRoutes";
import { useMeteorAuth } from "../components/Auth";
import { useNavigate } from "react-router-dom";
// import { meteorMethodPromise } from "/imports/utils/adventureRoutes";

export const Dashboard = () => {
  //   const { data: adventureRoutesForUser } = useAdventureRoutesForUser();
  const { user, loggedIn, isLoggingIn } = useMeteorAuth();
  console.log("is logged in:", loggedIn, isLoggingIn);
  const { username } = user || {};
  //   const navigate = useNavigate();
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
      <InputGroup>
        <Input
          backgroundColor="white"
          placeholder="Search a route"
          type="search"
        />
        <IconButton
          aria-label="search"
          size="md"
          icon={<SearchIcon />}
          colorScheme="orange"
        />
      </InputGroup>
      <Text color="white">or</Text>
      {/* <MapFormModal /> */}
      {/* {adventureRoutesForUser.map((adventureRoute) => (
        <Card
          onClick={() => navigate(`/map/${adventureRoute._id}`)}
          key={adventureRoute._id}
        >
          <CardHeader>{adventureRoute.name}</CardHeader>
          <CloseButton
            onClick={async () =>
              await meteorMethodPromise(
                "deleteAdventureRoute",
                adventureRoute._id
              )
            }
          />
          <CardBody>
            <Text>{adventureRoute.route.origin}</Text>
            {adventureRoute.route.waypoints?.map((waypoint) => (
              <Text>{waypoint}</Text>
            ))}
            <Text>{adventureRoute.route.destination}</Text>
          </CardBody>
        </Card>
      ))} */}
    </Box>
  );
};
