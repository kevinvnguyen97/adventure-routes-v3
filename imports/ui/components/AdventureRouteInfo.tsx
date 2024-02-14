import React, { createRef } from "react";
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
  DrawerOverlay,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Select,
  Text,
  Switch,
  FormLabel,
  FormControl,
  RadioGroup,
  HStack,
  Radio,
} from "@chakra-ui/react";

import { AdventureRoute } from "/imports/api/adventureRoutes";
import { Color, humanReadableTravelMode } from "/imports/constants";
import {
  formatDuration,
  formatImperialDistance,
  formatMetricDistance,
} from "/imports/utils";

type AdventureRouteInfoProps = {
  adventureRoute?: AdventureRoute;
  directions: google.maps.DirectionsResult | null;
  travelMode: google.maps.TravelMode;
  setTravelMode: (travelMode: google.maps.TravelMode) => void;
  isTrafficLayerVisible: boolean;
  setIsTrafficLayerVisible: (isTrafficLayerVisible: boolean) => void;
  isTransitLayerVisible: boolean;
  setIsTransitLayerVisible: (isTransitLayerVisible: boolean) => void;
  unitSystem: google.maps.UnitSystem;
  setUnitSystem: (unitSystem: google.maps.UnitSystem) => void;
};
export const AdventureRouteInfo = (props: AdventureRouteInfoProps) => {
  const {
    adventureRoute,
    directions,
    travelMode,
    setTravelMode,
    isTrafficLayerVisible,
    setIsTrafficLayerVisible,
    isTransitLayerVisible,
    setIsTransitLayerVisible,
    unitSystem,
    setUnitSystem,
  } = props;
  const { name } = adventureRoute || {};
  const { routes } = directions || {};
  const generatedPath = routes?.[0];
  const { legs } = generatedPath || {};
  const adventureRouteInfoButtonRef = createRef<HTMLButtonElement>();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  /** Total route distance in meters */
  const totalDistance =
    legs
      ?.map(({ distance }) => distance?.value ?? 0)
      .reduce(
        (accumulatedDistance, legDistance) => accumulatedDistance + legDistance
      ) ?? 0;
  /** Total route duration in seconds */
  const totalDuration =
    legs
      ?.map(({ duration }) => duration?.value ?? 0)
      .reduce(
        (accumulatedDuration, legDuration) => accumulatedDuration + legDuration
      ) ?? 0;

  const formattedDuration = formatDuration(totalDuration);
  const formattedDistance =
    unitSystem === 0
      ? formatMetricDistance(totalDistance)
      : formatImperialDistance(totalDistance);

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
          <DrawerBody>
            <Tabs variant="solid-rounded" colorScheme="orange" defaultIndex={1}>
              <TabList>
                <Tab color="white">Journal</Tab>
                <Tab color="white">Directions</Tab>
                <Tab color="white">Settings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel></TabPanel>
                <TabPanel>
                  <Accordion allowToggle defaultIndex={0}>
                    <AccordionItem tabIndex={0} isFocusable>
                      <AccordionButton color="white" fontWeight="bold">
                        Overview
                      </AccordionButton>
                      <AccordionPanel>
                        <Box
                          backgroundColor={Color.MUTCD_GREEN}
                          color={Color.WHITE}
                          letterSpacing={1}
                          padding={0.5}
                          borderRadius={10}
                        >
                          <Box
                            fontFamily="Highway Gothic"
                            padding={2}
                            borderWidth={2}
                            borderRadius={10}
                            borderColor={Color.WHITE}
                          >
                            <Box
                              display="flex"
                              flexDirection="row"
                              justifyContent="space-between"
                            >
                              <Text>Total Distance</Text>
                              <Text>{formattedDistance}</Text>
                            </Box>
                            <Box
                              display="flex"
                              flexDirection="row"
                              justifyContent="space-between"
                            >
                              <Text>Total Duration (without traffic)</Text>
                              <Text>{formattedDuration}</Text>
                            </Box>
                          </Box>
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                    {legs?.map((leg, i) => {
                      const stepBeginningLabel = String.fromCharCode(i + 65);
                      const stepEndLabel =
                        i > 24 ? "AA" : String.fromCharCode(i + 66);
                      return (
                        <AccordionItem
                          key={`Leg${stepBeginningLabel}to${stepEndLabel}`}
                          isFocusable
                          tabIndex={i + 1}
                        >
                          <AccordionButton color="white" fontWeight="bold">
                            Leg {stepBeginningLabel} to {stepEndLabel} (
                            {leg.distance?.text}, {leg.duration?.text})
                          </AccordionButton>
                          <AccordionPanel>
                            <Box display="flex" flexDirection="column" gap={1}>
                              {leg.steps.map((step, i) => (
                                <Box
                                  key={`Step${i}`}
                                  backgroundColor={Color.MUTCD_GREEN}
                                  color={Color.WHITE}
                                  padding={0.5}
                                  borderRadius={10}
                                >
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    borderColor={Color.WHITE}
                                    borderWidth={2}
                                    borderRadius={10}
                                    padding={2}
                                    letterSpacing={1}
                                    fontFamily="Highway Gothic"
                                  >
                                    <Text
                                      dangerouslySetInnerHTML={{
                                        __html: `${step.instructions}`,
                                      }}
                                    />

                                    <Box minWidth={140} textAlign="end">
                                      <Text>{step.distance?.text}</Text>
                                      <Text>{step.duration?.text}</Text>
                                    </Box>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          </AccordionPanel>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </TabPanel>
                <TabPanel>
                  <Select
                    placeholder="Select Transportation Mode"
                    bgColor="white"
                    color="black"
                    focusBorderColor="orange.400"
                    errorBorderColor="red.500"
                    value={travelMode}
                    onChange={(e) =>
                      setTravelMode(e.target.value as google.maps.TravelMode)
                    }
                  >
                    {Object.keys(google.maps.TravelMode).map(
                      (mode) =>
                        mode !== "TWO_WHEELER" && (
                          <option key={mode} value={mode}>
                            {
                              humanReadableTravelMode[
                                mode as google.maps.TravelMode
                              ]
                            }
                          </option>
                        )
                    )}
                  </Select>
                  <FormControl
                    width="100%"
                    display="flex"
                    justifyContent="space-between"
                    color={Color.WHITE}
                    paddingTop={3}
                    paddingBottom={3}
                  >
                    <FormLabel htmlFor="traffic-layer-switch">
                      Traffic Layer
                    </FormLabel>
                    <Switch
                      id="traffic-layer-switch"
                      isChecked={isTrafficLayerVisible}
                      onChange={() =>
                        setIsTrafficLayerVisible(!isTrafficLayerVisible)
                      }
                      colorScheme="orange"
                    />
                  </FormControl>
                  <FormControl
                    width="100%"
                    display="flex"
                    justifyContent="space-between"
                    color={Color.WHITE}
                    paddingBottom={3}
                  >
                    <FormLabel htmlFor="transit-layer-switch">
                      Transit Layer
                    </FormLabel>
                    <Switch
                      id="transit-layer-switch"
                      isChecked={isTransitLayerVisible}
                      onChange={() =>
                        setIsTransitLayerVisible(!isTransitLayerVisible)
                      }
                      colorScheme="orange"
                    />
                  </FormControl>
                  <RadioGroup
                    colorScheme="orange"
                    value={unitSystem.toString()}
                    onChange={(e) => setUnitSystem(parseInt(e))}
                  >
                    <HStack justifyContent="space-between" color="white">
                      <Text>Unit of Measurement</Text>
                      <Radio value="1">Imperial</Radio>
                      <Radio value="0">Metric</Radio>
                    </HStack>
                  </RadioGroup>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
