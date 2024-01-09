import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Paper,
    Table,
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
import { motion } from "framer-motion"
import { BASE_URL, GET_OPEN_POSITION_MASTER, GET_TREE_MAP_DATA } from "../../helper/apiString";
import { Divider } from "antd";
import { Tooltip } from "antd";
import Switch from "@mui/material/Switch";
import UserRoleConext from "../user_roles/userRoleContext";
import { infoMapOpenPosition, namingMapOpenposition } from "../constants";
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

const OpenPositionHome = () => {
    const statCardGridSize = { xl: 2, lg: 3, md: 4, sm: 6, xs: 12 };
    const [openPosition, setOpenPosition] = useState(null);
    const [userList, setUserList] = useState();
    const [symbolList, setSymbolList] = useState();
    const [directionList, setDirectionList] = useState(["BUY", "SELL"]);
    const [treeMapData, setTreeMapData] = useState(null);
    const [treeMapDataFiltered, setTreeMapDataFiltered] = useState();
    const [treeMapDataFilterBy, setTreeMapDataFilterBy] = useState("byTxnCount");
    const [isLoading, setIsLoading] = useState(true);
    // const [isLoadingTreeMapData, setIsLoadingTreeMapData] = useState(true);
    const [value, setValue] = React.useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedClient, setSelectedClient] = useState("All");
    const [selectedSymbol, setSelectedSymbol] = useState("All");
    const [selectedDirection, setSelectedDirection] = useState("All");
    const [reloadData, setReloadData] = useState(true);
    const filterValues = useRef({
        filterByClient: "",
        filterBySymbol: "",
        filterByPositionDirection: ""
    });
    const userContext = useContext(UserRoleConext);
    const columns = [
        {
            field: "loginid",
            renderCell: (params) => {
                return params.row.loginid;
            },
            renderHeader: (params) => (
                <strong> {'Login ID '} </strong>
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
            field: "lotsize",
            renderHeader: (params) => (
                <strong> {'Lot Size'} </strong>
            ),
            renderCell: (params) => {
                return params.row.lotsize;
            },
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "type",
            renderHeader: (params) => (
                <strong> {'Type'} </strong>
            ),
            renderCell: (params) => {
                return params.row.type;
            },
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "price",
            renderHeader: (params) => (
                <strong> {'Price'} </strong>
            ),
            renderCell: (params) => {
                let price = "USD " + params.row.price;
                return price;
            },
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "swap",
            renderHeader: (params) => (
                <strong> {'Swap'} </strong>
            ),
            renderCell: (params) => {
                return params.row.swap;
            },
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "profitCur",
            renderHeader: (params) => (
                <strong> {'Profit Currency'} </strong>
            ),
            renderCell: (params) => {
                return params.row.profitCur != null ?
                    <p> {params.row.profitCur}</p>
                    : "Unknown"
            },
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
        },
    ];
    console.log("I m called", filterValues.current)
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
        setSelectedClient("All");
        setSelectedSymbol("All");
        setSelectedDirection("All");
        filterValues.current = {
            filterByClient: "",
            filterBySymbol: "",
            filterByPositionDirection: ""
        };
    }
    function getOpenPosition() {
        setIsLoading(true)
        axios.post(BASE_URL + "/" + userContext.platformType + GET_OPEN_POSITION_MASTER, old).then((result) => {
            setOpenPosition(result.data);
            if (result.data[0]["openPositionMaster"].length != 0) {
                setUserList(result.data[0].uniqueLists[0].userList);
                setSymbolList(result.data[0].uniqueLists[0].symbolList);
            }
            else {
                setUserList([]);
                setSymbolList([])
            }
            setIsLoading(false)
            getTreeMapData();
        }).catch((e) => {
            setIsLoading(true)
            console.log(e.message)
        })
    }
    const callGetOpenPosition = () => {
        // setReloadData(!reloadData);
        getOpenPosition();
    }
    const callResetFilter = () => {
        setReloadData(!reloadData);
        resetFilter();
    }
    function getTreeMapData() {
        axios.post(BASE_URL + "/" + userContext.platformType + GET_TREE_MAP_DATA, old).then((result) => {
            setTreeMapData(result.data);
            setTreeMapDataFiltered(result.data[0].symbolTxnsCount);
            setIsLoading(false);
        }).catch((e) => {
            console.log(e.message)
        })
    }
    let old = filterValues.current;
    const handleValueChange = (e) => {
        old = filterValues.current;
        old[e.target.name] = e.target.value;
        filterValues.current = old;
        if (e.target.name == "filterByClient") {
            setSelectedClient(filterValues.current.filterByClient)
        }
        if (e.target.name == "filterBySymbol") {
            setSelectedSymbol(filterValues.current.filterBySymbol)
        }
        if (e.target.name == "filterByPositionDirection") {
            setSelectedDirection(filterValues.current.filterByPositionDirection)
        }
    }
    useEffect(() => {
        getOpenPosition();
    }, [reloadData, userContext.platformType]);

    return <>
        {openPosition && treeMapData && !isLoading ? <Box>
            <Grid container spacing={5} p={3} mb={3} alignItems="center"
                justifyContent="center" sx={{ backgroundColor: "#ffd700" }}>
                <Grid item lg={9} xl={9} md={9} sm={12} xs={12}>
                    <Typography style={{ fontWeight: 700, fontSize: 24 }}>Open Position Dashboard
                    </Typography>
                </Grid>
                <Grid item sx={{ display: "flex" }}>
                    <Typography style={{ fontWeight: 700 }}>CENTURY</Typography>
                    <Tooltip title={!reloadData && openPosition && treeMapData ? "Data is Loading" : ""}>
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
                            {userList && <Grid item lg={2} xl={2} md={2} sm={6} xs={12}>
                                <FormControl sx={{ width: "100%" }}>
                                    <Autocomplete
                                        disablePortal
                                        size="small"
                                        value={selectedClient}
                                        onChange={(e, option) => {
                                            handleValueChange({
                                                target: { name: "filterByClient", value: option },
                                            });
                                        }}
                                        options={["All"].concat(userList)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Client" />
                                        )}
                                    />
                                </FormControl>
                            </Grid>}
                            {directionList && <Grid item lg={2} xl={2} md={2} sm={6} xs={12}>
                                <FormControl sx={{ width: "100%" }}>
                                    <Autocomplete
                                        disablePortal
                                        size="small"
                                        value={selectedDirection}
                                        onChange={(e, option) => {
                                            handleValueChange({
                                                target: { name: "filterByPositionDirection", value: option },
                                            });
                                        }}
                                        options={["All"].concat(directionList)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Direction" />
                                        )}
                                    />
                                </FormControl>
                            </Grid>}
                            {symbolList && <Grid item lg={2} xl={2} md={2} sm={6} xs={12}>
                                <FormControl sx={{ width: "100%" }}>
                                    <Autocomplete
                                        disablePortal
                                        size="small"
                                        value={selectedSymbol}
                                        onChange={(e, option) => {
                                            handleValueChange({
                                                target: { name: "filterBySymbol", value: option },
                                            });
                                        }}
                                        options={["All"].concat(symbolList)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Symbol" />
                                        )}
                                    />
                                </FormControl>
                            </Grid>}

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
            <Paper>
                {openPosition[0].statistics[0] && !isLoading && <Grid container spacing={2} p={1} mt={1} alignItems="center"
                    justifyContent="center">
                    {Object.keys(openPosition[0].statistics[0]).map((key, index) => {
                        return <Grid item {...statCardGridSize}>
                            <StatCard
                                value={Math.abs(openPosition[0].statistics[0][key]).toLocaleString()}
                                heading={namingMapOpenposition[key]}
                                infoKey={infoMapOpenPosition[key]}
                            />
                        </Grid>
                    })}
                </Grid>}
                <Divider></Divider>
                <Paper sx={{ marginTop: "10px" }}>
                    <Grid container spacing={2} p={2} sx={{ backgroundColor: "white" }}>
                        <Grid item lg={6} xl={6} md={6} sm={12} xs={12}>

                            <Paper sx={{ height: "400px", overflow: "auto", position: "relative" }}>
                                <span
                                    style={{
                                        float: "right",
                                        marginTop: "10px",
                                        marginRight: "10px",
                                    }}
                                >
                                    <CSVLink
                                        filename="Symbol Wise Transaction Count"
                                        data={treeMapDataFiltered || []}
                                    >
                                        <SystemUpdateAltIcon sx={{ color: "black" }} />
                                    </CSVLink>
                                </span>
                                <h3>
                                    Symbol wise Open Position{" "}
                                    <InfoPopover
                                        content={"Symbol wise Open Position"}
                                    />
                                </h3>
                                <label>Filter by&nbsp;</label>
                                <select
                                    defaultValue={"byTxnCount"}
                                    style={{ fontSize: 14 }}
                                    onChange={(e) => {
                                        setTreeMapDataFiltered([])
                                        setTreeMapDataFilterBy(e.target.value);
                                        if (e.target.value == "byTxnCount") {
                                            setTreeMapDataFiltered(treeMapData[0].symbolTxnsCount)
                                        }
                                        else if (e.target.value == "byTxnVolume") {
                                            setTreeMapDataFiltered(treeMapData[0].symbolTxnsVolume)
                                        }
                                        else if (e.target.value == "byDistinctUsers") {
                                            setTreeMapDataFiltered(treeMapData[0].symbolTxnsDistinctUser)
                                        }
                                    }}
                                >
                                    <option value={"byTxnCount"}>Txn Count</option>
                                    <option value={"byTxnVolume"}>Txn Volume</option>
                                    <option value={"byDistinctUsers"}>
                                        Distinct Users
                                    </option>
                                </select>
                                {treeMapDataFiltered && treeMapDataFiltered.length > 0 ? (
                                    <TreeMapComponent
                                        data={treeMapDataFiltered}
                                        isLoading={isLoading}
                                        colorField={"name"}
                                        valueField={"value"}
                                        filter={treeMapDataFilterBy}
                                    />
                                ) : (
                                    <NoDataElement />
                                )}
                            </Paper>
                        </Grid>
                        <Grid item lg={6} xl={6} md={6} sm={12} xs={12}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    "& > :not(style)": {
                                        width: "100%",
                                        minHeight: "400px",
                                        padding: "0 5%",
                                    },
                                }}
                            >
                                <Paper sx={{ height: "300px" }}>

                                    <span style={{ display: "flex", justifyContent: "center" }}>
                                        <h2>
                                            Top Clients{" "}
                                            <InfoPopover
                                                content={"Top Clients"}
                                            />
                                        </h2>
                                        {openPosition && <span style={{ marginLeft: "30%" }}><CSVLink
                                            filename="Top Users - Transaction Count"
                                            data={value == 0 ? (openPosition[0].topUserListByTransactionVolume || []) : (openPosition[0].topUserListByTransactionCount || [])}
                                        >
                                            <SystemUpdateAltIcon sx={{ color: "black" }} />
                                        </CSVLink></span>}
                                    </span>
                                    <Tabs
                                        value={value}
                                        onChange={(e, value) => {
                                            console.log(value)
                                            setValue(value);
                                        }}
                                    >
                                        <Tab style={{ width: "33%" }} label="By Volume" />
                                        <Tab style={{ width: "33%" }} label="By Txn Count" />
                                    </Tabs>
                                    {value === 0 && (
                                        <div
                                            style={{
                                                overflow: "auto",
                                                height: "250px",
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
                                                        <StyledTableCell>Txn Volume</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {openPosition &&
                                                        Object.keys(openPosition[0].topUserListByTransactionVolume).map((x) => {
                                                            return (
                                                                <StyledTableRow>
                                                                    <StyledTableCell>
                                                                        {openPosition[0].topUserListByTransactionVolume[x]._id}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        USD{" "}
                                                                        {openPosition[0].topUserListByTransactionVolume[x].transactionVolumePerUser.toLocaleString()}
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
                                                height: "250px",
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
                                                        <StyledTableCell>Txn Count</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {openPosition &&
                                                        Object.keys(openPosition[0].topUserListByTransactionCount).map((x) => {
                                                            return (
                                                                <StyledTableRow>
                                                                    <StyledTableCell>
                                                                        {openPosition[0].topUserListByTransactionCount[x]._id}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        {openPosition[0].topUserListByTransactionCount[x].transactionCount}
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
                            {openPosition && <Box sx={{ height: 400, width: "100%" }}>
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
                                    rows={openPosition[0].openPositionMaster}
                                    experimentalFeatures={{ newEditingApi: true }}
                                />
                            </Box>}
                        </Grid>
                    </Grid>
                </Paper>
            </Paper >
        </Box > : <><LinearProgress sx={{ justifyContent: "center>" }} /><h1>Loading...</h1></>}</>
}
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
function FarmerMotionLoader(props) {
    const { isVisible } = props;
    return <motion.div animate={{ opacity: isVisible ? 1 : 0 }} />
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

export default OpenPositionHome;