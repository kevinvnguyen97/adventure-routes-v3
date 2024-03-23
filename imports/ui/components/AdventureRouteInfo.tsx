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
} from "@chakra-ui/react";

import { AdventureRoute } from "/imports/api/adventureRoutes";
import { Color, MUTCDFont } from "/imports/constants";
import {
  AdventureRouteTable,
  CommentsSection,
  MapDirections,
  MapSettings,
} from "/imports/ui/components";

type AdventureRouteInfoProps = {
  adventureRoute?: AdventureRoute;
  directions: google.maps.DirectionsResult | null;
  fitBounds: (boundPoints: google.maps.LatLng[]) => void;
  selectedRoutes: boolean[];
  setSelectedRoutes: (selectedRoutes: boolean[]) => void;
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
    selectedRoutes,
    setSelectedRoutes,
    fitBounds,
    isInfoButtonEnabled,
    ...mapSettingsProps
  } = props;
  const { mutcdFont, unitSystem } = mapSettingsProps;
  const { _id: adventureRouteId = "", name } = adventureRoute || {};
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
        backgroundColor={Color.WHITE}
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
        <DrawerContent bgColor={Color.ORANGE} color={Color.BLACK}>
          <DrawerCloseButton color={Color.WHITE} />
          <DrawerHeader textColor={Color.WHITE}>{name}</DrawerHeader>
          <DrawerBody>
            <Tabs variant="solid-rounded" colorScheme="orange" defaultIndex={1}>
              <TabList>
                <Tab color={Color.WHITE}>Journal</Tab>
                <Tab color={Color.WHITE}>Directions</Tab>
                <Tab color={Color.WHITE}>Comments</Tab>
                <Tab color={Color.WHITE}>Settings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel color={Color.WHITE}>
                  <AdventureRouteTable adventureRoute={adventureRoute} />
                </TabPanel>
                <TabPanel paddingLeft={0} paddingRight={0}>
                  <MapDirections
                    routes={directions?.routes ?? []}
                    fitBounds={fitBounds}
                    selectedRoutes={selectedRoutes}
                    setSelectedRoutes={setSelectedRoutes}
                    unitSystem={unitSystem}
                    mutcdFont={mutcdFont}
                  />
                </TabPanel>
                <TabPanel display="flex" flexDirection="column" gap={3}>
                  <CommentsSection adventureRouteId={adventureRouteId} />
                </TabPanel>
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
