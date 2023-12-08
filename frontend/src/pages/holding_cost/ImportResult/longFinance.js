import React, { useEffect } from "react";
export default function LongFinance(props) {
  const { long_finance } = props;
  useEffect(() => {
  }, []);

  return (
    <div style={{ paddingLeft: 4 }}>
      <span style={{ color: "black" }}>{long_finance}</span>
    </div>
  );
}
