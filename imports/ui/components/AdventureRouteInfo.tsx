import React, { createRef, useEffect, useState } from "react";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Box,
  useDisclosure,
  Select,
  FormControl,
  Input,
  FormErrorMessage,
  DrawerOverlay,
  Textarea,
  InputGroup,
} from "@chakra-ui/react";
import { AdventureRoute } from "/imports/api/adventureRoutes";

type AdventureRouteInfoProps = {
  adventureRoute?: AdventureRoute;
};
export const AdventureRouteInfo = (props: AdventureRouteInfoProps) => {
  const { adventureRoute } = props;
  const {
    name,
    description: loadedDescription,
    priceCategory: loadedPriceCategory,
    route,
  } = adventureRoute || {};
  const {
    origin: loadedOrigin = "",
    waypoints: loadedWaypoints = [],
    destination: loadedDestination = "",
  } = route || {};
  const adventureRouteInfoButtonRef = createRef<HTMLButtonElement>();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const [description, setDescription] = useState("");
  const [priceCategory, setPriceCategory] = useState(0);
  const [origin, setOrigin] = useState("");
  const [waypoints, setWaypoints] = useState<string[]>([""]);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    setDescription(loadedDescription ?? "");
    setPriceCategory(loadedPriceCategory ?? 0);
    setOrigin(loadedOrigin ?? "");
    setWaypoints(loadedWaypoints.length > 0 ? loadedWaypoints : [""]);
    setDestination(loadedDestination ?? "");
  }, [adventureRoute]);
  return (
    <Box>
      <Button
        ref={adventureRouteInfoButtonRef}
        zIndex={1}
        backgroundColor="white"
        borderRadius={2}
        borderLeftRadius={0}
        onClick={onDrawerOpen}
      >
        Adventure Route Info
      </Button>
      <Drawer
        isOpen={isDrawerOpen}
        placement="left"
        onClose={onDrawerClose}
        finalFocusRef={adventureRouteInfoButtonRef}
        size="md"
        colorScheme="orange"
      >
        <DrawerOverlay />
        <DrawerContent bgColor="orange" color="black">
          <DrawerCloseButton color="white" />
          <DrawerHeader textColor="white">{name}</DrawerHeader>
          <DrawerBody display="flex" flexDirection="column" gap={2}>
            <Textarea
              bgColor="white"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Select
              placeholder="Select Price Category"
              value={priceCategory}
              onChange={(e) => setPriceCategory(parseInt(e.target.value))}
              bgColor="white"
            >
              <option value={0}>Free</option>
              <option value={1}>$</option>
              <option value={2}>$$</option>
              <option value={3}>$$$</option>
            </Select>
            <FormControl isRequired isInvalid={!origin}>
              <Input
                placeholder="Origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                backgroundColor="white"
                textColor="black"
                focusBorderColor="orange.400"
                errorBorderColor="red.500"
              />
              <FormErrorMessage>Origin is required</FormErrorMessage>
            </FormControl>
            {waypoints.map((waypoint, i) => {
              return (
                <InputGroup key={`waypoint${i}`}>
                  <Input
                    placeholder={`Waypoint ${i + 1}`}
                    value={waypoint}
                    onChange={(e) => {
                      const updatedWaypoints = waypoints.map(
                        (existingWaypoint, waypointIndexToUpdate) =>
                          i === waypointIndexToUpdate
                            ? e.target.value
                            : existingWaypoint
                      );
                      setWaypoints(updatedWaypoints);
                    }}
                    backgroundColor="white"
                    textColor="black"
                    focusBorderColor="orange.400"
                    errorBorderColor="red.500"
                  />
                  {waypoints.length > 1 && (
                    <Button
                      onClick={() => {
                        const updatedWaypoints = waypoints.filter(
                          (_, waypointIndexToRemove) =>
                            i !== waypointIndexToRemove
                        );
                        setWaypoints(updatedWaypoints);
                      }}
                    >
                      -
                    </Button>
                  )}
                  <Button onClick={() => setWaypoints([...waypoints, ""])}>
                    +
                  </Button>
                </InputGroup>
              );
            })}
            <FormControl isRequired isInvalid={!destination}>
              <Input
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                backgroundColor="white"
                textColor="black"
                focusBorderColor="orange.400"
                errorBorderColor="red.500"
              />
              <FormErrorMessage>Destination is required</FormErrorMessage>
            </FormControl>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
