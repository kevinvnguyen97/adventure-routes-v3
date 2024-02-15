import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";
import { renderToStaticMarkup } from "react-dom/server";
import { InterstateShield } from "./InterstateShield";
import { MUTCDRectangleSign } from "./MUTCDRectangleSign";
import {
  formatDuration,
  formatImperialDistance,
  formatMetricDistance,
} from "/imports/utils";
import { MUTCDFont } from "/imports/constants";

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
        <AccordionButton color="white" fontWeight="bold">
          Overview
        </AccordionButton>
        <AccordionPanel padding={0} margin={0}>
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
        const stepEndLabel = i > 24 ? "AA" : String.fromCharCode(i + 66);
        return (
          <AccordionItem
            key={`Leg${stepBeginningLabel}to${stepEndLabel}`}
            tabIndex={i + 1}
          >
            <AccordionButton color="white" fontWeight="bold">
              Leg {stepBeginningLabel} to {stepEndLabel} ({leg.distance?.text},{" "}
              {leg.duration?.text})
            </AccordionButton>
            <AccordionPanel>
              <Box display="flex" flexDirection="column" gap={1}>
                {leg.steps.map((step, i) => {
                  // Split up words by
                  const splitInstructions = step.instructions.split(" ");
                  const formattedInstructions = splitInstructions
                    .map((word) => {
                      if (word.includes("/")) {
                        const subcontents = word.split("/");
                        const formattedSubcontents = subcontents.map(
                          (subcontent) => {
                            if (subcontent.includes("I-")) {
                              let hasTag = false;
                              if (subcontent.includes("/b")) {
                                hasTag = true;
                              }
                              const interstateString = word.replaceAll(
                                /\D/g,
                                ""
                              );
                              const formattedInterstate = renderToStaticMarkup(
                                <span>
                                  <InterstateShield
                                    interstateNumber={interstateString}
                                  />
                                </span>
                              );
                              if (hasTag) {
                                return `${formattedInterstate}<`;
                              } else {
                                return `${formattedInterstate}`;
                              }
                            } else {
                              return subcontent;
                            }
                          }
                        );
                        return formattedSubcontents
                          .join("/")
                          .replaceAll("<,b>", "</b>");
                      } else if (word.includes("I-")) {
                        const interstateString = word.replaceAll(/\D/g, "");
                        const formattedInterstate = renderToStaticMarkup(
                          <InterstateShield
                            interstateNumber={interstateString}
                          />
                        );
                        return formattedInterstate;
                      } else {
                        return word;
                      }
                    })
                    .join(" ");
                  return (
                    <MUTCDRectangleSign key={`step${i}`} fontFamily={mutcdFont}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignSelf={
                          step.instructions.includes("I-") ? "start" : "center"
                        }
                      >
                        <Box
                          dangerouslySetInnerHTML={{
                            __html: formattedInstructions,
                          }}
                        />
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
