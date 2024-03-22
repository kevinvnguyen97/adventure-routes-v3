import React from "react";
import {
  TableContainer,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  List,
  ListItem,
} from "@chakra-ui/react";

import { AdventureRoute } from "/imports/api/adventureRoutes";
import { Color } from "/imports/constants";

type AdventureRouteTableProps = {
  adventureRoute: AdventureRoute | undefined;
};
export const AdventureRouteTable = (props: AdventureRouteTableProps) => {
  const { adventureRoute } = props;
  const {
    description,
    priceCategory = 0,
    activities = [],
    route,
  } = adventureRoute || {};
  const { origin, waypoints = [], destination } = route || {};

  return (
    <TableContainer>
      <Table size="md">
        <Tbody>
          <Tr>
            <Th textColor={Color.WHITE}>Description</Th>
            <Td>{description || "N/A"}</Td>
          </Tr>
          <Tr>
            <Th textColor={Color.WHITE}>Price Category</Th>
            <Td>
              {priceCategory === 0
                ? "Free"
                : [...Array(priceCategory)].map(() => "$")}
            </Td>
          </Tr>
          {activities.length > 0 && (
            <Tr>
              <Th textColor={Color.WHITE}>Activities</Th>
              <Td display="flex" gap={2}>
                {activities.map((activity) => (
                  <Tag colorScheme="orange" variant="solid" borderRadius="full">
                    {activity}
                  </Tag>
                ))}
              </Td>
            </Tr>
          )}
          <Tr>
            <Th textColor={Color.WHITE}>Origin</Th>
            <Td textOverflow="ellipsis">{origin}</Td>
          </Tr>
          {waypoints.length > 0 && (
            <Tr>
              <Th textColor="white">Stopovers</Th>
              <Td>
                {waypoints.map((waypoint) => (
                  <List listStylePosition="outside" listStyleType="square">
                    <ListItem>{waypoint.split(",").join("\r\n")}</ListItem>
                  </List>
                ))}
              </Td>
            </Tr>
          )}
          <Tr>
            <Th textColor="white">Destination</Th>
            <Td>{destination}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};
