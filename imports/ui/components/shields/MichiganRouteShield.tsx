import React from "react";
import { Color } from "/imports/constants";

export const MichiganRouteShield = (props: RouteShieldProps) => {
  const { routeNumber } = props;
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        height: "30px",
        verticalAlign: "bottom",
        width: `${routeNumber.length > 2 ? "40" : "30"}px`,
      }}
    >
      <img
        src={`/images/${
          routeNumber.length > 2
            ? "Michigan_Route_Shield_Wide"
            : "Michigan_Route_Shield"
        }.png`}
        height="100%"
        width="100%"
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -40%)`,
          color: Color.BLACK,
          fontFamily: "Highway Gothic",
          fontSize: "16px",
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
