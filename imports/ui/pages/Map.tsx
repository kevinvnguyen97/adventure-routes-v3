import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
  TrafficLayer,
  TransitLayer,
  KmlLayer,
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
import { SECRETS, MUTCDFont, ROUTE_COLORS } from "/imports/constants";
import { TOAST_PRESET } from "/imports/constants/toast";

const MAP_CONTAINER_STYLE: CSSProperties = {
  width: "100%",
  height: "calc(100vh - 84px)",
};

export const Map = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: SECRETS.public.oauth.googleMapsApiKey,
    libraries: ["visualization"],
  });
  const toast = useToast();
  const { id } = useParams();
  const { data: adventureRoutes } = useAdventureRoutesForUser();
  const adventureRoute = adventureRoutes.find(({ _id }) => id === _id);

  const renderCount = useRef(0);
  const map = useRef<GoogleMap | null>(null);

  const { route } = adventureRoute || {};
  const { origin = "", waypoints = [], destination = "" } = route || {};

  const formattedWaypoints: google.maps.DirectionsWaypoint[] = waypoints.map(
    (waypoint) => ({ location: waypoint, stopover: true })
  );

  const [selectedRoutes, setSelectedRoutes] = useState<boolean[]>([]);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(
    "DRIVING" as google.maps.TravelMode
  );
  const [unitSystem, setUnitSystem] = useState<google.maps.UnitSystem>(1);
  const [isInfoButtonEnabled, setIsInfoButtonEnabled] = useState(false);
  const [isTrafficLayerVisible, setIsTrafficLayerVisible] = useState(false);
  const [isTransitLayerVisible, setIsTransitLayerVisible] = useState(false);
  const [isKmlLayerVisible, setIsKmlLayerVisible] = useState(false);
  const [isAvoidHighwaysEnabled, setIsAvoidHighwaysEnabled] = useState(false);
  const [isAvoidTollsEnabled, setIsAvoidTollsEnabled] = useState(false);
  const [isAvoidFerriesEnabled, setIsAvoidFerriesEnabled] = useState(false);
  const [allowRouteAlternatives, setAllowRouteAlternatives] = useState(true);
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
  const fitBounds = (boundPoints: google.maps.LatLng[]) => {
    const bounds = new google.maps.LatLngBounds();
    boundPoints.forEach((boundPoint) => {
      bounds.extend(boundPoint);
    });
    map.current?.state.map?.fitBounds(bounds);
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

      if (renderCount.current === 0) {
        if (result && status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
          const initialSelectedRoutes = result.routes.map(() => true);
          setSelectedRoutes(initialSelectedRoutes);
          setIsInfoButtonEnabled(true);
        } else {
          switch (status) {
            case google.maps.DirectionsStatus.INVALID_REQUEST:
              toast({
                ...TOAST_PRESET,
                title: "Invalid request",
                description: "Route cannot be rendered",
                status: "error",
              });
              break;
            case google.maps.DirectionsStatus.NOT_FOUND:
              toast({
                ...TOAST_PRESET,
                title: "Not found",
                description: "At least one waypoint is not found",
                status: "error",
              });
              break;
            case google.maps.DirectionsStatus.ZERO_RESULTS:
              toast({
                ...TOAST_PRESET,
                title: "No valid route",
                description:
                  "There are no possible routes between the given locations",
                status: "error",
              });
              break;
            /** google.maps.DirectionsStatus enum did not include this */
            /** @ts-ignore */
            case "MAX_ROUTE_LENGTH_EXCEEDED":
              if (result?.routes?.length ?? 0 <= 1) {
                toast({
                  ...TOAST_PRESET,
                  title: "Route length exceeded",
                  description:
                    "Total length of combined routes is too long for the map to render",
                  status: "error",
                });
                break;
              }
              setAllowRouteAlternatives(false);
              renderCount.current = -1;
              break;
          }
        }
        renderCount.current++;
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
        ref={(mapRef) => (map.current = mapRef)}
      >
        <Box position="absolute" left="179px" top="10px">
          <AdventureRouteInfo
            adventureRoute={adventureRoute}
            directions={directions}
            fitBounds={fitBounds}
            selectedRoutes={selectedRoutes}
            setSelectedRoutes={setSelectedRoutes}
            travelMode={travelMode}
            setTravelMode={onTravelModeChange}
            isInfoButtonEnabled={isInfoButtonEnabled}
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
            avoidFerries: isAvoidFerriesEnabled,
            provideRouteAlternatives: allowRouteAlternatives,
            drivingOptions: {
              departureTime: new Date(),
              trafficModel: google.maps.TrafficModel.PESSIMISTIC,
            },
            region: "us",
          }}
        />
        {directions?.routes.map(
          (_, i) =>
            selectedRoutes[i] && (
              <DirectionsRenderer
                options={{
                  directions,
                  polylineOptions: {
                    strokeColor: ROUTE_COLORS[i],
                    strokeOpacity: 0.6,
                  },
                  routeIndex: i,
                }}
                onLoad={directionsRendererOnLoad}
                onUnmount={directionsRendererOnUnmount}
              />
            )
        )}
      </GoogleMap>
    </motion.div>
  );
};
