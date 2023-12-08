import React, { useEffect } from "react";

export default function MatchingTuMetaDescription(props) {
  const { matching_description_with_tu_meta } = props;

  useEffect(() => {
  }, []);

  return (
    <div style={{ paddingLeft: 4 }}>
      <span style={{ color: "black" }}>{matching_description_with_tu_meta}</span>
    </div>
  );
}
