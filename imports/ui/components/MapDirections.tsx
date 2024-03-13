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
} from "/imports/utils";
import { Color, MUTCDFont, ROUTE_COLORS } from "/imports/constants";

type MapDirectionsProps = {
  routes: google.maps.DirectionsRoute[] | undefined;
  selectedRoutes: boolean[];
  setSelectedRoutes: (selectedRoutes: boolean[]) => void;
  unitSystem: google.maps.UnitSystem;
  mutcdFont: MUTCDFont;
};
export const MapDirections = (props: MapDirectionsProps) => {
  const {
    routes = [],
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
      {routes.map((route, routeIndex) => {
        /** Total route distance in meters */
        const { legs } = route;
        const totalDistance =
          legs
            ?.map(({ distance }) => distance?.value ?? 0)
            .reduce(
              (accumulatedDistance, legDistance) =>
                accumulatedDistance + legDistance
            ) ?? 0;
        /** Total route duration in seconds */
        const totalDuration =
          legs
            ?.map(({ duration }) => duration?.value ?? 0)
            .reduce(
              (accumulatedDuration, legDuration) =>
                accumulatedDuration + legDuration
            ) ?? 0;
        const formattedDuration = formatDuration(totalDuration);
        const formattedDistance =
          unitSystem === 0
            ? formatMetricDistance(totalDistance)
            : formatImperialDistance(totalDistance);
        return (
          <AccordionItem
            border={0}
            width="100%"
            paddingBottom={1}
            key={route.summary}
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
                    <Text textAlign="left">
                      Directions via{" "}
                      <Box
                        display="inline"
                        dangerouslySetInnerHTML={{
                          __html: formatDirections(route.summary),
                        }}
                      />
                    </Text>
                    <Box textAlign="right">
                      <Text>{formattedDistance}</Text>
                      <Text>{formattedDuration}</Text>
                    </Box>
                  </Box>
                </MUTCDRectangleSign>
              </AccordionButton>
            </Box>
            <AccordionPanel>
              <Accordion allowToggle>
                {route?.legs?.map((leg, legIndex) => {
                  const stepBeginningLabel = String.fromCharCode(legIndex + 65);
                  const stepEndLabel =
                    legIndex === 25 ? "AA" : String.fromCharCode(legIndex + 66);
                  return (
                    <AccordionItem
                      key={`Leg${stepBeginningLabel}to${stepEndLabel}`}
                      tabIndex={legIndex + 1}
                    >
                      <AccordionButton color={Color.WHITE} fontWeight="bold">
                        Leg {stepBeginningLabel} to {stepEndLabel} (
                        {leg.distance?.text}, {leg.duration?.text})
                      </AccordionButton>
                      <AccordionPanel paddingLeft={0} paddingRight={0}>
                        <Box display="flex" flexDirection="column" gap={1}>
                          {leg.steps.some((step) =>
                            step.instructions.includes("Toll road")
                          ) && (
                            <MUTCDRectangleSign signColor={Color.MUTCD_YELLOW}>
                              <Box textAlign="center">THIS ROUTE HAS TOLLS</Box>
                            </MUTCDRectangleSign>
                          )}
                          {leg.steps.map((step, stepIndex) => {
                            /** Instructions split up by spaces */
                            const formattedInstructions = formatDirections(
                              step.instructions
                            );
                            return (
                              <MUTCDRectangleSign
                                key={`step${stepIndex}`}
                                fontFamily={mutcdFont}
                                signColor={ROUTE_COLORS[routeIndex]}
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
                                    <Text>{step.distance?.text}</Text>
                                    <Text>{step.duration?.text}</Text>
                                  </Box>
                                </Box>
                              </MUTCDRectangleSign>
                            );
                          })}
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
