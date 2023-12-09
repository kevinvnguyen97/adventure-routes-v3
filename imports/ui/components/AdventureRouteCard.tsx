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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { AdventureRoute } from "/imports/api/adventureRoutes";
import { meteorMethodPromise } from "/imports/utils";
import { TOAST_PRESET } from "/imports/constants/toast";
import { DeleteRouteModal } from "/imports/ui/components";

type AdventureRouteCardProps = {
  adventureRoute: AdventureRoute;
};
export const AdventureRouteCard = (props: AdventureRouteCardProps) => {
  const { adventureRoute } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  return (
    <>
      <Card
        onClick={() => navigate(`/map/${adventureRoute._id}`)}
        key={adventureRoute._id}
        width={200}
        bgColor="#f09000"
        color="white"
        _hover={{ cursor: "pointer" }}
      >
        <CardHeader fontWeight="bold">{adventureRoute.name}</CardHeader>
        <CloseButton
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          position="absolute"
          right={0}
          colorScheme="red"
        />
        <CardBody>
          <Text>{adventureRoute.description}</Text>
          <Text>{adventureRoute.priceCategory}</Text>
          <Text>{adventureRoute.route.origin}</Text>
          {adventureRoute.route.waypoints?.map((waypoint) => (
            <Text key={waypoint}>{waypoint}</Text>
          ))}
          <Text>{adventureRoute.route.destination}</Text>
        </CardBody>
      </Card>
      <DeleteRouteModal
        isOpen={isOpen}
        onClose={onClose}
        deleteAdventureRoute={deleteAdventureRoute}
      />
    </>
  );
};
