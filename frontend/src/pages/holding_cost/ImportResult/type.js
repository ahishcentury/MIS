import React, { useEffect } from "react";

export default function Type(props) {
  const { type_ } = props;

  useEffect(() => {
  }, []);

  return (
    <div style={{ paddingLeft: 4 }}>
      <span style={{ color: "black" }}>{type_}</span>
    </div>
  );
}
