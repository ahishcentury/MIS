import React, { useEffect } from "react";

export default function ShortFinance(props) {
  const { short_finance } = props;

  useEffect(() => {
  }, []);
  return (
    <div style={{ paddingLeft: 4 }}>
      <span style={{ color: "black" }}>{short_finance}</span>
    </div>
  );
}
