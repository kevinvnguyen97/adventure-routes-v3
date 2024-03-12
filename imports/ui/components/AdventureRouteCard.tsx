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
import { TOAST_PRESET } from "/imports/constants/toast";
import { DeleteRouteModal, MapFormModal } from "/imports/ui/components/modals";
import { EditIcon } from "@chakra-ui/icons";
import { Color } from "/imports/constants";

type AdventureRouteCardProps = {
  adventureRoute: AdventureRoute;
};
export const AdventureRouteCard = (props: AdventureRouteCardProps) => {
  const { adventureRoute } = props;
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
          ...TOAST_PRESET,
          title: "Success",
          description: `Deleted route ${adventureRoute.name}`,
          status: "success",
        });
      } catch (error) {
        if (error) {
          const meteorError = error as Meteor.Error;
          console.error(meteorError);
          toast({
            ...TOAST_PRESET,
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
        _hover={{ cursor: "pointer" }}
        flexDirection="row"
        paddingTop={5}
      >
        <Box>
          <Image
            src="/small_logo.png"
            minWidth={100}
            maxWidth={100}
            height="auto"
          />
        </Box>
        <Box>
          <CardHeader fontWeight="bold" textAlign="start">
            {adventureRoute.name}
          </CardHeader>
          <IconButton
            aria-label="edit-adventure-route"
            icon={<EditIcon />}
            size="sm"
            colorScheme="transparent"
            _hover={{ bgColor: "orange.500" }}
            position="absolute"
            right={8}
            top={0}
            onClick={(e) => {
              e.stopPropagation();
              onEditMapModalOpen();
            }}
          />
          <CloseButton
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRouteModalOpen();
            }}
            position="absolute"
            right={0}
            top={0}
            colorScheme="red"
          />
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
