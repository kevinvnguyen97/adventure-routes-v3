import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  USRouteShield,
  IllinoisRouteShield,
  InterstateShield,
  MichiganRouteShield,
  FloridaRouteShield,
  FloridaTurnpikeShield,
  OntarioRouteShield,
  HawaiiRouteShield,
  WisconsinRouteShield,
  CaliforniaRouteShield,
} from "/imports/ui/components/shields";
import { Color } from "/imports/constants";
import { IndianaRouteShield } from "../ui/components/shields/IndianaRouteShield";

export const formatDirections = (directionInstructions: string) => {
  const renderRouteShield = (term: string) => {
    if (term.includes("CA-")) {
      const cleanedRouteNumber = term.replaceAll("CA-", "");
      return renderToStaticMarkup(
        <CaliforniaRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    // Render Florida's Turnpike shield
    if (term.includes("Florida-Tpke")) {
      return renderToStaticMarkup(<FloridaTurnpikeShield />);
    }
    // Render Florida route shields
    if (term.includes("FL-")) {
      const cleanedRouteNumber = term.replaceAll("FL-", "");
      return renderToStaticMarkup(
        <FloridaRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    // Render Hawaii route shields
    if (term.includes("HI-")) {
      const cleanedRouteNumber = term.replaceAll("HI-", "");
      return renderToStaticMarkup(
        <HawaiiRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    // Render Illinois route shields
    if (term.includes("IL-")) {
      const cleanedRouteNumber = term.replaceAll("IL-", "");
      return renderToStaticMarkup(
        <IllinoisRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    // Render Indiana route shields
    if (term.includes("IN-")) {
      const cleanedRouteNumber = term.replaceAll("IN-", "");
      return renderToStaticMarkup(
        <IndianaRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    // Render Michigan route shields
    if (term.includes("M-") && !term.includes("NM-")) {
      const cleanedRouteNumber = term.replaceAll("M-", "");
      return renderToStaticMarkup(
        <MichiganRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    // Render Ontario route shields
    if (term.includes("ON-")) {
      const cleanedRouteNumber = term.replaceAll("ON-", "");
      return renderToStaticMarkup(
        <OntarioRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    // Render US route shields
    if (term.includes("US-")) {
      const cleanedRouteNumber = term.replaceAll("US-", "");
      return renderToStaticMarkup(
        <USRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    if (term.includes("WI-")) {
      const cleanedRouteNumber = term.replaceAll("WI-", "");
      return renderToStaticMarkup(
        <WisconsinRouteShield routeNumber={cleanedRouteNumber} />
      );
    }
    // Render Interstate route shields
    if (
      term.includes("I-") &&
      !term.includes("MI-") &&
      !term.includes("WI-") &&
      !term.includes("HI-")
    ) {
      const cleanedRouteNumber = term
        .replaceAll("I-", "")
        .replaceAll("H-", "H")
        .replaceAll(",", "")
        .replaceAll("BL", "");
      const isBusinessRoute = term.includes("BL") || term.includes("BUS");
      return renderToStaticMarkup(
        <InterstateShield
          routeNumber={cleanedRouteNumber}
          isBusinessRoute={isBusinessRoute}
        />
      );
    }
    return term;
  };

  const directionInstructionsNewLine = directionInstructions
    // Abbreviate routes for sign replacements
    .replaceAll("Interstate ", "I-")
    .replaceAll("US Hwy ", "US-")
    .replaceAll("U. S. Hwy ", "US-")
    .replaceAll("US ", "US-")
    .replaceAll("Florida's Tpke", "Florida-Tpke")
    .replaceAll("Florida's Turnpike", "Florida-Tpke")
    // Add spaces to html tags so that they are properly split
    .replaceAll("</b>", " </b>")
    .replaceAll("<b>", "<b> ")
    .replaceAll("<div", " <div")
    .replaceAll("</div>", " </div>")
    .replaceAll("<wbr/>", " <wbr/> ")
    .replaceAll("E/", "E / ")
    .replaceAll("W/", "W / ")
    .replaceAll("N/", "N / ")
    .replaceAll("S/", "S / ");
  const splitInstructions = directionInstructionsNewLine.split(" ");
  const formattedInstructions = splitInstructions
    .map((word) => renderRouteShield(word))
    .join(" ")
    .replaceAll("Toll road", "");
  if (directionInstructionsNewLine.includes("Toll road")) {
    return `${formattedInstructions}\n${renderToStaticMarkup(
      <div
        style={{
          backgroundColor: Color.MUTCD_YELLOW,
          color: Color.BLACK,
          borderRadius: "5px",
          padding: "5px",
          textAlign: "center",
          width: "130px",
          marginTop: "10px",
        }}
      >
        TOLL ROAD
      </div>
    )}`;
  }
  return formattedInstructions;
};
