import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
  TrafficLayer,
  TransitLayer,
  KmlLayer,
  HeatmapLayer,
} from "@react-google-maps/api";
import { Box, Text, useToast } from "@chakra-ui/react";
import React, {
  useState,
  CSSProperties,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { useAdventureRoutesForUser } from "/imports/ui/providers";
import { AdventureRouteInfo, LoadingScreen } from "/imports/ui/components";
import { GOOGLE_SECRETS, MUTCDFont } from "/imports/constants";
import { TOAST_PRESET } from "/imports/constants/toast";

const MAP_CONTAINER_STYLE: CSSProperties = {
  width: "100%",
  height: "calc(100vh - 84px)",
};

export const Map = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_SECRETS.public.oauth.googleMapsApiKey,
    libraries: ["visualization"],
  });
  const toast = useToast();
  const { id } = useParams();
  const { data: adventureRoutes } = useAdventureRoutesForUser();
  const adventureRoute = adventureRoutes.find(({ _id }) => id === _id);

  const renderCount = useRef(0);

  const { route } = adventureRoute || {};
  const { origin = "", waypoints = [], destination = "" } = route || {};

  const formattedWaypoints: google.maps.DirectionsWaypoint[] = waypoints.map(
    (waypoint) => ({ location: waypoint, stopover: true })
  );

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(
    "DRIVING" as google.maps.TravelMode
  );
  const [unitSystem, setUnitSystem] = useState<google.maps.UnitSystem>(1);
  const [isTrafficLayerVisible, setIsTrafficLayerVisible] = useState(false);
  const [isTransitLayerVisible, setIsTransitLayerVisible] = useState(false);
  const [isKmlLayerVisible, setIsKmlLayerVisible] = useState(false);
  const [isAvoidHighwaysEnabled, setIsAvoidHighwaysEnabled] = useState(false);
  const [isAvoidTollsEnabled, setIsAvoidTollsEnabled] = useState(false);
  const [mutcdFont, setMutcdFont] = useState<MUTCDFont>(MUTCDFont.HWYGOTHIC);

  const onTrafficLayerChange = () => {
    setIsTrafficLayerVisible(!isTrafficLayerVisible);
  };

  const onTransitLayerChange = () => {
    setIsTransitLayerVisible(!isTransitLayerVisible);
  };

  const onKmlLayerChange = () => {
    setIsKmlLayerVisible(!isKmlLayerVisible);
  };

  const onUnitSystemChange = (newUnitSystem: google.maps.UnitSystem) => {
    setUnitSystem(newUnitSystem);
    renderCount.current = 0;
  };

  const onTravelModeChange = (newTravelMode: google.maps.TravelMode) => {
    setTravelMode(newTravelMode);
    renderCount.current = 0;
  };

  const onAvoidHighwayChange = () => {
    setIsAvoidHighwaysEnabled(!isAvoidHighwaysEnabled);
    renderCount.current = 0;
  };

  const onAvoidTollChange = () => {
    setIsAvoidTollsEnabled(!isAvoidTollsEnabled);
    renderCount.current = 0;
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("MAP:", map);
  }, []);
  const onUnmount = useCallback((map: google.maps.Map) => {
    console.log("MAP:", map);
  }, []);
  const directionsCallback = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      console.log("RESULT:", result);
      console.log("STATUS:", status);
      if (
        result &&
        status === google.maps.DirectionsStatus.OK &&
        renderCount.current === 0
      ) {
        setDirections(result);
      } else {
        switch (status) {
          case "INVALID_REQUEST":
            toast({
              ...TOAST_PRESET,
              title: "Invalid request",
              description: "Route cannot be rendered",
              status: "error",
            });
            break;
          case "NOT_FOUND":
            toast({
              ...TOAST_PRESET,
              title: "Not found",
              description: "At least one waypoint is not found",
              status: "error",
            });
            break;
        }
      }
      renderCount.current++;
    },
    []
  );
  const directionsOnLoad = useCallback(
    (directionsService: google.maps.DirectionsService) => {
      console.log("DIRECTIONS SERVICE ONLOAD:", directionsService);
    },
    []
  );
  const directionsUnmount = useCallback(
    (directionsService: google.maps.DirectionsService) => {
      console.log("DIRECTIONS SERVICE UNMOUNT:", directionsService);
    },
    []
  );
  const directionsRendererOnLoad = useCallback(
    (directionsRenderer: google.maps.DirectionsRenderer) => {
      console.log("DIRECTIONS RENDERER ONLOAD:", directionsRenderer);
    },
    []
  );
  const directionsRendererOnUnmount = useCallback(
    (directionsRenderer: google.maps.DirectionsRenderer) => {
      console.log("DIRECTIONS RENDERER UNMOUNT:", directionsRenderer);
    },
    []
  );

  useEffect(() => {
    document.title = `${
      adventureRoute?.name ?? "Adventure Route Not Found"
    } - Adventure Routes`;
  }, [adventureRoute?.name]);

  if (!isLoaded) {
    return <LoadingScreen />;
  }
  if (!adventureRoute) {
    return <Text>Adventure route not found</Text>;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Box position="absolute" left="179px" top="10px">
          <AdventureRouteInfo
            adventureRoute={adventureRoute}
            directions={directions}
            travelMode={travelMode}
            setTravelMode={onTravelModeChange}
            isTrafficLayerVisible={isTrafficLayerVisible}
            setIsTrafficLayerVisible={onTrafficLayerChange}
            isTransitLayerVisible={isTransitLayerVisible}
            setIsTransitLayerVisible={onTransitLayerChange}
            isKmlLayerVisible={isKmlLayerVisible}
            setIsKmlLayerVisible={onKmlLayerChange}
            isAvoidHighwaysEnabled={isAvoidHighwaysEnabled}
            setIsAvoidHighwaysEnabled={onAvoidHighwayChange}
            isAvoidTollsEnabled={isAvoidTollsEnabled}
            setIsAvoidTollsEnabled={onAvoidTollChange}
            unitSystem={unitSystem}
            setUnitSystem={onUnitSystemChange}
            mutcdFont={mutcdFont}
            setMutcdFont={setMutcdFont}
          />
        </Box>
        {isTrafficLayerVisible && <TrafficLayer />}
        {isTransitLayerVisible && <TransitLayer />}
        {isKmlLayerVisible && <KmlLayer />}
        <DirectionsService
          callback={directionsCallback}
          onLoad={directionsOnLoad}
          onUnmount={directionsUnmount}
          options={{
            origin,
            waypoints: formattedWaypoints,
            destination,
            travelMode,
            unitSystem,
            avoidHighways: isAvoidHighwaysEnabled,
            avoidTolls: isAvoidTollsEnabled,
          }}
        />
        <DirectionsRenderer
          options={{
            directions,
          }}
          onLoad={directionsRendererOnLoad}
          onUnmount={directionsRendererOnUnmount}
        />
      </GoogleMap>
    </motion.div>
  );
};
