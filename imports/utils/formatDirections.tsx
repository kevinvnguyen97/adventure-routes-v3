import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  USRouteShield,
  IllinoisRouteShield,
  InterstateShield,
} from "/imports/ui/components";

export const formatDirections = (directionInstructions: string) => {
  const splitInstructions = directionInstructions.split(" ");
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
              const interstateNumber = text.replaceAll("US-", "");
              if (interstateNumber.includes("<div")) {
                const cleanedInterstateNumber = interstateNumber.replaceAll(
                  "<div",
                  ""
                );
                return `${renderToStaticMarkup(
                  <USRouteShield usRouteNumber={cleanedInterstateNumber} />
                )}`;
              }
              if (interstateNumber.includes(",")) {
                const cleanedInterstateNumber = interstateNumber.replaceAll(
                  ",",
                  ""
                );
                return `${renderToStaticMarkup(
                  <USRouteShield usRouteNumber={cleanedInterstateNumber} />
                )},`;
              }
              return renderToStaticMarkup(
                <USRouteShield usRouteNumber={interstateNumber} />
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
              <USRouteShield usRouteNumber={fixedInterstateString} />
            )}`;
          } else if (word.includes(",")) {
            const fixedInterstateString = word
              .replaceAll(",", "")
              .replaceAll(/\D/g, "");
            return `${renderToStaticMarkup(
              <USRouteShield usRouteNumber={fixedInterstateString} />
            )},`;
          } else {
            const cleanedWord = word.replaceAll(/\D/g, "");
            return renderToStaticMarkup(
              <USRouteShield usRouteNumber={cleanedWord} />
            );
          }
        }
      }
      if (word.includes("IL-")) {
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
              const interstateNumber = text.replaceAll("IL-", "");
              if (interstateNumber.includes("<div")) {
                const cleanedInterstateNumber = interstateNumber.replaceAll(
                  "<div",
                  ""
                );
                return `${renderToStaticMarkup(
                  <IllinoisRouteShield
                    illinoisRouteNumber={cleanedInterstateNumber}
                  />
                )}`;
              }
              if (interstateNumber.includes(",")) {
                const cleanedInterstateNumber = interstateNumber.replaceAll(
                  ",",
                  ""
                );
                return `${renderToStaticMarkup(
                  <IllinoisRouteShield
                    illinoisRouteNumber={cleanedInterstateNumber}
                  />
                )},`;
              }
              return renderToStaticMarkup(
                <IllinoisRouteShield illinoisRouteNumber={interstateNumber} />
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
              <IllinoisRouteShield illinoisRouteNumber={cleanedWord} />
            );
          }
        }
      }
      // Search for any term that includes I-, the interstate prefix
      if (
        (word.includes("I-") || word.includes("Interstate ")) &&
        !word.includes("RI-") &&
        !word.includes("MI-")
      ) {
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
            if (text.includes("I-") || text.includes("Interstate ")) {
              const interstateNumber = text
                .replaceAll("I-", "")
                .replaceAll("Interstate ", "");
              if (interstateNumber.includes("<div")) {
                const cleanedInterstateNumber = interstateNumber.replaceAll(
                  "<div",
                  ""
                );
                return `${renderToStaticMarkup(
                  <InterstateShield
                    interstateNumber={cleanedInterstateNumber}
                  />
                )}`;
              }
              if (interstateNumber.includes(",")) {
                const cleanedInterstateNumber = interstateNumber.replaceAll(
                  ",",
                  ""
                );
                return `${renderToStaticMarkup(
                  <InterstateShield
                    interstateNumber={cleanedInterstateNumber}
                  />
                )},`;
              }
              return renderToStaticMarkup(
                <InterstateShield interstateNumber={interstateNumber} />
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
              <InterstateShield interstateNumber={fixedInterstateString} />
            )}`;
          } else if (word.includes(",")) {
            const fixedInterstateString = word
              .replaceAll(",", "")
              .replaceAll(/\D/g, "");
            return `${renderToStaticMarkup(
              <InterstateShield interstateNumber={fixedInterstateString} />
            )},`;
          } else {
            const cleanedWord = word.replaceAll(/\D/g, "");
            return renderToStaticMarkup(
              <InterstateShield interstateNumber={cleanedWord} />
            );
          }
        }
      }
      return word;
    })
    .join(" ")
    .replaceAll(
      "Toll road",
      renderToStaticMarkup(
        <div
          style={{
            color: "black",
            padding: "1px",
            backgroundColor: "#FFCC00",
            width: "110px",
            textAlign: "center",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          TOLL ROAD
        </div>
      )
    );
  return formattedInstructions;
};
