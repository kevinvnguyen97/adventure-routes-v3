import React, { FormEvent, useState } from "react";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  useToast,
  FormControl,
  FormErrorMessage,
  InputGroup,
  Textarea,
  Box,
} from "@chakra-ui/react";
import { useMeteorAuth } from "../providers/Auth";
import { Meteor } from "meteor/meteor";
import { MultiSelect, useMultiSelect } from "chakra-multiselect";
import { AdventureRoute } from "/imports/api/adventureRoutes";
import { meteorMethodPromise } from "/imports/utils";
import { TOAST_PRESET } from "/imports/constants/toast";

export const MapFormModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    value: activities = [] as string[],
    options: activitiesOptions,
    onChange: onActivityChange,
  } = useMultiSelect({
    value: "",
    options: [{ label: "Hello", value: "Hello" }],
  });

  const [name, setName] = useState("");
  const [priceCategory, setPriceCategory] = useState(0);
  const [description, setDescription] = useState("");
  const [origin, setOrigin] = useState("");
  const [waypoints, setWaypoints] = useState<string[]>([""]);
  const [destination, setDestination] = useState("");

  const { userId } = useMeteorAuth();

  const submitMapForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId) {
      const adventureRoute: AdventureRoute = {
        userId,
        name,
        priceCategory,
        activities: activities as string[],
        description,
        route: {
          origin,
          waypoints: waypoints.filter((waypoint) => !!waypoint),
          destination,
        },
      };

      try {
        await meteorMethodPromise("upsertAdventureRoute", adventureRoute);
        toast({
          ...TOAST_PRESET,
          title: "Success",
          description: `Created route ${name}`,
          status: "success",
        });
        onClose();
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
    <Box>
      <Button onClick={onOpen} colorScheme="orange">
        Create a Route
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="orange" textColor="white">
          <ModalHeader>Create Route</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={submitMapForm}
              id="map-form"
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <FormControl isRequired isInvalid={!name}>
                <Input
                  placeholder="Route Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  backgroundColor="white"
                  textColor="black"
                  focusBorderColor="orange.400"
                  errorBorderColor="red.500"
                  required
                />
                <FormErrorMessage>Route name is required</FormErrorMessage>
              </FormControl>
              <FormControl>
                <Textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  bgColor="white"
                  textColor="black"
                  focusBorderColor="orange.400"
                  errorBorderColor="red.500"
                  as="textarea"
                />
              </FormControl>
              <Select
                placeholder="Select Price Category"
                value={priceCategory}
                onChange={(e) => setPriceCategory(parseInt(e.target.value))}
                bgColor="white"
                textColor="black"
                focusBorderColor="orange.400"
                errorBorderColor="red.500"
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
                        colorScheme="red"
                      >
                        -
                      </Button>
                    )}
                    <Button
                      onClick={() => setWaypoints([...waypoints, ""])}
                      colorScheme="blue"
                    >
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
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit" form="map-form">
              Create Adventure Route
            </Button>
            <Button onClick={onClose} colorScheme="red">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
