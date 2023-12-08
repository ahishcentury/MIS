import React, { useEffect } from "react";

export default function MatchingSymbolWithTuMeta(props) {
  const { matching_symbol_with_tu_meta } = props;

  useEffect(() => {
  }, []);

  return (
    <div style={{ paddingLeft: 4 }}>
      <span style={{ color: "black" }}>{matching_symbol_with_tu_meta}</span>
    </div>
  );
}
