import { Paper, Box } from "@mui/material"
// import DashboardTooltipItems from "../../helpers/dashboardTooltipItems";
import InfoPopover from "./infoPopover-component";

export default function StatCard(props) {

  const { value, heading, infoKey } = props;

  return <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      "& > :not(style)": {
        width: "100%",
        height: 128,
      },
    }}
  >

    <Paper style={{ backgroundColor: "#111" }}>
      {" "}
      <p style={{ color: 'gold', display: "flex", justifyContent: "center", alignItems: 'center' }}>
        {heading}
        <InfoPopover color="gold" content={infoKey} /></p>
      <h2 style={{ color: "white" }}>{value}</h2>
    </Paper>
  </Box>
}