import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    Box, Tab, TableHead, TableContainer, TableBody, TableRow, TableCell,
    Card, Divider, Grid, Paper, Container, Stack, Typography, MenuItem, Menu, CircularProgress,
    Dialog, Button, DialogContent, Snackbar, Tooltip, ToggleButtonGroup, AccordionSummary,
    Table, Checkbox, Collapse, IconButton, Switch, FormControlLabel, Link, DialogTitle, TextField,
    ListItemButton, DialogActions, List, ListItemText, Popover, ListItem, ListItemIcon, Chip
} from '@mui/material';


import CircleIcon from '@mui/icons-material/Circle';
import { message } from "antd";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CustomSwitch from '../../components/customSwitch.component';
import AppContext from '../../AppContext';

export default function ModuleAccessComponent(props) {

    const { selectedRole, handleModuleAccessChange, reRenderPage, setSaveChangeData, modulePermissionObj } = props;
    const [module, setModule] = useState(props.module);
    const context = useContext(AppContext);

    const [isOpen, setIsOpen] = useState(false);

    const [switchOneState, setSwitchOneState] = useState(true);
    const [switchTwoState, setSwitchTwoState] = useState(true);
    const [switchThreeState, setSwitchThreeState] = useState(true);
    const colorArray = ["gray", "orange", "green"];

    useEffect(() => {
        if (module.length != 0 && module != undefined) {
            setSwitchOneState(module[0].permission.roles[selectedRole.roleName][0]);
            setSwitchTwoState(module[0].permission.roles[selectedRole.roleName][1]);
            setSwitchThreeState(module[0].permission.roles[selectedRole.roleName][2]);
        }
    }, [module]);

    function toggleOpen() {
        console.log("OPENING");
        setIsOpen(old => !old);
    }
    if (module.length != 0) {
        let mName = module[0].moduleName;
        // console.log(mName)
        return <Box mt={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>{module[0].moduleName}</Typography>
                {<Stack direction="row" spacing={4}>
                    <FormControlLabel control={
                        <CustomSwitch
                            onChange={(e) => {
                                handleModuleAccessChange();
                                reRenderPage();
                                setSwitchOneState(!switchOneState);
                                modulePermissionObj[mName] = [!switchOneState ? 1 : 0, switchTwoState ? 1 : 0, switchThreeState ? 1 : 0];
                            }} defaultChecked={module[0].permission[0] ? true : false} checked={switchOneState} />} label={"View"} />
                    <FormControlLabel control={
                        <CustomSwitch
                            onChange={(e) => {
                                handleModuleAccessChange();
                                reRenderPage();
                                setSwitchTwoState(!switchTwoState);
                                modulePermissionObj[mName] = [switchOneState ? 1 : 0, !switchTwoState ? 1 : 0, switchThreeState ? 1 : 0];
                            }} defaultChecked={module[0].permission[1] ? true : false} checked={switchTwoState} />} label={"Create/Edit"} />
                    <FormControlLabel control={
                        <CustomSwitch
                            onChange={(e) => {
                                handleModuleAccessChange();
                                reRenderPage();
                                setSwitchThreeState(!switchThreeState);
                                modulePermissionObj[mName] = [switchOneState ? 1 : 0, switchTwoState ? 1 : 0, !switchThreeState ? 1 : 0];
                            }} defaultChecked={module[0].permission[2] ? true : false} checked={switchThreeState} />} label={"Delete"} />

                    <Tooltip title="Show specific fields">
                        <IconButton onClick={toggleOpen}>
                            {!isOpen && <KeyboardArrowDownIcon />}
                            {isOpen && <KeyboardArrowUpIcon />}
                        </IconButton>
                    </Tooltip>

                </Stack>}
            </Box>
            <Collapse in={isOpen}>
                <Box module={3} sx={{ border: 1, borderColor: 'divider' }}>
                    <Box pl={2} pr={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: context.pageBackgroundColor }}>
                        <h4>Fields</h4>
                        <Stack direction="row" spacing={2}>
                            {
                                [["Invisible", "gray"], ["Read-Only", "orange"], ["Write", "green"]].map(x => {
                                    return <Chip size="small" icon={<CircleIcon size="small" sx={{ "&&": { color: x[1] } }} />} label={x[0]} />

                                })
                            }
                        </Stack>
                    </Box>
                    <Divider />
                    <Box p={2}>
                        <Grid container spacing={3} sx={{ mt: 2, ml: 1 }}>
                            {
                                Object.keys(selectedRole.perms[0][module[0].moduleName]).map(f => {
                                    // console.log("this is the f of Selected Role: ", f, "    sdgsd ", selectedRole)
                                    return <>
                                        <CustomField label={f} fieldColor={(selectedRole.perms[0][module[0].moduleName][f][2]) ? colorArray[2] : selectedRole.perms[0][module[0].moduleName][f][1] ? colorArray[1] : colorArray[0]} selectedRole={selectedRole} selectedModule={module[0].moduleName} reRenderPage={reRenderPage} setSaveChangeData={setSaveChangeData} />
                                    </>
                                })
                            }

                        </Grid>
                    </Box>
                </Box>
            </Collapse>
            <Divider />
        </Box>
    }
    else
        return <></>
}




