import React from "react";
import { Meteor } from "meteor/meteor";
import {
  Card,
  CardHeader,
  CloseButton,
  CardBody,
  Text,
  useToast,
  useDisclosure,
  Box,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { AdventureRoute } from "/imports/api/adventureRoutes";
import { meteorMethodPromise } from "/imports/utils";
import { DeleteRouteModal, MapFormModal } from "/imports/ui/components/modals";
import { EditIcon, ViewIcon } from "@chakra-ui/icons";
import { Color } from "/imports/constants";
import { useMeteorAuth } from "/imports/ui/providers";

type AdventureRouteCardProps = {
  adventureRoute: AdventureRoute;
};
export const AdventureRouteCard = (props: AdventureRouteCardProps) => {
  const { adventureRoute } = props;
  const { userId } = useMeteorAuth();
  const {
    isOpen: isDeleteRouteModalOpen,
    onOpen: onDeleteRouteModalOpen,
    onClose: onDeleteRouteModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditMapModalOpen,
    onOpen: onEditMapModalOpen,
    onClose: onEditMapModalClose,
  } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const deleteAdventureRoute = async () => {
    if (adventureRoute._id) {
      try {
        await meteorMethodPromise("deleteAdventureRoute", adventureRoute._id);
        toast({
          title: "Success",
          description: `Deleted route ${adventureRoute.name}`,
          status: "success",
        });
      } catch (error) {
        if (error) {
          const meteorError = error as Meteor.Error;
          console.error(meteorError);
          toast({
            title: meteorError.name,
            description: meteorError.message,
            status: "error",
          });
        }
      }
    }
  };

  const numberOfStopovers = adventureRoute.route.waypoints?.length ?? 0;

  return (
    <>
      <Card
        onClick={() => navigate(`/map/${adventureRoute._id}`)}
        key={adventureRoute._id}
        width="100%"
        bgColor={Color.DARK_ORANGE}
        color={Color.WHITE}
        flexDirection="row"
        paddingTop={5}
        paddingBottom={5}
      >
        <Box width="100%">
          <CardHeader fontWeight="bold" textAlign="start" display="flex">
            <Image
              src="/small_logo.png"
              minWidth={35}
              maxWidth={35}
              height="auto"
            />
            <Text>{adventureRoute.name}</Text>
          </CardHeader>
          <CardBody textAlign="start">
            <Text>{adventureRoute.description}</Text>
            <Text>_</Text>
            <Text>
              {[...Array(adventureRoute.priceCategory)].map(() => "$")}
            </Text>
            <Text>Start: {adventureRoute.route.origin}</Text>
            {numberOfStopovers > 0 && (
              <Text>
                {numberOfStopovers}{" "}
                {numberOfStopovers === 1 ? "Stopover" : "Stopovers"}
              </Text>
            )}
            <Text>End: {adventureRoute.route.destination}</Text>
          </CardBody>
        </Box>
        {userId === adventureRoute.userId && (
          <Box
            alignItems="end"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            justifyItems="center"
            height="100%"
          >
            <CloseButton
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRouteModalOpen();
              }}
              colorScheme="orange"
              variant="ghost"
              _hover={{ bgColor: "orange.500" }}
              width="100%"
              height="48px"
              size="lg"
            />
            <IconButton
              aria-label="edit-adventure-route"
              icon={<EditIcon />}
              size="lg"
              colorScheme="orange"
              color="white"
              variant="ghost"
              _hover={{ bgColor: "orange.500" }}
              onClick={(e) => {
                e.stopPropagation();
                onEditMapModalOpen();
              }}
            />
            <IconButton
              aria-label="map-button"
              icon={<ViewIcon />}
              size="lg"
              colorScheme="orange"
              color="white"
              variant="ghost"
              _hover={{ bgColor: "orange.500" }}
              onClick={() => navigate(`/map/${adventureRoute._id}`)}
            />
          </Box>
        )}
      </Card>
      <MapFormModal
        isOpen={isEditMapModalOpen}
        onClose={onEditMapModalClose}
        adventureRoute={adventureRoute}
      />
      <DeleteRouteModal
        isOpen={isDeleteRouteModalOpen}
        onClose={onDeleteRouteModalClose}
        deleteAdventureRoute={deleteAdventureRoute}
      />
    </>
  );
};
