import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Box, Text } from "@chakra-ui/react";
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
import { GOOGLE_SECRETS } from "/imports/constants";

const MAP_CONTAINER_STYLE: CSSProperties = {
  width: "100%",
  height: "calc(100vh - 84px)",
};

export const Map = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_SECRETS.public.oauth.googleMapsApiKey,
  });
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
        status === google.maps.DirectionsStatus.OK &&
        renderCount.current === 0
      ) {
        renderCount.current++;
        setDirections(result);
      }
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
    return <Text>Adventure route not found.</Text>;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box position="relative">
        <Box position="absolute" left="179px" top="10px">
          <AdventureRouteInfo
            adventureRoute={adventureRoute}
            directions={directions}
          />
        </Box>
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <DirectionsService
            callback={directionsCallback}
            onLoad={directionsOnLoad}
            onUnmount={directionsUnmount}
            options={{
              origin,
              waypoints: formattedWaypoints,
              destination,
              travelMode: google.maps.TravelMode.DRIVING,
            }}
          />
          <DirectionsRenderer
            options={{ directions }}
            onLoad={directionsRendererOnLoad}
            onUnmount={directionsRendererOnUnmount}
          />
        </GoogleMap>
      </Box>
    </motion.div>
  );
};
