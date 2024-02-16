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
import {
  InterstateShield,
  IllinoisRouteShield,
  USRouteShield,
} from "/imports/ui/components";
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
                  /** Instructions split up by spaces */
                  const splitInstructions = step.instructions.split(" ");
                  const formattedInstructions = splitInstructions
                    .map((word) => {
                      if (word.includes("US-")) {
                        // If there are slashes / to denote multiple routes, split it up
                        if (word.includes("/")) {
                          // Strip unnecessary tags
                          const cleanedWord = word
                            .replaceAll("<wbr/>", "")
                            .replaceAll("<b>", "")
                            .replaceAll("</b>", "");
                          const splitText = cleanedWord.split("/");
                          // Iterate through each term that was split by /
                          const formattedSplitText = splitText.map((text) => {
                            if (text.includes("US-")) {
                              const interstateNumber = text.replaceAll(
                                "US-",
                                ""
                              );
                              if (interstateNumber.includes("<div")) {
                                const cleanedInterstateNumber =
                                  interstateNumber.replaceAll("<div", "");
                                return `${renderToStaticMarkup(
                                  <USRouteShield
                                    usRouteNumber={cleanedInterstateNumber}
                                  />
                                )}`;
                              }
                              if (interstateNumber.includes(",")) {
                                const cleanedInterstateNumber =
                                  interstateNumber.replaceAll(",", "");
                                return `${renderToStaticMarkup(
                                  <USRouteShield
                                    usRouteNumber={cleanedInterstateNumber}
                                  />
                                )},`;
                              }
                              return renderToStaticMarkup(
                                <USRouteShield
                                  usRouteNumber={interstateNumber}
                                />
                              );
                            } else {
                              return text;
                            }
                          });
                          return formattedSplitText.join("/");
                          return word;
                        } else {
                          if (word.includes("<b>")) {
                            const fixedInterstateString = word
                              .replaceAll("<b>", "")
                              .replaceAll(/\D/g, "");
                            return `<b>${renderToStaticMarkup(
                              <USRouteShield
                                usRouteNumber={fixedInterstateString}
                              />
                            )}`;
                          } else if (word.includes(",")) {
                            const fixedInterstateString = word
                              .replaceAll(",", "")
                              .replaceAll(/\D/g, "");
                            return `${renderToStaticMarkup(
                              <USRouteShield
                                usRouteNumber={fixedInterstateString}
                              />
                            )},`;
                          } else {
                            const cleanedWord = word.replaceAll(/\D/g, "");
                            return renderToStaticMarkup(
                              <USRouteShield usRouteNumber={cleanedWord} />
                            );
                          }
                        }
                      } else if (word.includes("IL-")) {
                        // If there are slashes / to denote multiple routes, split it up
                        if (word.includes("/")) {
                          // Strip unnecessary tags
                          const cleanedWord = word
                            .replaceAll("<wbr/>", "")
                            .replaceAll("<b>", "")
                            .replaceAll("</b>", "");
                          const splitText = cleanedWord.split("/");
                          // Iterate through each term that was split by /
                          const formattedSplitText = splitText.map((text) => {
                            if (text.includes("IL-")) {
                              const interstateNumber = text.replaceAll(
                                "IL-",
                                ""
                              );
                              if (interstateNumber.includes("<div")) {
                                const cleanedInterstateNumber =
                                  interstateNumber.replaceAll("<div", "");
                                return `${renderToStaticMarkup(
                                  <IllinoisRouteShield
                                    illinoisRouteNumber={
                                      cleanedInterstateNumber
                                    }
                                  />
                                )}`;
                              }
                              if (interstateNumber.includes(",")) {
                                const cleanedInterstateNumber =
                                  interstateNumber.replaceAll(",", "");
                                return `${renderToStaticMarkup(
                                  <IllinoisRouteShield
                                    illinoisRouteNumber={
                                      cleanedInterstateNumber
                                    }
                                  />
                                )},`;
                              }
                              return renderToStaticMarkup(
                                <IllinoisRouteShield
                                  illinoisRouteNumber={interstateNumber}
                                />
                              );
                            } else {
                              return text;
                            }
                          });
                          return formattedSplitText.join("/");
                        } else {
                          if (word.includes("<b>")) {
                            const fixedInterstateString = word
                              .replaceAll("<b>", "")
                              .replaceAll(/\D/g, "");
                            return `<b>${renderToStaticMarkup(
                              <IllinoisRouteShield
                                illinoisRouteNumber={fixedInterstateString}
                              />
                            )}`;
                          } else if (word.includes(",")) {
                            const fixedInterstateString = word
                              .replaceAll(",", "")
                              .replaceAll(/\D/g, "");
                            return `${renderToStaticMarkup(
                              <IllinoisRouteShield
                                illinoisRouteNumber={fixedInterstateString}
                              />
                            )},`;
                          } else {
                            const cleanedWord = word.replaceAll(/\D/g, "");
                            return renderToStaticMarkup(
                              <IllinoisRouteShield
                                illinoisRouteNumber={cleanedWord}
                              />
                            );
                          }
                        }
                      }
                      // Search for any term that includes I-, the interstate prefix
                      else if (word.includes("I-") && !word.includes("RI-")) {
                        // If there are slashes / to denote multiple routes, split it up
                        if (word.includes("/")) {
                          // Strip unnecessary tags
                          const cleanedWord = word
                            .replaceAll("<wbr/>", "")
                            .replaceAll("<b>", "")
                            .replaceAll("</b>", "");
                          const splitText = cleanedWord.split("/");
                          // Iterate through each term that was split by /
                          const formattedSplitText = splitText.map((text) => {
                            if (text.includes("I-")) {
                              const interstateNumber = text.replaceAll(
                                "I-",
                                ""
                              );
                              if (interstateNumber.includes("<div")) {
                                const cleanedInterstateNumber =
                                  interstateNumber.replaceAll("<div", "");
                                return `${renderToStaticMarkup(
                                  <InterstateShield
                                    interstateNumber={cleanedInterstateNumber}
                                  />
                                )}`;
                              }
                              if (interstateNumber.includes(",")) {
                                const cleanedInterstateNumber =
                                  interstateNumber.replaceAll(",", "");
                                return `${renderToStaticMarkup(
                                  <InterstateShield
                                    interstateNumber={cleanedInterstateNumber}
                                  />
                                )},`;
                              }
                              return renderToStaticMarkup(
                                <InterstateShield
                                  interstateNumber={interstateNumber}
                                />
                              );
                            } else {
                              return text;
                            }
                          });
                          return formattedSplitText.join("/");
                        } else {
                          if (word.includes("<b>")) {
                            const fixedInterstateString = word
                              .replaceAll("<b>", "")
                              .replaceAll(/\D/g, "");
                            return `<b>${renderToStaticMarkup(
                              <InterstateShield
                                interstateNumber={fixedInterstateString}
                              />
                            )}`;
                          } else if (word.includes(",")) {
                            const fixedInterstateString = word
                              .replaceAll(",", "")
                              .replaceAll(/\D/g, "");
                            return `${renderToStaticMarkup(
                              <InterstateShield
                                interstateNumber={fixedInterstateString}
                              />
                            )},`;
                          } else {
                            const cleanedWord = word.replaceAll(/\D/g, "");
                            return renderToStaticMarkup(
                              <InterstateShield
                                interstateNumber={cleanedWord}
                              />
                            );
                          }
                        }
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
