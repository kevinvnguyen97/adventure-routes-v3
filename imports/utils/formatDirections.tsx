import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  USRouteShield,
  IllinoisRouteShield,
  InterstateShield,
} from "/imports/ui/components/shields";
import { Color } from "/imports/constants";

export const formatDirections = (directionInstructions: string) => {
  const htmlToPlainText = (html: string) => {
    const tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = html;
    return tempDivElement.textContent || tempDivElement.innerText || "";
  };

  const renderRouteShield = (routeNumber: string) => {
    if (routeNumber.includes("IL-")) {
      const cleanedRouteNumber = routeNumber.replaceAll("IL-", "");
      return renderToStaticMarkup(
        <IllinoisRouteShield illinoisRouteNumber={cleanedRouteNumber} />
      );
    }
    if (routeNumber.includes("US-")) {
      const cleanedRouteNumber = routeNumber.replaceAll("US-", "");
      return renderToStaticMarkup(
        <USRouteShield usRouteNumber={cleanedRouteNumber} />
      );
    }
    if (
      routeNumber.includes("I-") &&
      !routeNumber.includes("MI-") &&
      !routeNumber.includes("WI-")
    ) {
      const cleanedRouteNumber = routeNumber
        .replaceAll("I-", "")
        .replaceAll(",", "");
      return renderToStaticMarkup(
        <InterstateShield interstateNumber={cleanedRouteNumber} />
      );
    }
    return routeNumber;
  };

  const directionInstructionsNewLine = directionInstructions
    .replaceAll(`<div style="font-size:0.9em">`, ", ")
    .replaceAll("</div>", "")
    .replaceAll("Interstate ", "I-");
  const simplifiedInstructions = htmlToPlainText(directionInstructionsNewLine);
  const splitInstructions = simplifiedInstructions.split(" ");
  const formattedInstructions = splitInstructions
    .map((word) => {
      // Handle splits. Usually for concurrencies
      if (word.includes("/")) {
        const subwords = word.split("/");

        const finalResult = subwords.map((subword) => {
          return renderRouteShield(subword);
        });

        return finalResult.join("/");
      }
      return renderRouteShield(word);
    })
    .join(" ")
    .replaceAll(
      "Toll road",
      renderToStaticMarkup(
        <div
          style={{
            backgroundColor: Color.MUTCD_YELLOW,
            color: Color.BLACK,
            borderRadius: "5px",
            padding: "5px",
            textAlign: "center",
            width: "150px",
            marginTop: "10px",
          }}
        >
          TOLL ROAD
        </div>
      )
    );
  return formattedInstructions;
};
