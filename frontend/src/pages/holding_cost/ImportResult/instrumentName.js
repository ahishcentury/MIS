export default function IntrumentName(props) {
  const { instrument_name_ } = props;
  return (
    <div style={{ paddingLeft: 4 }}>
      <span style={{ color: "black" }}>{instrument_name_}</span>
    </div>
  );
}
