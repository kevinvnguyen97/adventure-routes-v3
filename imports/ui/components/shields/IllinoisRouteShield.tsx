import React from "react";
import { Color } from "/imports/constants";

type IllinoisRouteShieldProps = {
  illinoisRouteNumber: string;
};
export const IllinoisRouteShield = (props: IllinoisRouteShieldProps) => {
  const { illinoisRouteNumber } = props;
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        height: "30px",
        verticalAlign: "bottom",
        width: `${illinoisRouteNumber.length > 2 ? "40" : "30"}px`,
      }}
    >
      <img
        src={`/images/${
          illinoisRouteNumber.length > 2
            ? "Illinois_Route_Shield_Wide"
            : "Illinois_Route_Shield"
        }.png`}
        height="100%"
        width="100%"
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -35%)`,
          color: Color.BLACK,
          fontFamily: "Highway Gothic",
          fontSize: "20px",
          letterSpacing: "0.5px",
          textAlign: "center",
          fontWeight: "normal",
        }}
      >
        {illinoisRouteNumber}
      </div>
    </div>
  );
};
