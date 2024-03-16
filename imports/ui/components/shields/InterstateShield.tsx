import React from "react";
import { Color } from "/imports/constants";

export const InterstateShield = (props: RouteShieldProps) => {
  const { routeNumber } = props;
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        height: "30px",
        verticalAlign: "middle",
        width: `${routeNumber.length > 2 ? "40" : "30"}px`,
        margin: "2px",
      }}
    >
      <img
        src={`/images/${
          routeNumber.length > 2
            ? "Interstate_Shield_Wide"
            : "Interstate_Shield"
        }.png`}
        height="30px"
        width={routeNumber.length > 2 ? "40px" : "30px"}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -45%)",
          color: Color.WHITE,
          fontFamily: `${
            routeNumber.length > 2 ? "Highway Gothic Narrow" : "Highway Gothic"
          } !important`,
          fontSize: "20px",
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
