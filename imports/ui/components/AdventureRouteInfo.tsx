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
import { Color, MUTCDFont, humanReadableTravelMode } from "/imports/constants";
import {
  formatDuration,
  formatImperialDistance,
  formatMetricDistance,
} from "/imports/utils";
import { MUTCDRectangleSign } from "/imports/ui/components";

type AdventureRouteInfoProps = {
  adventureRoute?: AdventureRoute;
  directions: google.maps.DirectionsResult | null;
  travelMode: google.maps.TravelMode;
  setTravelMode: (travelMode: google.maps.TravelMode) => void;
  isTrafficLayerVisible: boolean;
  setIsTrafficLayerVisible: (isTrafficLayerVisible: boolean) => void;
  isTransitLayerVisible: boolean;
  setIsTransitLayerVisible: (isTransitLayerVisible: boolean) => void;
  isKmlLayerVisible: boolean;
  setIsKmlLayerVisible: (isKmlLayerVisible: boolean) => void;
  isAvoidHighwaysEnabled: boolean;
  setIsAvoidHighwaysEnabled: (isAvoidHighwaysEnabled: boolean) => void;
  unitSystem: google.maps.UnitSystem;
  setUnitSystem: (unitSystem: google.maps.UnitSystem) => void;
  mutcdFont: MUTCDFont;
  setMutcdFont: (mutcdFont: MUTCDFont) => void;
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
    isKmlLayerVisible,
    setIsKmlLayerVisible,
    isAvoidHighwaysEnabled,
    setIsAvoidHighwaysEnabled,
    unitSystem,
    setUnitSystem,
    mutcdFont,
    setMutcdFont,
  } = props;
  const { name, description } = adventureRoute || {};
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
                <TabPanel color="white">
                  <Text>{description}</Text>
                </TabPanel>
                <TabPanel>
                  <Accordion allowToggle defaultIndex={0}>
                    <AccordionItem tabIndex={0}>
                      <AccordionButton color="white" fontWeight="bold">
                        Overview
                      </AccordionButton>
                      <AccordionPanel>
                        <MUTCDRectangleSign fontFamily={mutcdFont}>
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
                            <Text
                              display="flex"
                              flexDirection="row"
                              gap={2}
                              alignItems="baseline"
                            >
                              Total Duration{" "}
                              <Text fontSize="smaller">(without traffic)</Text>
                            </Text>
                            <Text>{formattedDuration}</Text>
                          </Box>
                        </MUTCDRectangleSign>
                      </AccordionPanel>
                    </AccordionItem>
                    {legs?.map((leg, i) => {
                      const stepBeginningLabel = String.fromCharCode(i + 65);
                      const stepEndLabel =
                        i > 24 ? "AA" : String.fromCharCode(i + 66);
                      return (
                        <AccordionItem
                          key={`Leg${stepBeginningLabel}to${stepEndLabel}`}
                          tabIndex={i + 1}
                        >
                          <AccordionButton color="white" fontWeight="bold">
                            Leg {stepBeginningLabel} to {stepEndLabel} (
                            {leg.distance?.text}, {leg.duration?.text})
                          </AccordionButton>
                          <AccordionPanel>
                            <Box display="flex" flexDirection="column" gap={1}>
                              {leg.steps.map((step, i) => (
                                <MUTCDRectangleSign
                                  key={`step${i}`}
                                  fontFamily={mutcdFont}
                                >
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
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
                                </MUTCDRectangleSign>
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
                    <FormLabel htmlFor="traffic-layer-switch" fontWeight="bold">
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
                    <FormLabel htmlFor="transit-layer-switch" fontWeight="bold">
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
                  <FormControl
                    width="100%"
                    display="flex"
                    justifyContent="space-between"
                    color={Color.WHITE}
                    paddingBottom={3}
                  >
                    <FormLabel htmlFor="kml-layer-switch" fontWeight="bold">
                      KML Layer
                    </FormLabel>
                    <Switch
                      id="kml-layer-switch"
                      isChecked={isKmlLayerVisible}
                      onChange={() => setIsKmlLayerVisible(!isKmlLayerVisible)}
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
                    <FormLabel
                      htmlFor="avoid-highways-switch"
                      fontWeight="bold"
                    >
                      Avoid Highways
                    </FormLabel>
                    <Switch
                      id="avoid-highways-switch"
                      isChecked={isAvoidHighwaysEnabled}
                      onChange={() =>
                        setIsAvoidHighwaysEnabled(!isAvoidHighwaysEnabled)
                      }
                      colorScheme="orange"
                    />
                  </FormControl>
                  <RadioGroup
                    colorScheme="orange"
                    value={unitSystem.toString()}
                    onChange={(e) => setUnitSystem(parseInt(e))}
                    paddingBottom={5}
                  >
                    <HStack justifyContent="space-between" color="white">
                      <Text fontWeight="bold">Unit of Measurement</Text>
                      <Radio value="1">Imperial</Radio>
                      <Radio value="0">Metric</Radio>
                    </HStack>
                  </RadioGroup>
                  <RadioGroup
                    colorScheme="orange"
                    value={mutcdFont}
                    onChange={(e) => setMutcdFont(e as MUTCDFont)}
                  >
                    <HStack justifyContent="space-between" color="white">
                      <Text fontWeight="bold">MUTCD Font</Text>
                      <Radio value={MUTCDFont.HWYGOTHIC}>Highway Gothic</Radio>
                      <Radio value={MUTCDFont.CLEARVIEW}>Clearview</Radio>
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
