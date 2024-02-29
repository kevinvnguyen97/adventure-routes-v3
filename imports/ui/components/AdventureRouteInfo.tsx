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
  Text,
} from "@chakra-ui/react";

import { AdventureRoute } from "/imports/api/adventureRoutes";
import { MUTCDFont } from "/imports/constants";
import { MapDirections, MapSettings } from "/imports/ui/components";

type AdventureRouteInfoProps = {
  adventureRoute?: AdventureRoute;
  directions: google.maps.DirectionsResult | null;
  travelMode: google.maps.TravelMode;
  setTravelMode: (travelMode: google.maps.TravelMode) => void;
  isInfoButtonEnabled: boolean;
  isTrafficLayerVisible: boolean;
  setIsTrafficLayerVisible: () => void;
  isTransitLayerVisible: boolean;
  setIsTransitLayerVisible: () => void;
  isKmlLayerVisible: boolean;
  setIsKmlLayerVisible: () => void;
  isAvoidHighwaysEnabled: boolean;
  setIsAvoidHighwaysEnabled: () => void;
  isAvoidTollsEnabled: boolean;
  setIsAvoidTollsEnabled: () => void;
  unitSystem: google.maps.UnitSystem;
  setUnitSystem: (unitSystem: google.maps.UnitSystem) => void;
  mutcdFont: MUTCDFont;
  setMutcdFont: (mutcdFont: MUTCDFont) => void;
};
export const AdventureRouteInfo = (props: AdventureRouteInfoProps) => {
  const {
    adventureRoute,
    directions,
    isInfoButtonEnabled,
    ...mapSettingsProps
  } = props;
  const { mutcdFont, unitSystem } = mapSettingsProps;
  const { name, description, priceCategory } = adventureRoute || {};
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
        isDisabled={!isInfoButtonEnabled}
      >
        Info
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
                <Tab color="white">Comments</Tab>
                <Tab color="white">Settings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel color="white">
                  <Text>{description}</Text>
                  <Text>
                    {priceCategory === 0
                      ? "Free"
                      : [...Array(priceCategory)].map(() => "$")}
                  </Text>
                </TabPanel>
                <TabPanel paddingLeft={0} paddingRight={0}>
                  <MapDirections
                    legs={legs}
                    unitSystem={unitSystem}
                    mutcdFont={mutcdFont}
                  />
                </TabPanel>
                <TabPanel></TabPanel>
                <TabPanel>
                  <MapSettings {...mapSettingsProps} />
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
