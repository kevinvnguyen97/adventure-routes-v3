import React from "react";
import { Color } from "/imports/constants";

type InterstateShieldProps = RouteShieldProps & {
  isBusinessRoute?: boolean;
};
export const InterstateShield = (props: InterstateShieldProps) => {
  const { routeNumber, isBusinessRoute } = props;
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
            ? isBusinessRoute
              ? "Interstate_Business_Loop_Shield_Wide"
              : "Interstate_Shield_Wide"
            : isBusinessRoute
            ? "Interstate_Business_Loop_Shield"
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
            routeNumber.length > 3
              ? "Highway Gothic Condensed"
              : routeNumber.length > 2
              ? "Highway Gothic Narrow"
              : "Highway Gothic"
          } !important`,
          fontSize: "18px",
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
