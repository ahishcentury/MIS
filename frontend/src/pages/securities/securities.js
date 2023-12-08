import { useContext, useRef, useState, useEffect, createContext } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Table, Space } from 'antd';
import { Box, Button, Paper, Dialog, DialogContent, InputLabel, Stack, DialogTitle } from "@mui/material";
import { CURRENCIES } from "../currencies";
import { GET_SYMBOLS, IMPORT_SECURITIES_URL } from "../../helper/apiString";
// import { CREATE_SECURITY_URL, GET_SECURITIES_URL, GET_SYMBOLS, IMPORT_SECURITIES_URL } from "../../../helpers/superAdminApiStrings";
import axios from "axios";
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import AppContext from "../../AppContext";
// import AddSecurityDialog from "./addSecurityDialog";


export default function Securities(props) {

  const [addSecurityDialogOpen, setAddSecurityDialogOpen] = useState(false);
  const [importDialogVisible, setImportDialogVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [symbol, setSymbol] = useState();

  function getSymbol() {
    setIsLoading(true);
    axios.get(GET_SYMBOLS).then((res) => {
      setSymbol(res.data);
      setIsLoading(false);
    }).catch((err) => {
      console.log(err.message);
    });
  }

  // function getSecurities() {
  //   setIsLoading(true);
  //   axios.get(GET_SECURITIES_URL).then(res => {
  //     setIsLoading(false);
  //     setItems(res.data);
  //   }).catch(err => {
  //     setIsLoading(false);
  //     console.log(err);
  //   })
  // }

  const context = useContext(AppContext);

  function showImportDialog() {
    setImportDialogVisible(true);
  }

  function hideImportDialog() {
    setImportDialogVisible(false);
  }

  function showAddSecurityDialog() {
    setAddSecurityDialogOpen(true);
  }

  function closeAddSecurityDialog() {
    setAddSecurityDialogOpen(false);
  }

  useEffect(() => {
    // if (items.length == 0)
    //   getSecurities();
    getSymbol();
  }, [])

  const columns = [
    { title: "Name", dataIndex: "symbolName" },
    { title: "Path", dataIndex: "path", render: (x) => <Space style={{ width: 150 }}>{x}</Space> },
    { title: "Description", dataIndex: "description", render: (x) => <Space style={{ width: 300 }}>{x}</Space> },
    { title: "Sector", dataIndex: "sector" },
    { title: "Min Lot Size", dataIndex: "min", render: (x) => <Space style={{ width: 100 }}>{x.toLocaleString()}</Space> },
    { title: "Max Lot Size", dataIndex: "max", render: (x) => <Space style={{ width: 100 }}>{x.toLocaleString()}</Space> },
    { title: "Step Interval", dataIndex: "step", render: (x) => <Space style={{ width: 100 }}>{x.toLocaleString()}</Space> },
    { title: "Position Limit", dataIndex: "limit", render: (x) => <Space style={{ width: 100 }}>{x.toLocaleString()}</Space> },
    { title: "Stop Level", dataIndex: "stopLevel" },
    { title: "Base Currency", dataIndex: "baseCurrency" },
    { title: "Profit Currency", dataIndex: "profitCurrency" },
    { title: "Margin Currency", dataIndex: "marginCurrency" },
    { title: "Commission Fee", dataIndex: "commission" },
    { title: "Spread Fee", dataIndex: "spread" },
    { title: "Margin", dataIndex: "margin" },
    { title: "Spread Def", dataIndex: "spreadDef" },
    { title: "Contract Size", dataIndex: "contractSize" },
    { title: "Swap Short", dataIndex: "swapShort" },
    { title: "Swap Long", dataIndex: "swapLong" },

  ]

  return <Box sx={{ position: 'relative' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', paddingLeft: 4, paddingRight: 4 }}>
      <Box>
        <h1>Securities</h1>

      </Box>
      <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button variant={'contained'} onClick={showAddSecurityDialog}>Add Security</Button>
        <Button variant={'contained'} onClick={showImportDialog}>Import Security(s)</Button>
      </Box>
    </Box>

    <Table dataSource={symbol} columns={columns} loading={isLoading} />
    {/* <AddSecurityDialog open={addSecurityDialogOpen} onClose={closeAddSecurityDialog} onAddSuccess={() => { 'SUCCESS' }} /> */}

    <Dialog maxWidth={"xl"} open={importDialogVisible} fullWidth>
      <DialogTitle>Import Security</DialogTitle>
      <DialogContent>
        <ImportDialogContent />
      </DialogContent>
    </Dialog>
  </Box>;


  function ImportDialogContent() {

    const [file, setFile] = useState(null);
    const [importedSecurities, setImportedSecurities] = useState([]);


    function submit() {
      if (importedSecurities.length == 0)
        return alert("Select a csv file with atleast 1 data");

      let temp = importedSecurities;
      temp.pop();

      axios.post(IMPORT_SECURITIES_URL, { securities: temp })
        .then(res => {
          alert("Imported!");
          setImportDialogVisible(false);
          setImportedSecurities([]);
        }).catch(err => {
          console.log(err.message);
        });
    }

    function onFileChange(e) {

      const f = e.target.files[0];


      if (f.type === "text/csv") {
        let reader = new FileReader();
        reader.onload = function () {
          setImportedSecurities(getJSON(reader.result));
        }

        reader.onerror = function () {
          console.log(reader.error);
        };
        reader.readAsText(f);
      } else {
        return alert("Only csv files allowed");
      }


    }

    function getJSON(csv) {

      var lines = csv.split("\n");

      var result = [];

      // NOTE: If your columns contain commas in their values, you'll need
      // to deal with those before doing the next step 
      // (you might convert them to &&& or something, then covert them back later)
      // jsfiddle showing the issue https://jsfiddle.net/
      var headers = lines[0].split(",");

      for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }

        result.push(obj);

      }

      //return result; //JavaScript object
      return result; //JSON
    }

    return <>
      <Box>

        <InputLabel >Select csv file</InputLabel>

        <input onChange={onFileChange} accept=".csv" type="file" />
        <br />
        <br />
        <TableContainer component={Paper} variant={'outlined'}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Security</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Sector</TableCell>
                <TableCell>Min Lot Size</TableCell>
                <TableCell>Max Lot Size</TableCell>
                <TableCell>Step Interval</TableCell>
                <TableCell>Position Limit</TableCell>
                <TableCell>Limit and Stop Level</TableCell>
                <TableCell>Base Currency</TableCell>
                <TableCell>Margin Currency</TableCell>
                <TableCell>Commission Fee</TableCell>
                <TableCell>Spread Fee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {symbol.map(s => {
                return <TableRow>
                  <TableCell>{s["symbolName"]}</TableCell>

                </TableRow>
              })}
            </TableBody>
          </Table>

        </TableContainer>
        <br />
        <Stack direction="row" spacing={2}>
          <Button fullWidth variant="contained" diabled={importedSecurities.length === 0 ? true : false} onClick={submit}>Submit</Button>
          <Button fullWidth variant="outlined" onClick={hideImportDialog}>Cancel</Button>
        </Stack>


      </Box>
    </>
  }

  // function SecuritiesList() {
  //   const [securities, setSecurities] = useState([]);
  //   const [isLoading, setIsLoading] = useState(false);


  //   useEffect(() => {
  //     getSecurities();
  //   }, [])

  //   function getSecurities() {
  //     setIsLoading(true);
  //     axios.get(GET_SECURITIES_URL).then(res => {
  //       setIsLoading(false);
  //       setSecurities(res.data);
  //     }).catch(err => {
  //       setIsLoading(false);
  //       console.log(err);
  //     })
  //   }

  //   return <Box sx={{ height: '100vh' }}>
  //     <DataGrid sx={{ border: 'none' }}
  //       components={{
  //         LoadingOverlay: LinearProgress,
  //         NoRowsOverlay: NoRowsOverlay
  //       }}
  //       loading={isLoading}


  //       getRowId={(row) => JSON.stringify(row)}
  //       rows={securities}
  //       checkboxSelection
  //       columns={[
  //         { field: 'symbolName', flex: 1, headerName: "Symbol Name", renderCell: (p => { return p.row.symbolName }) },
  //         { field: 'path', flex: 1, headerName: "Path", renderCell: (p => { return p.row.path }) },
  //         { field: 'description', flex: 1, headerName: "Description", renderCell: (p => { return p.row.description }) },
  //         { field: 'sector', flex: 1, headerName: "Sector", renderCell: (p => { return p.row.sector }) },

  //         { field: 'min', flex: 1, headerName: "Min Lot Size", renderCell: (p => { return p.row.min }) },
  //         { field: 'max', flex: 1, headerName: "Max Lot Size", renderCell: (p => { return p.row.max }) }]}
  //     />
  //   </Box>

  // }



}