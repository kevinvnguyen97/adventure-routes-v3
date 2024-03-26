import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  USRouteShield,
  IllinoisRouteShield,
  InterstateShield,
  MichiganRouteShield,
  FloridaRouteShield,
  FloridaTurnpikeShield,
} from "/imports/ui/components/shields";
import { Color } from "/imports/constants";
import { IndianaRouteShield } from "../ui/components/shields/IndianaRouteShield";

export const formatDirections = (directionInstructions: string) => {
  const htmlToPlainText = (html: string) => {
    const tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = html;
    return tempDivElement.textContent || tempDivElement.innerText || "";
  };

  const renderRouteShield = (routeNumber: string) => {
    // Render Florida's Turnpike shield
    if (routeNumber.includes("Florida-Tpke")) {
      return renderToStaticMarkup(<FloridaTurnpikeShield />);
    }
    // Render Florida route shields
    if (routeNumber.includes("FL-")) {
      const cleanedRouteNumber = routeNumber.replaceAll("FL-", "");
      return renderToStaticMarkup(
        <FloridaRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    // Render Illinois route shields
    if (routeNumber.includes("IL-")) {
      const cleanedRouteNumber = routeNumber.replaceAll("IL-", "");
      return renderToStaticMarkup(
        <IllinoisRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    // Render Indiana route shields
    if (routeNumber.includes("IN-")) {
      const cleanedRouteNumber = routeNumber.replaceAll("IN-", "");
      return renderToStaticMarkup(
        <IndianaRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    // Render Michigan route shields
    if (routeNumber.includes("M-")) {
      const cleanedRouteNumber = routeNumber.replaceAll("M-", "");
      return renderToStaticMarkup(
        <MichiganRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    // Render US route shields
    if (routeNumber.includes("US-")) {
      const cleanedRouteNumber = routeNumber.replaceAll("US-", "");
      return renderToStaticMarkup(
        <USRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    // Render Interstate route shields
    if (
      routeNumber.includes("I-") &&
      !routeNumber.includes("MI-") &&
      !routeNumber.includes("WI-")
    ) {
      const cleanedRouteNumber = routeNumber
        .replaceAll("I-", "")
        .replaceAll(",", "");
      return renderToStaticMarkup(
        <InterstateShield routeNumber={cleanedRouteNumber} />
      );
    }
    return routeNumber;
  };

  const directionInstructionsNewLine = directionInstructions
    .replaceAll(`<div style="font-size:0.9em">`, " ")
    .replaceAll("</div>", "")
    .replaceAll("Interstate ", "I-")
    .replaceAll("US Hwy ", "US-")
    .replaceAll("Florida's Tpke", "Florida-Tpke")
    .replaceAll("Florida's Turnpike", "Florida-Tpke");
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
    .replaceAll("Toll road", "");
  if (simplifiedInstructions.includes("Toll road")) {
    return `${formattedInstructions}\n${renderToStaticMarkup(
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
    )}`;
  }
  return formattedInstructions;
};
