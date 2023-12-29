import React from "react";
import ReactDOM from "react-dom";
import { Treemap } from "@ant-design/plots";
import { CircularProgress, Box } from "@mui/material";

const TreeMapComponent = (props) => {
  let { data, colorField, valueField, isLoading = false } = props;
  let cdata = {
    name: "root",
    children: [],
  };
  cdata.children = data;
  const config = {
    data: cdata,
    onReady: (plot) => {
      plot.on("element:click", (...args) => {
      });
    },
    label: {
      fill: "black",
      formatter: (text, datum, index, data) => {
        text = ""
        return text
      }

    },
    scale: {
      color: {
        range: [
          'gold',
          'yellow',
          '#ededed',
        ],
      },
    },
    colorField: colorField,
    valueField: valueField,
    interaction: {
      elementHighlight: true
    },
    state: {
      inactive: { opacity: 0.5 }
    },

    //   tooltip: {

    //     // title: (name, value) => {
    //     //   return name
    //     // },


    //     items: (originalItems) => {
    //       //     // process originalItems,

    //       let val = null;
    //       console.log(originalItems, "Testing")
    //       if (originalItems[0].value < 1000) {
    //         val = originalItems[0].value
    //       } else if (originalItems[0].value >= 1000 && originalItems[0].value < 1000000) {
    //         val = Math.round(originalItems[0].value / 1000).toLocaleString() + "K";
    //       } else if (originalItems[0].value >= 1000000) {
    //         val = Math.round(originalItems[0].value / 1000000).toLocaleString() + "M";

    //       }

    //       originalItems[0].value = val;

    //       return originalItems;
    //     }
    //   },
  };
  return isLoading ? <Box sx={{ display: 'flex', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
    <CircularProgress style={{ color: 'gold' }} disableShrink />
  </Box> : <Treemap {...config} />;
};

export default TreeMapComponent;