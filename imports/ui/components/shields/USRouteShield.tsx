import React from "react";
import { Color } from "/imports/constants";

export const USRouteShield = (props: RouteShieldProps) => {
  const { routeNumber } = props;
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        height: "30px",
        verticalAlign: "middle",
        width: `${routeNumber.length > 2 ? "40" : "30"}px`,
      }}
    >
      <img
        src={`/images/${
          routeNumber.length > 2 ? "US_Route_Shield_Wide" : "US_Route_Shield"
        }.png`}
        height="100%"
        width="100%"
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          color: Color.BLACK,
          fontFamily: `${
            routeNumber.length > 2 ? "Highway Gothic Narrow" : "Highway Gothic"
          } !important`,
          fontSize: "24px",
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
