import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";
import { MUTCDRectangleSign } from "./MUTCDRectangleSign";
import {
  formatDuration,
  formatImperialDistance,
  formatMetricDistance,
  formatDirections,
} from "/imports/utils";
import { Color, MUTCDFont } from "/imports/constants";

type MapDirectionsProps = {
  legs: google.maps.DirectionsLeg[] | undefined;
  unitSystem: google.maps.UnitSystem;
  mutcdFont: MUTCDFont;
};
export const MapDirections = (props: MapDirectionsProps) => {
  const { legs = [], unitSystem, mutcdFont } = props;

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
    <Accordion allowToggle defaultIndex={0}>
      <AccordionItem tabIndex={0}>
        <AccordionButton color={Color.WHITE} fontWeight="bold">
          Overview
        </AccordionButton>
        <AccordionPanel paddingLeft={0} paddingRight={0}>
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
                Total Duration <Text fontSize="smaller">(without traffic)</Text>
              </Text>
              <Text>{formattedDuration}</Text>
            </Box>
          </MUTCDRectangleSign>
        </AccordionPanel>
      </AccordionItem>
      {legs?.map((leg, i) => {
        const stepBeginningLabel = String.fromCharCode(i + 65);
        const stepEndLabel = i === 25 ? "AA" : String.fromCharCode(i + 66);
        return (
          <AccordionItem
            key={`Leg${stepBeginningLabel}to${stepEndLabel}`}
            tabIndex={i + 1}
          >
            <AccordionButton color={Color.WHITE} fontWeight="bold">
              Leg {stepBeginningLabel} to {stepEndLabel} ({leg.distance?.text},{" "}
              {leg.duration?.text})
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
                {leg.steps.map((step, i) => {
                  /** Instructions split up by spaces */
                  const formattedInstructions = formatDirections(
                    step.instructions
                  );
                  return (
                    <MUTCDRectangleSign key={`step${i}`} fontFamily={mutcdFont}>
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
                        <Box minWidth={140} textAlign="end" alignSelf="center">
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
  );
};
