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
} from "@chakra-ui/react";
import { AdventureRoute } from "/imports/api/adventureRoutes";
import { Color, humanReadableTravelMode } from "/imports/constants";

type AdventureRouteInfoProps = {
  adventureRoute?: AdventureRoute;
  directions: google.maps.DirectionsResult | null;
  travelMode: google.maps.TravelMode;
  setTravelMode: (travelMode: google.maps.TravelMode) => void;
};
export const AdventureRouteInfo = (props: AdventureRouteInfoProps) => {
  const { adventureRoute, directions, travelMode, setTravelMode } = props;
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
                  <Accordion allowMultiple>
                    <AccordionItem defaultChecked>
                      <AccordionButton color="white" fontWeight="bold">
                        Overview
                      </AccordionButton>
                      <AccordionPanel>
                        <Box></Box>
                      </AccordionPanel>
                    </AccordionItem>
                    {legs?.map((leg, i) => (
                      <AccordionItem>
                        <AccordionButton color="white" fontWeight="bold">
                          Leg {String.fromCharCode(i + 65)} to{" "}
                          {String.fromCharCode(i + 66)} ({leg.distance?.text},{" "}
                          {leg.duration?.text})
                        </AccordionButton>
                        <AccordionPanel>
                          <Box display="flex" flexDirection="column" gap={1}>
                            {leg.steps.map((step) => (
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                color={Color.WHITE}
                                backgroundColor={Color.MUTCD_GREEN}
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
                                <Text minWidth={150} textAlign="end">
                                  <Text>{step.distance?.text}</Text>
                                  <Text>{step.duration?.text}</Text>
                                </Text>
                              </Box>
                            ))}
                          </Box>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
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
                          <option value={mode}>
                            {
                              humanReadableTravelMode[
                                mode as google.maps.TravelMode
                              ]
                            }
                          </option>
                        )
                    )}
                  </Select>
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
