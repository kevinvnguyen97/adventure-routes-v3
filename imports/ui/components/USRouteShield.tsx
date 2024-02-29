import React from "react";

type USRouteShieldProps = {
  usRouteNumber: string;
};
export const USRouteShield = (props: USRouteShieldProps) => {
  const { usRouteNumber } = props;
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        height: "30px",
        verticalAlign: "middle",
        width: `${usRouteNumber.length > 2 ? "40" : "30"}px`,
      }}
    >
      <img
        src={`/images/${
          usRouteNumber.length > 2 ? "US_Route_Shield_Wide" : "US_Route_Shield"
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
          color: "black",
          fontFamily: `${
            usRouteNumber.length > 2
              ? "Highway Gothic Narrow"
              : "Highway Gothic"
          } !important`,
          fontSize: "24px",
          letterSpacing: "0.5px",
          textAlign: "center",
          fontWeight: "normal",
        }}
      >
        {usRouteNumber}
      </div>
    </div>
  );
};
