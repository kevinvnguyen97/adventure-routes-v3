import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import { MUTCDRectangleSign } from "./MUTCDRectangleSign";
import {
  formatDuration,
  formatImperialDistance,
  formatMetricDistance,
  formatDirections,
  getTotalDistance,
  getTotalDuration,
} from "/imports/utils";
import { Color, MUTCDFont, ROUTE_COLORS } from "/imports/constants";

type MapDirectionsProps = {
  routes: google.maps.DirectionsRoute[] | undefined;
  selectedRoutes: boolean[];
  setSelectedRoutes: (selectedRoutes: boolean[]) => void;
  unitSystem: google.maps.UnitSystem;
  mutcdFont: MUTCDFont;
  fitBounds: (boundPoints: google.maps.LatLng[]) => void;
};
export const MapDirections = (props: MapDirectionsProps) => {
  const {
    routes = [],
    fitBounds,
    selectedRoutes,
    setSelectedRoutes,
    unitSystem,
    mutcdFont,
  } = props;

  const onRouteSelect = (routeIndex: number) => {
    const newSelectedRoutes = selectedRoutes.map((route, i) =>
      i === routeIndex ? !route : route
    );
    setSelectedRoutes(newSelectedRoutes);
  };

  return (
    <Accordion allowToggle as={Box}>
      {routes.map(
        ({ legs = [], summary }, routeIndex) => {
          /** Total route distance in meters */
          const totalDistance = getTotalDistance(legs);
          /** Total route duration in seconds */
          const totalDuration = getTotalDuration(legs);
          /** Total route duration in traffic in seconds */
          const totalDurationInTraffic = getTotalDuration(legs, true);
          const formattedDuration = formatDuration(totalDuration);
          const formattedDurationInTraffic = formatDuration(
            totalDurationInTraffic
          );
          const formattedDistance =
            unitSystem === google.maps.UnitSystem.METRIC
              ? formatMetricDistance(totalDistance)
              : formatImperialDistance(totalDistance);
          const isRouteTolled = legs.some(({ steps }) =>
            steps.some(({ instructions }) => instructions.includes("Toll road"))
          );
          return (
            <AccordionItem
              border={0}
              width="100%"
              paddingBottom={1}
              key={summary}
              isDisabled={!selectedRoutes[routeIndex]}
            >
              <Box display="flex" gap={3}>
                <Checkbox
                  size="lg"
                  colorScheme="orange"
                  isChecked={selectedRoutes[routeIndex]}
                  onChange={() => onRouteSelect(routeIndex)}
                />
                <AccordionButton padding={0} border={0} display="flex">
                  <MUTCDRectangleSign
                    fontFamily={mutcdFont}
                    signColor={ROUTE_COLORS[routeIndex]}
                  >
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Text textAlign="left">
                          Directions via{" "}
                          <Box
                            display="inline"
                            dangerouslySetInnerHTML={{
                              __html: formatDirections(summary),
                            }}
                          />
                        </Text>
                        {isRouteTolled && (
                          <Box
                            bgColor={Color.MUTCD_YELLOW}
                            color={Color.BLACK}
                            padding={2}
                            borderRadius={5}
                            width={250}
                          >
                            THIS ROUTE HAS TOLLS
                          </Box>
                        )}
                      </Box>
                      <Box textAlign="right" minWidth={140}>
                        <Text>{formattedDistance}</Text>
                        {/* <Text>{formattedDuration}</Text> */}
                        <Text>
                          {formattedDurationInTraffic ?? formattedDuration}
                        </Text>
                      </Box>
                    </Box>
                  </MUTCDRectangleSign>
                </AccordionButton>
              </Box>
              <AccordionPanel>
                <Accordion allowToggle>
                  {legs.map(
                    (
                      { distance, duration, duration_in_traffic, steps },
                      legIndex
                    ) => {
                      const stepBeginningLabel = String.fromCharCode(
                        legIndex + 65
                      );
                      const stepEndLabel =
                        legIndex === 25
                          ? "AA"
                          : String.fromCharCode(legIndex + 66);
                      return (
                        <AccordionItem
                          key={`Leg${stepBeginningLabel}to${stepEndLabel}`}
                          tabIndex={legIndex + 1}
                        >
                          <AccordionButton
                            color={Color.WHITE}
                            fontWeight="bold"
                          >
                            Leg {stepBeginningLabel} to {stepEndLabel} (
                            {distance?.text},{" "}
                            {(duration_in_traffic ?? duration)?.text})
                          </AccordionButton>
                          <AccordionPanel paddingLeft={0} paddingRight={0}>
                            <Box display="flex" flexDirection="column" gap={1}>
                              {steps.map(
                                (
                                  {
                                    instructions,
                                    distance,
                                    duration,
                                    start_location,
                                    end_location,
                                  },
                                  stepIndex
                                ) => {
                                  /** Instructions split up by spaces */
                                  const formattedInstructions =
                                    formatDirections(instructions);
                                  const boundPoints = [
                                    start_location,
                                    end_location,
                                  ];
                                  return (
                                    <MUTCDRectangleSign
                                      key={`step${stepIndex}`}
                                      fontFamily={mutcdFont}
                                      signColor={ROUTE_COLORS[routeIndex]}
                                      onClick={() => fitBounds(boundPoints)}
                                    >
                                      <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                      >
                                        <Box>
                                          <Box
                                            dangerouslySetInnerHTML={{
                                              __html: formattedInstructions,
                                            }}
                                          />
                                        </Box>
                                        <Box
                                          minWidth={140}
                                          textAlign="end"
                                          alignSelf="center"
                                        >
                                          <Text>{distance?.text}</Text>
                                          <Text>{duration?.text}</Text>
                                        </Box>
                                      </Box>
                                    </MUTCDRectangleSign>
                                  );
                                }
                              )}
                            </Box>
                          </AccordionPanel>
                        </AccordionItem>
                      );
                    }
                  )}
                </Accordion>
              </AccordionPanel>
            </AccordionItem>
          );
        },
        { distances: [] as number[], durations: [] as number[] }
      )}
    </Accordion>
  );
};
