import React, { useContext, useEffect, useRef, useState } from "react";
import { Column } from '@ant-design/plots';
import { forEach, groupBy } from 'lodash-es';
import {
    Box, Grid,
    Typography, Paper, Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Popover,
    Tabs,
    Tab,
    TextField,
    Button,
    FormControl,
    CircularProgress,
    LinearProgress
} from '@mui/material';
import Autocomplete from "@mui/material/Autocomplete";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import TreeMapComponent from "../global_component/treeMapChart";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { CSVLink, CSVDownload } from "react-csv";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import StatCard from "../global_component/statCard-component";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import axios from "axios";
import DateRangeTimePicker from "../../components/dateRangeTimePicker";
import { BASE_URL, GET_HOLDING_COST, GET_TREE_MAP_DATA } from "../../helper/apiString";
import { Divider } from "antd";
import { Tooltip } from "antd";
import Switch from "@mui/material/Switch";
import UserRoleConext from "../user_roles/userRoleContext";
import { infoMapHoldingCost, namingMapHoldingCost } from "../constants";
const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
        "& .MuiSwitch-thumb": {
            width: 15,
        },
        "& .MuiSwitch-switchBase.Mui-checked": {
            transform: "translateX(9px)",
        },
    },
    "& .MuiSwitch-switchBase": {
        padding: 2,
        "&.Mui-checked": {
            transform: "translateX(12px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor:
                    theme.palette.mode === "dark" ? "#04832a" : "#04832a",
            },
        },
    },
    "& .MuiSwitch-thumb": {
        boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(["width"], {
            duration: 200,
        }),
    },
    "& .MuiSwitch-track": {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(255,255,255,.35)"
                : "rgba(0,0,0,.25)",
        boxSizing: "border-box",
    },
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const HoldingCostDashboard = () => {
    const statCardGridSize = { xl: 2, lg: 3, md: 4, sm: 6, xs: 12 };
    const [holdingCost, setHoldingCost] = useState();
    const [clientList, setClientList] = useState();
    const [symbolList, setSymbolList] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [value, setValue] = React.useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [reloadData, setReloadData] = useState(true);
    const [client, setClient] = useState("All");
    const [symbol, setSymbol] = useState("All");
    const [dateRange, setDateRange] = useState([]);
    const filterValues = useRef({
        client: "",
        symbol: "",
        startDate: "",
        endDate: "",
    });
    const userContext = useContext(UserRoleConext);
    const columns = [
        {
            field: "client",
            renderCell: (params) => {
                return params.row.client;
            },
            renderHeader: (params) => (
                <strong> {'Client'} </strong>
            ),
            flex: 1,
            minWidth: 50,
        },
        {
            field: "symbol",
            renderHeader: (params) => (
                <strong> {'Symbol'} </strong>
            ),
            renderCell: (params) => {
                return params.row.symbol;
            },
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "feeGroup",
            renderHeader: (params) => (
                <strong> {'Fee Group'} </strong>
            ),
            renderCell: (params) => {
                return params.row.feeGroup;
            },
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "position",
            renderHeader: (params) => (
                <strong> {'Position'} </strong>
            ),
            renderCell: (params) => {
                return params.row.position;
            },
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "baseRate",
            renderHeader: (params) => (
                <strong> {'Base Rate'} </strong>
            ),
            renderCell: (params) => {
                return params.row.baseRate;
            },
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "markupRate",
            renderHeader: (params) => (
                <strong> {'Markup Rate'} </strong>
            ),
            renderCell: (params) => {
                return params.row.markupRate;
            },
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "finalRate",
            renderHeader: (params) => (
                <strong> {'Final Rate'} </strong>
            ),
            renderCell: (params) => {
                return params.row.finalRate;
            },
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "lpCost",
            renderHeader: (params) => (
                <strong> {'LP Cost'} </strong>
            ),
            renderCell: (params) => {
                return params.row.lpCost;
            },
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "platform",
            renderHeader: (params) => (
                <strong> {'Palltform'} </strong>
            ),
            renderCell: (params) => {
                return params.row.platform;
            },
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
        },
    ];
    const togglePlatformType = () => {
        resetFilter();
        setReloadData(true);
        if (userContext.platformType == "TU") {
            userContext.setPlatformType("CFC");
        }
        else {
            userContext.setPlatformType("TU");
        }
    };
    function resetFilter() {
        filterValues.current = {
            client: "",
            symbol: "",
            startDate: "",
            endDate: "",
        };
        setDateRange([])
        setClient("All");
        setSymbol("All");
    }
    function getHoldingCost() {
        setIsLoading(true)
        axios.post(BASE_URL + "/" + userContext.platformType + GET_HOLDING_COST, filterValues.current).then((result) => {
            setHoldingCost(result.data);
            if (result.data[0]["swapChangeMasterData"].length != 0) {
                setClientList(result.data[0].uniqueLists[0].totalClients);
                setSymbolList(result.data[0].uniqueLists[0].totalSymbols);
            }
            else {
                setClientList([]);
                setSymbolList([])
            }
            setIsLoading(false)
        }).catch((e) => {
            setIsLoading(true)
            console.log(e.message)
        })
    }
    const callGetOpenPosition = () => {
        setReloadData(!reloadData);
        getHoldingCost();
    }
    const callResetFilter = () => {
        setReloadData(!reloadData);
        resetFilter();
    }
    const handleValueChange = (e) => {
        let old = filterValues.current;
        old = filterValues.current;
        old[e.target.name] = e.target.value;
        filterValues.current = old;
        if (e.target.name == "client") {
            setClient(filterValues.current.client)
        }
        if (e.target.name == "symbol") {
            setSymbol(filterValues.current.symbol)
        }
    }
    useEffect(() => {
        getHoldingCost();
    }, [reloadData, userContext.platformType]);
    return <>
        {<Box>
            <Grid container spacing={5} p={3} mb={3} alignItems="center"
                justifyContent="center" sx={{ backgroundColor: "#ffd700" }}>
                <Grid item lg={9} xl={9} md={9} sm={12} xs={12}>
                    <Typography style={{ fontWeight: 700, fontSize: 24 }}>Holding Cost Dashboard
                    </Typography>
                </Grid>
                <Grid item sx={{ display: "flex" }}>
                    <Typography style={{ fontWeight: 700 }}>CENTURY</Typography>
                    <Tooltip title={!reloadData && holdingCost ? "Data is Loading" : ""}>
                        <span style={{ padding: "5px" }}><AntSwitch
                            disabled={!isLoading ? false : true}
                            checked={userContext.platformType == "TU" ? true : false}
                            onChange={(checked) => {
                                togglePlatformType();
                            }}
                            inputProps={{ "aria-label": "ant design" }}
                        /></span>
                    </Tooltip>
                    <Typography style={{ fontWeight: 700 }}>TU</Typography>
                </Grid>
            </Grid>
            <Paper
                sx={{
                    backgroundColor: "#fafafa",
                }}
            >
                <Grid container spacing={2}>

                    <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>

                        <Box
                            pt={2}
                            pb={2}
                            sx={{
                                display: "flex",
                                gap: 2,
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            {<Grid item lg={2} xl={2} md={2} sm={6} xs={12}>
                                <FormControl sx={{ width: "100%" }}>
                                    <Autocomplete
                                        disablePortal
                                        size="small"
                                        value={client}
                                        onChange={(e, option) => {
                                            handleValueChange({
                                                target: { name: "client", value: option },
                                            });
                                        }}
                                        options={["All"].concat(clientList)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Client" />
                                        )}
                                    />
                                </FormControl>
                            </Grid>}
                            {<Grid item lg={2} xl={2} md={2} sm={6} xs={12}>
                                <FormControl sx={{ width: "100%" }}>
                                    <Autocomplete
                                        disablePortal
                                        size="small"
                                        value={symbol}
                                        onChange={(e, option) => {
                                            handleValueChange({
                                                target: { name: "symbol", value: option },
                                            });
                                        }}
                                        options={["All"].concat(symbolList)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Symbol" />
                                        )}
                                    />
                                </FormControl>
                            </Grid>}
                            <Grid item lg={2} xl={2} md={2} sm={6} xs={12}>
                                <DateRangeTimePicker
                                    state={dateRange}
                                    setState={setDateRange}
                                    filterValues={filterValues}
                                />
                            </Grid>

                            <Grid item lg={1} xl={1} md={3} sm={6} xs={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    style={{ backgroundColor: "black" }}
                                    onClick={callGetOpenPosition}
                                >
                                    Submit
                                </Button>
                            </Grid>
                            <Grid item lg={1} xl={1} md={2} sm={6} xs={12}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={callResetFilter}
                                >
                                    Clear
                                </Button>
                            </Grid>

                        </Box>
                    </Grid>
                </Grid>
            </Paper>
            {/* Lower section */}
            {!isLoading ? <Paper>
                {holdingCost[0].statistics[0] && !isLoading && <Grid container spacing={2} p={1} mt={1} alignItems="center"
                    justifyContent="center">
                    {Object.keys(holdingCost[0].statistics[0]).map((key, index) => {
                        return <Grid item {...statCardGridSize}>
                            <StatCard
                                value={Math.abs(holdingCost[0].statistics[0][key]).toLocaleString()}
                                heading={namingMapHoldingCost[key]}
                                infoKey={infoMapHoldingCost[key]}
                            />
                        </Grid>
                    })}
                </Grid>}
                <Divider></Divider>
                <Paper sx={{ marginTop: "10px" }}>
                    <Grid container spacing={2} p={2} sx={{ backgroundColor: "white" }}>
                        {holdingCost[0].barCharData.length != 0 ? <Grid item lg={6} xl={6} md={6} sm={12} xs={12}>
                            <BarChartCompnent sx={{ height: "250px !important", }} swapData={holdingCost[0].barCharData} />
                        </Grid> : <Grid item lg={6} xl={6} md={6} sm={12} xs={12} sx={{ fontWeight: "bold", color: "#ffd700", fontSize: "22px" }}>Data Not Found</Grid>}
                        <Grid item lg={6} xl={6} md={6} sm={12} xs={12}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    "& > :not(style)": {
                                        width: "100%",
                                        minHeight: "500px",
                                        padding: "0 5%",
                                    },
                                }}
                            >
                                <Paper sx={{ height: "300px" }}>

                                    <span style={{ display: "flex", justifyContent: "center" }}>
                                        <h2>
                                            {value == 0 ? "Top Clients " : "Top Symbols"}
                                            <InfoPopover
                                                content={value == 0 ? "Top Clients " : "Top Symbols"}
                                            />
                                        </h2>
                                        {holdingCost && <span style={{ marginLeft: "30%" }}><CSVLink
                                            filename="Top Users - Swap Count"
                                            data={value == 0 ? (holdingCost[0].topClientsGeneratingSwap || []) : (holdingCost[0].topSymbolsGeneratingSwap || [])}
                                        >
                                            <SystemUpdateAltIcon sx={{ color: "black" }} />
                                        </CSVLink></span>}
                                    </span>
                                    <Tabs
                                        value={value}
                                        onChange={(e, value) => {
                                            setValue(value);
                                        }}
                                    >
                                        <Tab style={{ width: "33%" }} label="By Client" />
                                        <Tab style={{ width: "33%" }} label="By Symbol" />
                                    </Tabs>
                                    {value === 0 && (
                                        <div
                                            style={{
                                                overflow: "auto",
                                                height: "350px",
                                            }}
                                        >
                                            <Table
                                                stickyHeader
                                                style={{
                                                    tableLayout: "fixed",
                                                }}
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell>Client</StyledTableCell>
                                                        <StyledTableCell>Swap</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {holdingCost &&
                                                        Object.keys(holdingCost[0].topClientsGeneratingSwap).map((x) => {
                                                            return (
                                                                <StyledTableRow>
                                                                    <StyledTableCell>
                                                                        {holdingCost[0].topClientsGeneratingSwap[x].client}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        {holdingCost[0].topClientsGeneratingSwap[x].clientSwap}
                                                                    </StyledTableCell>
                                                                </StyledTableRow>
                                                            );
                                                        })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                    {value === 1 && (
                                        <div
                                            style={{
                                                overflow: "auto",
                                                height: "350px",
                                            }}
                                        >
                                            <Table
                                                stickyHeader
                                                style={{
                                                    tableLayout: "fixed",
                                                }}
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell>Symbol</StyledTableCell>
                                                        <StyledTableCell>Swap</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {holdingCost &&
                                                        Object.keys(holdingCost[0].topSymbolsGeneratingSwap).map((x) => {
                                                            return (
                                                                <StyledTableRow>
                                                                    <StyledTableCell>
                                                                        {holdingCost[0].topSymbolsGeneratingSwap[x].symbol}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        {holdingCost[0].topSymbolsGeneratingSwap[x].symbolSwap}
                                                                    </StyledTableCell>
                                                                </StyledTableRow>
                                                            );
                                                        })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} p={2} sx={{ backgroundColor: "white" }}>
                        <Grid item lg={12}>
                            {holdingCost && <Box sx={{ height: 400, width: "100%" }}>
                                <DataGrid
                                    sx={{
                                        "& .MuiDataGrid-row:hover": {
                                            backgroundColor: "#d6d6d6",
                                        },
                                        ".MuiDataGrid-columnSeparator": {
                                            display: "none",
                                        },
                                        "& .MuiDataGrid-cell:hover": {
                                            // color: '#ffd700',
                                            cursor: "pointer",
                                        },
                                        "& .MuiDataGrid-cell:hover": {
                                            // color: '#ffd700',
                                            cursor: "pointer",
                                        },
                                        "& .MuiDataGrid-cell:focus-within": {
                                            outline: "none !important",
                                        },
                                        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                                            width: "0.7em",
                                        },
                                        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
                                            background: "#ffffff",
                                        },
                                        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
                                            backgroundColor: "black",
                                            borderRadius: 2,
                                        },
                                        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover":
                                        {
                                            background: "#ffd700",
                                        },
                                    }}
                                    columns={columns}
                                    getRowId={(row) => row._id}
                                    rowsPerPageOptions={[10, 25, 50, 100]}
                                    pageSize={pageSize}
                                    components={{
                                        Toolbar: GridToolbar,
                                    }}
                                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                    rows={holdingCost[0].swapChangeMasterData}
                                    experimentalFeatures={{ newEditingApi: true }}
                                />
                            </Box>}
                        </Grid>
                    </Grid>
                </Paper>
            </Paper > : <><LinearProgress sx={{ justifyContent: "center>" }} /><h1>Loading...</h1></>}
        </Box >}</>
}
function BarChartCompnent(props) {
    const [data, setData] = useState(props.swapData);

    useEffect(() => {
    }, []);

    const annotations = [];
    forEach(groupBy(data, 'createdDate'), (values, k) => {
        const value = values.reduce((a, b) => a + b.value, 0);
        annotations.push({
            type: 'text',
            data: [k, value],
            style: {
                textAlign: 'center',
                fontSize: 14,
                fill: 'rgba(0,0,0,0.85)',
            },
            xField: 'createdDate',
            yField: 'value',
            style: {
                text: `${value}`,
                textBaseline: 'bottom',
                position: 'top',
                textAlign: 'center',
            },
            tooltip: false,
        });
    });

    const config = {
        data,
        xField: 'createdDate',
        yField: 'value',
        stack: true,
        colorField: 'type',
        label: {
            text: 'value',
            textBaseline: 'bottom',
            position: 'inside',
        },
        annotations,
    };
    return <Column {...config} />;
};

function NoDataElement() {
    return (
        <>
            <br />
            <br />
            <br />
            <h2 style={{ color: "goldenrod" }}>No Data Available</h2>
        </>
    );
}
function InfoPopover(props) {
    const { content, color = "black" } = props;
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <>
            <IconButton aria-describedby={id} size="small" onClick={handleClick}>
                <InfoOutlinedIcon size="small" sx={{ color }} />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Typography sx={{ p: 2 }}>{content}</Typography>
            </Popover>
        </>
    );
}

export default HoldingCostDashboard;