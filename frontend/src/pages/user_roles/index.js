import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import {
    Box, Paper, Typography, Dialog, Button, DialogContent, Link, DialogTitle, TextField,
    DialogActions,
    TableRow, Table, TableCell, TableBody, IconButton,
    TableContainer,
    TableHead,
    CircularProgress,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';
// import { FETCH_USER_ROLES_URL,CREATE_USER_ROLE_URL, UPDATE_ROLE_PERMS_URL, GET_BACKOFFICE_USERS_URL, ASSIGN_ROLE_URL, DELETE_USER_ROLE} from '../../../helpers/superAdminApiStrings';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ModuleAccessComponent from './moduleAccessComponent';
import Collapse from '@mui/material/Collapse';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Save from '@mui/icons-material/Save';
import moment from 'moment';
import { ADD_USER_ROLE, DELETE_USER_ROLE, GET_USER_MODULES, GET_USER_ROLES, UPDATE_USER_ROLE_FIELD_PERMISSION, ADD_USER_ROLE_MODULE_PERMISSION, UPDATE_USER_ROLE_MODULE_PERMISSION, UPDATE_USER_ROLE_DATE } from '../../helper/apiString';
import axios from 'axios';
import { message } from "antd";
import userRoleConext from './userRoleContext';

export default function UserRoles(props) {

    const columnHeads = ["Role Name", "Created", "Updated"];
    const [userRoles, setUserRoles] = useState([]);
    const [userModules, setUserModules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUserRoleListChanged, setIsUserRoleListChanged] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [saveChangeData, setSaveChangeData] = useState();
    const [createRoleDialogOpen, setCreateRoleDialogOpen] = useState(false);
    const newRoleValues = useRef({ roleName: "", desc: "" });
    const [messageApi, contextHolder] = message.useMessage();
    let context = useContext(userRoleConext);

    function fetchUserRoles() {
        setIsLoading(true);
        axios.get(GET_USER_ROLES).
            then(res => {
                setUserRoles(res.data);
                axios.get(GET_USER_MODULES).
                    then(result => {
                        setIsLoading(false);
                        setUserModules(result.data);

                    }).catch(err => {
                        console.log(err.message);
                        setIsLoading(false);
                    })


            }).catch(err => {
                console.log(err.message);
                setIsLoading(false);
            })
    }

    function createUserRole() {
        if (newRoleValues.current.roleName.length == 0)
            return;

        setIsCreating(true);
        setIsUserRoleListChanged(true);
        axios.post(ADD_USER_ROLE, newRoleValues.current)
            .then(res1 => {
                let roleName = newRoleValues.current.roleName;
                let roles = {}
                roles[roleName] = [0, 0, 0];
                axios.post(ADD_USER_ROLE_MODULE_PERMISSION, { roles: roles })
                    .then(res => {
                        setUserRoles(old => [...old, res1.data]);
                        setIsCreating(false);
                        closeCreateRoleDialog();
                        setIsUserRoleListChanged(false);
                        window.location.reload();
                    }).catch(e => {
                        console.log(e.message);
                    })

            }).catch(e => {
                console.log(e.message);

                if (e.response.status == 409) {
                    messageApi.open({
                        type: "error",
                        content: "User Role Already Exist",
                    });
                    setCreateRoleDialogOpen(false);
                    setTimeout(() => { }, 1000)
                    window.location.reload();
                }
                setIsCreating(false);

            })
    }

    function deleteUserRole(roleName) {
        axios.post(DELETE_USER_ROLE, { roleName: roleName })
            .then(res => {
                setIsUserRoleListChanged(false);
                window.location.reload();
                // setUserRoles(old => old.filter(r => r.roleName != roleName));
            }).catch(e => {
                console.log(e.message);
            });

    }

    useEffect(() => {
        document.title = "User Roles";
        fetchUserRoles();
    }, []);

    function openCreateRoleDialog() {
        setCreateRoleDialogOpen(true);
    }
    function closeCreateRoleDialog() {
        setCreateRoleDialogOpen(false);
    }

    function handleNewRoleValueChange(e) {
        let temp = newRoleValues.current;

        temp[e.target.name] = e.target.value;

        newRoleValues.current = temp;
    }

    return <Box sx={{ height: '100%' }}>
        {contextHolder}
        <Dialog open={createRoleDialogOpen}>
            <DialogTitle>
                Create New Role
            </DialogTitle>
            <DialogContent>
                <Box mt={2}>
                    <TextField label={"Role Name"} onChange={handleNewRoleValueChange} name={"roleName"} fullWidth />
                    <br /><br />
                    <TextField label={"Role Description"} onChange={handleNewRoleValueChange} name={"desc"} fullWidth />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeCreateRoleDialog} disabled={isCreating}>Cancel</Button>
                <LoadingButton onClick={createUserRole} loading={isCreating}>Create</LoadingButton>
            </DialogActions>
        </Dialog>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', paddingLeft: 4, paddingRight: 4 }}>
            <Box>
                <h1>User Roles</h1>
                <Typography component={"div"} variant={'p'}>Role is a set of permissions dealing with module access and operations, setup customizations, and access to various apps. You can provide different set of permissions to various users.</Typography>
                <br />
            </Box>
            <Box sx={{ minWidth: 150 }}>
                <Button variant={'contained'} onClick={openCreateRoleDialog} >Add New Role</Button>
            </Box>
        </Box>

        <TableContainer>
            <Table stickyHeader>
                <TableHead>
                    <TableRow><TableCell></TableCell>
                        {columnHeads.map(h => { return <TableCell>{h}</TableCell>; })}
                        <TableCell align="right">Action(s)</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {!isUserRoleListChanged && Array.isArray(userRoles) &&
                        <>
                            {userRoles.map(role => {
                                return userModules.length != 0 ? <Row deleteUserRole={deleteUserRole} data={role} userModules={userModules} userRoles={userRoles} setSaveChangeData={setSaveChangeData} saveChangeData={saveChangeData} /> : <></>
                            })}
                        </>
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </Box>;


}

function Row(props) {


    const [data, setData] = useState(props.data);
    const { saveChangeData, setSaveChangeData } = props;
    let [messageApi, contextHolder] = message.useMessage();
    const [userRoles, setUserRoles] = useState(props.userRoles);
    const [userModules, setUserModules] = useState(props.userModules);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [somethingChanged, setSomethingChanged] = useState(false);
    const [deleteUserRoleDialog, setDeleteUserRoleDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    let [modulePermissionObj, getModulePermission] = useState({});


    function toggleAccordion() {
        setIsAccordionOpen(old => !old);
    }

    useEffect(() => {
    }, [])

    function handleModuleAccessChange(view, edit, del) {
        setSomethingChanged(true);
    }

    function saveChanges(data) {
        setIsSaving(true);
        modulePermissionObj.roleName = data.roleName;
        if (Object.keys(modulePermissionObj).length > 1) {
            axios.post(UPDATE_USER_ROLE_MODULE_PERMISSION, { data: modulePermissionObj, _id: data._id }).then(res => {
                setIsSaving(false);
                setSomethingChanged(false);
                modulePermissionObj = {}
                messageApi.open({
                    type: "success",
                    content: "Changes saved successfully",
                });
            }).catch(err => {
                setIsSaving(false);
                console.log(err.message);
            });
        }
        if (saveChangeData != undefined) {
            axios.post(UPDATE_USER_ROLE_FIELD_PERMISSION, { data: saveChangeData }).then(res => {
                setIsSaving(false);
                setSomethingChanged(false);
            }).catch(err => {
                setIsSaving(false);
                console.log(err.message);
            })
        }
    }
    let loopToFilterData = (m, roleName) => {
        let a = []
        let rolePermissions = []
        for (let i = 0; i < userRoles.length; i++) {
            if (userRoles[i].roleName == roleName) {
                rolePermissions = userRoles[i].perms[0];
                break;
            }
        }
        if (rolePermissions.hasOwnProperty("Fee Group")) {
            if (m["moduleName"] == "Fee Group") {
                a.push(m);
            }
        }
        if (rolePermissions.hasOwnProperty("Securities")) {
            if (m["moduleName"] == "Securities") {
                a.push(m)
            }
        }
        if (rolePermissions.hasOwnProperty("User Roles")) {
            if (m["moduleName"] == "User Roles") {
                a.push(m)
            }
        }
        if (rolePermissions.hasOwnProperty("Users")) {
            if (m["moduleName"] == "Users") {
                a.push(m)
            }
        }
        if (rolePermissions.hasOwnProperty("SMTP Setup")) {
            if (m["moduleName"] == "SMTP Setup") {
                a.push(m)
            }
        }
        if (rolePermissions.hasOwnProperty("Holding Cost")) {
            if (m["moduleName"] == "Holding Cost") {
                a.push(m)
            }
        }

        return a;
    }
    let fileteredData = (m, roleName) => {
        let a = []
        a = loopToFilterData(m, roleName)
        return a;
    }
    function closeDeleteRoleDialog() {
        setDeleteUserRoleDialog(false);
    }
    return <React.Fragment>
        <Dialog open={deleteUserRoleDialog}>
            <DialogContent>
                <Box mt={2}>
                    <Typography>Are you sure you want to delete this role?</Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDeleteRoleDialog}>Cancel</Button>
                <LoadingButton onClick={() => { props.deleteUserRole(data.roleName); closeDeleteRoleDialog() }}>Delete</LoadingButton>
            </DialogActions>
        </Dialog>
        {contextHolder}
        <TableRow sx={{ "& td": { border: 0 } }}>
            <TableCell sx={{ width: '30px' }}>
                <IconButton size="small" onClick={toggleAccordion}>
                    {isAccordionOpen ? <KeyboardArrowDownIcon size="small" /> : <KeyboardArrowUpIcon size="small" />}
                </IconButton>
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{data.roleName}</span>
                    <span style={{ fontSize: '12px', color: 'gray' }}>{data.desc}</span>
                </Box>
            </TableCell>
            <TableCell>{moment(data.createdAt).format("DD-MM-yyyy")}<br />
                <span style={{ color: 'gray', fontSize: '12px' }}>{moment(data.createdAt).format("hh:mm A")}</span>
            </TableCell>
            <TableCell>{moment(data.updatedAt).format("DD-MM-yyyy")}<br />
                <span style={{ color: 'gray', fontSize: '12px' }}>{moment(data.updatedAt).format("hh:mm A")}</span>
            </TableCell>

            <TableCell style={{ display: 'flex', justifyContent: 'end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: 'fit-content' }}>
                    <IconButton size="small" onClick={(e) => {
                        setDeleteUserRoleDialog(true)
                    }}>
                        <DeleteOutline size="small" />
                    </IconButton>
                    <IconButton disabled={!somethingChanged} onClick={() => saveChanges(data)}>
                        <Save size="small" />
                    </IconButton>
                </Box>
            </TableCell>
        </TableRow>

        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                <Collapse in={isAccordionOpen} timeout="auto" unmountOnExit>
                    {

                        userModules.map(m => {
                            // { console.log(m) }
                            return <ModuleAccessComponent
                                key={m.key}
                                reRenderPage={() => {
                                    // console.log("Rendering now");
                                    setSomethingChanged(true);
                                    // console.log("executing now");
                                }}
                                handleModuleAccessChange={handleModuleAccessChange}
                                selectedRole={data}
                                userRoles={userRoles}
                                setSaveChangeData={setSaveChangeData}
                                modulePermissionObj={modulePermissionObj}
                                module={fileteredData(m, data.roleName)} />
                        })}
                </Collapse>


            </TableCell>
        </TableRow>
    </React.Fragment>;
}