import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useParams, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Button, Snackbar, Alert, Box, IconButton, Badge, Popover, ListItemIcon, List, Divider, Tab, Tabs, ListItem, ListItemText, ListItemButton, Stack, Typography } from '@mui/material';
import FeeGroups from './groups/feeGroups';
import Securities from './securities/securities';
import SMTP from './smtp/index';
import { ThemeProvider } from '@mui/material/styles';
import sidebarTheme from '../components/backofficeSidebarTheme';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';
import AppContext from '../AppContext';
import moment from 'moment';
import HoldingCostFileUploads from './holding_cost';
import UserRoles from './user_roles';
import Users from './users';
import axios from 'axios';
import { UserRoleContextProvider } from './user_roles/userRoleContext';
import { CHECK_ALLOWED_USERS, GET_ROLE_BASE_TAB_LIST } from '../helper/apiString';
import { useLocation } from "react-router-dom";

export default function Home(props) {
    const { window } = props;
    let { module } = useParams();
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [tabPanelValue, setTabPanelValue] = useState(module);
    const toggleButtonStyle = { sx: { textTransform: 'none', color: context.headingColor } };
    let [tabList, setTabList] = useState([
        // { label: "User Roles", value: 'User Roles' },
        // { label: "Users", value: 'Users' }
    ]);
    const [modulePermissionData, setModulePermissionData] = useState({});


    const logout = () => {
        if (localStorage.getItem("token")) {
            localStorage.clear();
            window.location.reload();
        }
    }

    function closeSnackbar() {
        context.setSnackbarMsg(false);
    }

    function userAuth() {
        axios.post(CHECK_ALLOWED_USERS, { userType: localStorage.getItem("userType"), userEmail: localStorage.getItem("email") })
            .then((res) => {
                axios.post(GET_ROLE_BASE_TAB_LIST, { email: localStorage.getItem("email") })
                    .then((res) => {
                        let allowedTabList = [];
                        let modulePermissionObj = {}
                        let mList = res.data.allowedModuleList;
                        for (let i = 0; i < mList.length; ++i) {
                            modulePermissionObj[Object.keys(mList[i])[0]] = mList[i][Object.keys(mList[i])];
                            if ((mList[i][Object.keys(mList[i])])[0] == 1) {
                                allowedTabList.push({ label: Object.keys(mList[i])[0], value: Object.keys(mList[i])[0] })
                            }
                        }
                        setTabList(allowedTabList)
                        setModulePermissionData(modulePermissionObj)
                    })
                    .catch((err) => {
                        console.log("Auth Error", err.message)
                    })
            })
            .catch((err) => {
                console.log("Auth Error", err.message)
            })
    }
    useEffect(() => {
        userAuth();
    }, [])
    return (<Box sx={{ display: 'flex', width: '100vw', height: '100vh', flexDirection: 'row', overflow: 'hidden' }}>

        {<SideBar tabList={tabList} />}

        <Divider orientation='vertical' sx={{ height: '100%' }} />

        <Box sx={{ flex: 1, height: '100%', overflow: 'scroll', boxSizing: 'border-box' }}>

            <Divider />
            {module === "Fee Groups" && <FeeGroups />}
            {module === "Securities" && <Securities />}
            {module === "User Roles" && <UserRoleContextProvider><UserRoles /></UserRoleContextProvider>}
            {module === "Users" && <Users modulePermissionData={modulePermissionData["Users"]} />}
            {module === "SMTP Setup" && <SMTP modulePermissionData={modulePermissionData["SMTP Setup"]} />}
            {module === "Holding Cost" && <HoldingCostFileUploads />}

            <Snackbar
                open={context.snackbarMsg}
                autoHideDuration={6000}
                severity={context.severity}
                onClose={closeSnackbar}
                action={<IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={closeSnackbar}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>}
            >
                <Alert onClose={closeSnackbar} severity={context.severity} sx={{ width: '100%' }}>
                    {context.snackbarMsg}
                </Alert>
            </Snackbar>


            {!["theming", "Holding Cost", "automations", "Users", "registration", "Fee Groups", "Securities", "User Roles", "approvalStages", "emailDesigner", "legalDocs", "SMTP Setup"].includes(module) &&
                <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h1">404</Typography>

                    <h3>Page you're looking for does not exist</h3>
                </Box>}

        </Box>


    </Box>);

    function SideBar(props) {
        const { tabList } = props;

        useEffect(() => {
        }, []);

        function onTabChange(e, tabValue) {

            if (context.somethingChanged) {

                if (window.confirm("You have unsaved changes that you will lose if you continue. Do you still want to continue?")) {
                    setTabPanelValue(tabValue);
                    navigate("/mis_home/" + tabValue);
                    context.setSomethingChanged(false);
                }
                return

            }

            setTabPanelValue(tabValue);
            navigate("/mis_home/" + tabValue);

        }

        const sideBarStyleProps = {
            width: '200px',
            height: '100%',

            flexDirection: 'column'
        };

        return <Box sx={sideBarStyleProps}>
            <Box sx={{ paddingLeft: '24px', paddingRight: '24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img style={{ width: '80%' }} src={'../companylogo.png'} />
            </Box>
            <Divider />
            <ThemeProvider theme={sidebarTheme}>
                <Tabs orientation="vertical" value={tabPanelValue} onChange={onTabChange} aria-label="lab API tabs example">
                    {tabList.map(tab => {
                        return <Tab sx={{ alignItems: 'flex-start' }} label={tab.label} value={tab.value} />
                    })}

                </Tabs>
            </ThemeProvider>
            <Divider />
            <AppBar notifications={notifications} />

        </Box>
    }


    function AppBar(props) {

        const { notifications } = props;
        const [anchorEl, setAnchorEl] = React.useState(null);
        const [notificationAnchor, setNotificationAnchor] = useState(null);

        const isNotificationPopoverOpen = Boolean(notificationAnchor);

        function openNotificationPopover(e) {
            setNotificationAnchor(e.currentTarget);
        }

        function closeNotificationPopover() {
            setNotificationAnchor(null);
        }


        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const open = Boolean(anchorEl);

        return <Box sx={{ height: '56px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>




            <Box pr={2} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>

                {/* <LanguageButton /> */}


                <Badge sx={{
                    '& .MuiBadge-badge': {
                        right: 0,
                        top: 28,
                        padding: '0 4px',
                    }
                }} badgeContent={notificationsCount} color="primary">
                    <IconButton onClick={openNotificationPopover} size="small" sx={{ border: '1px solid gray' }}>
                        <NotificationsNoneOutlinedIcon />
                    </IconButton>
                </Badge>

                <NotificationPopover notifications={notifications} isOpen={isNotificationPopoverOpen} anchorEl={notificationAnchor} onClose={closeNotificationPopover} />




                <IconButton size="small" onClick={handleClick} sx={{ border: '1px solid gray' }}>
                    <PersonOutlineOutlinedIcon />
                </IconButton>
                <Popover open={open} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                    <Box sx={{ width: 200 }} p={2}>
                        <Box sx={{ width: '100%', height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <AccountCircleIcon sx={{ fontSize: 100 }} />
                        </Box>

                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant={'h6'}>{"Super Admin"}</Typography>
                            <Button variant="outlined" onClick={logout}>Logout</Button>
                        </Box>
                    </Box>
                </Popover>

            </Box>
        </Box>
    }



}


function TabLabel(label) {


    return <ListItem disablePadding >
        <ListItemText primary={<span style={{ fontSize: '14px', fontWeight: 'bolder' }}>{label}</span>} />
    </ListItem>
}






function NotificationPopover(props) {
    const { isOpen, anchorEl, onClose, notifications } = props;
    const context = useContext(AppContext);
    const navigate = useNavigate();


    return <Popover open={isOpen} anchorEl={anchorEl} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <List disablePadding>
            {notifications.map(n => {


                return <>

                    <ListItemButton onClick={(e) => {
                        if (n.module === "onboarding") {
                            navigate("/backoffice/users?email=" + n.data.email);
                        } else if (n.module === "fundings") {
                            navigate("/backoffice/fundings");
                        }
                    }} sx={{ width: '400px' }} >
                        <ListItemIcon>
                            {n.module === "onboarding" && <PersonOutlineOutlined />}
                        </ListItemIcon>
                        <ListItemText primary={n.title} secondary={<>
                            <span>{n.content}</span>
                            <Box sx={{ display: 'flex', justifyContent: 'end', fontSize: '12px', color: 'gray' }}>
                                <span>{moment(n.createdAt).format("DD/MM/yy hh:mm")}</span>
                            </Box>
                        </>} />

                    </ListItemButton>
                    <Divider />
                </>
            })}
        </List>
    </Popover>
}
