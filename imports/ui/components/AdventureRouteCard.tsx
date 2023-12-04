import React from "react";
import { Meteor } from "meteor/meteor";
import {
  Card,
  CardHeader,
  CloseButton,
  CardBody,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { AdventureRoute } from "/imports/api/adventureRoutes";
import { meteorMethodPromise } from "/imports/utils";

type AdventureRouteCardProps = {
  adventureRoute: AdventureRoute;
};
export const AdventureRouteCard = (props: AdventureRouteCardProps) => {
  const { adventureRoute } = props;
  const navigate = useNavigate();
  const toast = useToast();

  const deleteAdventureRoute = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (adventureRoute._id) {
      try {
        await meteorMethodPromise("deleteAdventureRoute", adventureRoute._id);
        toast({
          title: "Success",
          description: `Deleted route ${name}`,
          status: "success",
          position: "top",
        });
      } catch (error) {
        if (error) {
          const meteorError = error as Meteor.Error;
          console.error(meteorError);
          toast({
            title: meteorError.name,
            description: meteorError.message,
            status: "error",
            position: "top",
          });
        }
      }
    }
  };

  return (
    <Card
      onClick={() => navigate(`/map/${adventureRoute._id}`)}
      key={adventureRoute._id}
    >
      <CardHeader>{adventureRoute.name}</CardHeader>
      <CloseButton onClick={deleteAdventureRoute} />
      <CardBody>
        <Text>{adventureRoute.route.origin}</Text>
        {adventureRoute.route.waypoints?.map((waypoint) => (
          <Text key={waypoint}>{waypoint}</Text>
        ))}
        <Text>{adventureRoute.route.destination}</Text>
      </CardBody>
    </Card>
  );
};
