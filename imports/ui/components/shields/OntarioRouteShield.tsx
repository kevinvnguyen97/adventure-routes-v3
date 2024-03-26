import React from "react";
import { Color } from "/imports/constants";

export const OntarioRouteShield = (props: RouteShieldProps) => {
  const { routeNumber } = props;
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        verticalAlign: "middle",
        width: "35px",
      }}
    >
      <img src="/images/Ontario_Route_Shield.png" height="100%" width="100%" />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -35%)`,
          color: Color.BLACK,
          fontFamily: "Highway Gothic Condensed",
          fontSize: "26px",
          letterSpacing: "0.5px",
          textAlign: "center",
          fontWeight: "normal",
        }}
      >
        {routeNumber}
      </div>
    </div>
  );
};
