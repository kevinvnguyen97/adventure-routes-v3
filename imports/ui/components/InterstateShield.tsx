import React from "react";

type InterstateShieldProps = {
  interstateNumber: string;
};
export const InterstateShield = (props: InterstateShieldProps) => {
  const { interstateNumber } = props;
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        height: "30px",
        verticalAlign: "middle",
        width: `${interstateNumber.length > 2 ? "40" : "30"}px`,
        userSelect: "none",
      }}
    >
      <img
        src={`/images/${
          interstateNumber.length > 2
            ? "Interstate_Shield_Wide"
            : "Interstate_Shield"
        }.png`}
        height="30px"
        width={interstateNumber.length > 2 ? "40px" : "30px"}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -45%)",
          color: "white",
          fontFamily: `${
            interstateNumber.length > 2
              ? "HighwayGothicNarrow"
              : "HighwayGothic"
          } !important`,
          fontSize: "20px",
          letterSpacing: "0.5px",
          textAlign: "center",
          fontWeight: "normal",
        }}
      >
        {interstateNumber}
      </div>
    </div>
  );
};
