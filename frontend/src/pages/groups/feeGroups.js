import { useContext, useRef, useState, useEffect, createContext } from "react";
import { Table, Space } from "antd";
import { Box, Select, TableContainer, TableHead, LinearProgress, TableBody, TableRow, TableColumn, TableCell, Slider, FormHelperText, Tabs, Tab, Stepper, Step, StepLabel, Button, Paper, Container, Grid, Divider, TextField, Typography, Dialog, DialogActions, DialogContent, CircularProgress, MenuItem, FormControl, InputLabel, ToggleButtonGroup, ToggleButton, Stack, DialogTitle, Chip } from "@mui/material";
import { CURRENCIES } from "../currencies";
import { GET_GROUPS, GET_GROUP_SYMBOL_CONFIGURATION, GET_GROUP_COMMISSION_CONFIGURATION } from "../../helper/apiString";
import axios from 'axios';
import AppContext from "../../AppContext";
import { DataGrid } from "@mui/x-data-grid";

export default function FeeGroups(props) {

  const [groupFormVisible, setGroupFormVisible] = useState(false);
  const context = useContext(AppContext);


  function showAddGroupForm() {
    setGroupFormVisible(true);
  }

  function hideAddGroupForm() {
    setGroupFormVisible(false);
  }

  return <Box sx={{ position: 'relative' }}>
    <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', width: 'fit-content', position: 'absolute', bottom: 12, left: 12, zIndex: 10 }}>

      <Button variant={'contained'} size="small" onClick={showAddGroupForm}>Create New</Button>

    </Box>
    <GroupsList />
    <Dialog maxWidth={"xl"} open={groupFormVisible} fullScreen>

      <DialogContent>
        <CreateGroupForm />
      </DialogContent>
    </Dialog>


  </Box>;




  function GroupsList() {
    const [groups, setGroups] = useState([]);
    const [symbolsOfGroup, setSymbolsOfGroup] = useState([]);
    const [commissionOfGroup, setCommissionOfGroup] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSymbolLoading, setIsSymbolLoading] = useState(false);
    const [isCommissionLoading, setIsCommissionLoading] = useState(false);
    const [symbolViewDetails, setSymbolViewDetails] = useState(false);
    const [commissionViewDetails, setCommissionViewDetails] = useState(false);
    const [noDataFoundDialog, setNoDataFoundDialog] = useState(false);

    function getGroups() {
      setIsLoading(true);
      axios.get(GET_GROUPS).then((res) => {
        setGroups(res.data);
        setIsLoading(false);
      }).catch((err) => {
        console.log(err.message);
      });
    }

    function getSymbolOfGroup(groupName) {
      setIsSymbolLoading(true);
      axios.get(GET_GROUP_SYMBOL_CONFIGURATION + "/" + groupName.split("\\")[1]).then((res) => {
        setSymbolsOfGroup(res.data);
        setSymbolViewDetails(true);
        setIsSymbolLoading(false);
        if (res.data.length == 0) {
          setNoDataFoundDialog(true)
        }
      }).catch((err) => {
        console.log(err.message);
      });
    }
    function getCommissionOfGroup(groupName) {
      setIsSymbolLoading(true);
      console.log(groupName.split("\\")[1])
      axios.get(GET_GROUP_COMMISSION_CONFIGURATION + "/" + groupName.split("\\")[1]).then((res) => {
        setCommissionOfGroup(res.data);
        setCommissionViewDetails(true);
        setIsCommissionLoading(false);
        if (res.data.length == 0) {
          setNoDataFoundDialog(true)
        }
      }).catch((err) => {
        console.log(err.message);
      });
    }
    useEffect(() => {
      getGroups();
    }, []);

    let columns = [
      { title: "Group Name", dataIndex: "groupName" },
      { title: "Environment Type", dataIndex: "envType", render: (x) => <Space style={{ width: 150 }}>{x}</Space> },
      { title: "Currency", dataIndex: "currency" },
      { title: "Platform", dataIndex: "platfrom" },
      { title: "Leverage", dataIndex: "leverage" },
      { title: "Margin Call Level", dataIndex: "maringCall" },
      { title: "Margin Stopup", dataIndex: "marginStopUp" },
      { title: "Margin Mode", dataIndex: "maringMode" },
      {
        title: "Action",
        render: (text, record) => (
          <Box sx={{ width: "100%" }}>
            <Button variant="contained" onClick={() => { getSymbolOfGroup(record["groupName"]); }}>
              {"View Symbol"}
            </Button>
            {!isSymbolLoading && symbolsOfGroup.length != 0 && <SymbolsDetailView symbolViewDetails={symbolViewDetails} setSymbolViewDetails={setSymbolViewDetails} symbolsOfGroup={symbolsOfGroup} />}
            {noDataFoundDialog && <NoDataFoundDialog noDataFoundDialog={noDataFoundDialog} setNoDataFoundDialog={setNoDataFoundDialog}></NoDataFoundDialog>}
            <Button variant="contained" onClick={() => { getCommissionOfGroup(record["groupName"]) }}>
              {"View Commission"}
            </Button>
            {!isCommissionLoading && commissionOfGroup.length != 0 && <CommissionDetailView commissionViewDetails={commissionViewDetails} setCommissionViewDetails={setCommissionViewDetails} commissionOfGroup={commissionOfGroup} />}
            {noDataFoundDialog && <NoDataFoundDialog noDataFoundDialog={noDataFoundDialog} setNoDataFoundDialog={setNoDataFoundDialog}></NoDataFoundDialog>}
          </Box>
        ),
      }
    ];


    return <Box sx={{ height: '100vh' }}>
      <Box sx={{ paddingLeft: 4 }}>
        <h1>Fee Groups</h1>
      </Box>
      <Table dataSource={groups} columns={columns} loading={isLoading} />
    </Box>;
  }


  function SymbolsDetailView(props) {
    const { symbolViewDetails, setSymbolViewDetails, symbolsOfGroup } = props;
    const handleClose = () => {
      setSymbolViewDetails(false);
    };
    return <>
      <Dialog maxWidth={'xl'} onClose={handleClose}
        open={symbolViewDetails}>
        <DialogTitle><b style={{ padding: "10px" }}>Symbols of Group &#40;{symbolsOfGroup[0]["groupName"]}&#41;</b></DialogTitle>
        <DialogContent>
          <Box sx={{ height: '400px' }}>
            <TableContainer>
              <TableHead>
                <TableRow>
                  <TableCell> SR.  </TableCell>
                  {/* <TableCell> Group Name </TableCell> */}
                  <TableCell> Symbol Name </TableCell>
                  <TableCell> Min Lot </TableCell>
                  <TableCell> Max Lot </TableCell>
                  <TableCell> Step Interval </TableCell>
                  <TableCell> Group Level Spread </TableCell>
                  <TableCell> Swap Short </TableCell>
                  <TableCell> Swap Long </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {symbolsOfGroup.map((text, index) => {
                  return <TableRow>
                    <TableCell> {index + 1} </TableCell>
                    {/* <TableCell> {text["groupName"]} </TableCell> */}
                    <TableCell> {text["symbolName"]} </TableCell>
                    <TableCell> {text["minLot"]} </TableCell>
                    <TableCell> {text["maxLot"]} </TableCell>
                    <TableCell> {text["setpInterval"]} </TableCell>
                    <TableCell> {text["groupLevelSpread"]} </TableCell>
                    <TableCell> {text["swapShort"]} </TableCell>
                    <TableCell> {text["swapLong"]} </TableCell>
                  </TableRow>
                }
                )}
              </TableBody>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} variant="contained"> Done </Button>
        </DialogActions>
      </Dialog>


    </>
  }
  function NoDataFoundDialog(props) {
    const { noDataFoundDialog, setNoDataFoundDialog } = props;
    const handleClose = () => {
      setNoDataFoundDialog(false);
    };
    useEffect(() => {
      setNoDataFoundDialog(true);
    }, []);
    return <>
      <Dialog maxWidth={'xl'} onClose={handleClose} open={noDataFoundDialog}>
        <DialogTitle><b style={{ padding: "10px" }}>No Data Found</b></DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleClose} variant="contained"> Done </Button>
        </DialogActions>
      </Dialog>
    </>
  }
  function CommissionDetailView(props) {
    const { commissionViewDetails, setCommissionViewDetails, commissionOfGroup } = props;
    const handleClose = () => {
      setCommissionViewDetails(false);
    };
    useEffect(() => {
      setCommissionViewDetails(true);
    }, []);
    return <>
      <Dialog maxWidth={'xl'} onClose={handleClose}
        open={commissionViewDetails}>
        <DialogTitle><b style={{ padding: "10px" }}>Commissions of Group &#40;{commissionOfGroup[0]["groupName"]}&#41;</b></DialogTitle>
        <DialogContent>
          <Box sx={{ height: '400px' }}>
            <TableContainer>
              <TableHead>
                <TableRow>
                  <TableCell> SR.  </TableCell>
                  {/* <TableCell> Group Name </TableCell> */}
                  <TableCell> Symbol Path </TableCell>
                  <TableCell> Commission Type </TableCell>
                  <TableCell> Range Type </TableCell>
                  <TableCell> Charge Type </TableCell>
                  <TableCell> From </TableCell>
                  <TableCell> To </TableCell>
                  <TableCell> Commission </TableCell>
                  <TableCell> Min </TableCell>
                  <TableCell> Max </TableCell>
                  <TableCell> Mode </TableCell>
                  <TableCell> Type </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commissionOfGroup.map((text, index) => {
                  return <TableRow>
                    <TableCell> {index + 1} </TableCell>
                    {/* <TableCell> {text["groupName"]} </TableCell> */}
                    <TableCell> {text["symbolPath"]} </TableCell>
                    <TableCell> {text["comType"]} </TableCell>
                    <TableCell> {text["rangeType"]} </TableCell>
                    <TableCell> {text["chargeType"]} </TableCell>
                    <TableCell> {text["from"]} </TableCell>
                    <TableCell> {text["to"]} </TableCell>
                    <TableCell> {text["commission"]} </TableCell>
                    <TableCell> {text["min"]} </TableCell>
                    <TableCell> {text["max"]} </TableCell>
                    <TableCell> {text["mode"]} </TableCell>
                    <TableCell> {text["type"]} </TableCell>
                  </TableRow>
                }
                )}
              </TableBody>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} variant="contained"> Done </Button>
        </DialogActions>
      </Dialog>
    </>
  }
  function CreateGroupForm() {

    const [error, setError] = useState(false);
    const formValues = useRef({});
    const [addSecuritiyBoxVisible, setAddSecurityBoxVisible] = useState(false);
    const [securities, setSecurities] = useState([]);
    const [selectedSecurities, setSelectedSecurities] = useState([]);
    const selectedIndexes = useRef(null);// this would be an array having index of selected securities




    const leverageItems = [
      { value: 1, label: "1:1" },
      { value: 2, label: "1:2" },
      { value: 3, label: "1:3" },
      { value: 5, label: "1:5" },
      { value: 10, label: "1:10" },
      { value: 20, label: "1:20" },
      { value: 25, label: "1:25" },
      { value: 30, label: "1:30" },
      { value: 33, label: "1:33" },
      { value: 50, label: "1:50" },
      { value: 66, label: "1:66" },
      { value: 75, label: "1:75" },
      { value: 100, label: "1:100" },
      { value: 125, label: "1:125" },
      { value: 150, label: "1:150" },
      { value: 175, label: "1:175" },
      { value: 200, label: "1:200" },
      { value: 300, label: "1:300" },
      { value: 400, label: "1:400" },
      { value: 500, label: "1:500" }]
    const feeGroupFormFields = [
      { key: "name", label: "Name", type: "text" },
      { key: "envType", label: "Environment Type", type: "select", menuItems: [{ value: 0, label: "Demo" }, { value: 1, label: "Live" }] },
      { key: "currency", label: "Currency", type: "select", menuItems: CURRENCIES/* CURRENCIES is being imported from another file where all currencies along with their country name are listed as JSON*/ },
      { key: "platform", label: "Platform", type: "text" },
      { key: "minLotSize", label: "Min Lot Size", type: "text" },
      { key: "maxLotSize", label: "Max Lot Size", type: "text" },
      { key: "stepInterval", label: "Step Interval", type: "text" },
      { key: "marginType", label: "Margin Type", type: "select", menuItems: [{ value: 'percent', label: "Percent" }, { value: 'cash', label: "Cash" }] },
      { key: "leverage", label: "Leverage", type: "select", menuItems: leverageItems },
      { key: "marginCallLevel", label: "Margin Call Level", type: "slider", minValue: 0, maxValue: 200 },
      { key: "stopoutLevel", label: "Stopout Level", type: "slider", minValue: 0, maxValue: 200 }
    ]

    function getSecurities() {
      // axios.get(GET_SECURITIES_URL).then(res => {
      //   setAddSecurityBoxVisible(true);
      //   setSecurities(res.data);
      // }).catch(err => {
      //   console.log(err);
      // })
    }

    function updateSelectedSecurities(selectedIds) {
      formValues.current.securities = selectedIds;
      let temp = [];
      setSelectedSecurities(selectedIds);
    }

    function handleChange(e) {
      formValues.current[e.target.name] = e.target.value;
      console.log(formValues);
    }

    function submitForm() {

      let temp = [];

      selectedSecurities.map(s => {
        temp.push(JSON.parse(s)._id);
      });

      formValues.current.securities = temp;
      // axios.post(CREATE_FEE_GROUP_URL, { ...formValues.current }).then(res => {
      //   console.log(res.data);
      //   alert("Fee Group Created!");
      //   setGroupFormVisible(false);
      // }).catch(err => {
      //   console.log(err.message);
      // });
    }


    return <>

      <Dialog open={addSecuritiyBoxVisible} maxWidth={'xl'} fullWidth>
        <DialogTitle>Select securities to add to this group</DialogTitle>
        <DialogContent>
          <Box sx={{ height: '400px' }}>
            <DataGrid
              checkboxSelection
              onSelectionModelChange={updateSelectedSecurities}
              rows={securities}
              getRowId={(row) => JSON.stringify(row)}

              columns={[
                { field: "Security", renderCell: (params) => { return params.row.name } },
                { field: "Symbol", renderCell: (params) => { return params.row.symbol } },
                { field: "Description", renderCell: (params) => { return params.row.desc } },
                { field: "Sector", renderCell: (params) => { return params.row.sector } },
                { field: "Min Lot Size", renderCell: (params) => { return params.row.minLotSize } },
                { field: "Max Lot Size", renderCell: (params) => { return params.row.maxLotSize } },
                { field: "Step Interval", renderCell: (params) => { return params.row.stepInterval } },
                { field: "Position Limit", renderCell: (params) => { return params.row.positionLimit } },
                { field: "Limit and Stop Level", renderCell: (params) => { return params.row.limitStopLevel } },
                { field: "Base Currency", renderCell: (params) => { return params.row.baseCurrency } },
                { field: "Margin Currency", renderCell: (params) => { return params.row.marginCurrency } },
                { field: "Commission Fee", renderCell: (params) => { return params.row.commissionFee } },
                { field: "Spread Fee", renderCell: (params) => { return params.row.spreadFee } }]}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAddSecurityBoxVisible(false) }}>Done</Button>
          <Button onClick={() => {
            formValues.current.securities = [];
            setSelectedSecurities([]);
            setAddSecurityBoxVisible(false);
          }}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h4">Create Fee Group</Typography>
      <br />
      <Grid container spacing={4}>
        {feeGroupFormFields.map(field => {



          if (field.type == "text") {
            return <Grid item key={field.key} xs={12} sm={12} md={4} lg={4}>
              <TextField onChange={handleChange} fullWidth type={field.type} helperText={error} error={error}
                label={field.label} name={field.key} />

            </Grid>
          }

          else if (field.type == "select") {
            return <Grid item key={field.key} xs={12} sm={12} md={4} lg={4}>
              <FormControl fullWidth error={error}>
                <InputLabel id={field.key + "-label"}>{field.label}</InputLabel>
                <Select onChange={handleChange} labelId={field.key + "-label"} name={field.key} label={field.label}>
                  {field.menuItems.map(item => {
                    return <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                  })}
                </Select>
                <FormHelperText>{error}</FormHelperText>
              </FormControl>

            </Grid>
          } else if (field.type === "slider") {
            return <Grid item key={field.key} xs={12} sm={12} md={4} lg={4}>
              <Typography id={field.key + "-label"} gutterBottom>{field.label}</Typography>
              <Slider
                aria-label={field.label}
                defaultValue={20}
                onChange={(e, val) => { handleChange({ target: { name: field.key, value: val } }) }}
                aria-labelledby={field.key + "-label"}
                //getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={1}
                marks={[{ value: 0, label: 0 }, { value: 200, label: 200 }]}
                min={field.minValue}
                max={field.maxValue}
              />
            </Grid>
          }
        })}
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Button variant="contained" onClick={getSecurities}>Add Securities</Button>
        </Grid>
        {selectedSecurities.length > 0 && <Grid item sx={12} sm={12} md={12} lg={12}>
          <>

            <TableContainer component={Paper} variant={'outlined'}>
              <Table style={{ width: '1920px' }}>
                <TableHead>
                  <TableRow style={{ backgroundColor: context.headingColor }}>
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
                  {selectedSecurities.map(str => {
                    let s = JSON.parse(str);
                    return <TableRow>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.symbol}</TableCell>
                      <TableCell>{s.desc}</TableCell>
                      <TableCell>{s.sector}</TableCell>
                      <TableCell>{s.minLotSize}</TableCell>
                      <TableCell>{s.maxLotSize}</TableCell>
                      <TableCell>{s.stepInterval}</TableCell>
                      <TableCell>{s.positionLimit}</TableCell>
                      <TableCell>{s.limitStopLevel}</TableCell>
                      <TableCell>{s.baseCurrency}</TableCell>
                      <TableCell>{s.marginCurrency}</TableCell>
                      <TableCell>{s.commissionFee}</TableCell>
                      <TableCell>{s.spreadFee}</TableCell>
                    </TableRow>
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>

        </Grid>}
      </Grid>
      <br />
      <Stack direction="row" spacing={2}>
        <Button fullWidth variant="contained" onClick={submitForm}>Submit</Button>
        <Button fullWidth variant="outlined" onClick={hideAddGroupForm}>Cancel</Button>
      </Stack>
    </>
  }
}