function CustomField(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const { f, label, fieldColor, selectedRole, selectedModule, reRenderPage, setSaveChangeData } = props;
    const listItems = [["Invisible", 0, "Gray"], ["Read-Only", 1, "Orange"], ["Write", 2, "Green"]];
    const [changedFieldColor, setChangedFieldColor] = useState(fieldColor);
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
    }, []);

    function handleChange(item, label, selectedRole, selectedModule) {
        setChangedFieldColor(item[2])
        let temp = {}
        temp = selectedRole;
        if (item[0] == "Write") {
            temp.perms[0][selectedModule][label][0] = 1
            temp.perms[0][selectedModule][label][1] = 1
            temp.perms[0][selectedModule][label][2] = 1
        }
        else if (item[0] == "Invisible") {
            temp.perms[0][selectedModule][label][0] = 1
            temp.perms[0][selectedModule][label][1] = 0
            temp.perms[0][selectedModule][label][2] = 0
        }
        else if (item[0] == "Read-Only") {
            temp.perms[0][selectedModule][label][0] = 0
            temp.perms[0][selectedModule][label][1] = 1
            temp.perms[0][selectedModule][label][2] = 0
        }
        reRenderPage();
        messageApi.open({
            type: "success",
            content: "Please save the changes",
        });
        setSaveChangeData(temp);
        // console.log("Item : ", item)
        // console.log("label : ", label)
        // console.log("selectedRole : ", selectedRole)
        // console.log("PermissionChanged : ", temp)
        handlePopoverClose();

    }

    function handleClick(e) {
        setAnchorEl(e.currentTarget);
    }
    function handlePopoverClose() {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);
    return <Grid item xl={2} lg={2} md={4} sm={6} xs={12}>
        {contextHolder}
        <Box sx={{ maxWidth: '150px', overflow: 'hidden' }}>
            <Tooltip title={label}>
                <Chip size="small" label={label} onClick={handleClick} icon={<CircleIcon fontSize='small' sx={{ "&&": { color: changedFieldColor } }} />} />
            </Tooltip>

            <Popover open={open} anchorEl={anchorEl} onClose={handlePopoverClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                <List dense>
                    {listItems.map(item => {
                        return <ListItem key={f} disablePadding>
                            <ListItemButton onClick={(e) => { handleChange(item, label, selectedRole, selectedModule) }}>
                                <ListItemIcon>
                                    <CircleIcon fontSize='small' sx={{ color: item[2] }} />
                                </ListItemIcon>
                                <ListItemText secondary={item[0]} />
                            </ListItemButton>
                        </ListItem>
                    })}

                </List>
            </Popover>
        </Box>

    </Grid>
}