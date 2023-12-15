import React, { useState, useRef, useContext, useEffect } from 'react';
import { Box, Button, Paper, Grid, Typography, Dialog, Link, DialogTitle, TextField, DialogActions } from '@mui/material'
import moment from 'moment';
import axios from 'axios';
import Loader from '../../components/loader';
import AppContext from "../../AppContext";
import { LoadingButton } from '@mui/lab';
import { Table, Space, Divider, Tooltip, Popover, Switch, Select as SelectANTD, Input, Spin } from 'antd';
import { EyeFilled, RetweetOutlined, MailOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
// import { GET_BACKOFFICE_USERS, UPDATE_ACCOUNT_ACTIVATION_STATUS,UPDATE_BACKOFFICE_USER_INFO } from '../../../helpers/superAdminApiStrings';
import { DELETE_USER, GET_USER, GET_USER_ROLES, UPDATE_USER_INFO } from '../../helper/apiString';
import NewUserDialog from './newUserDialog';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import UpdatableTextFieldANTD from '../../components/editableTableTextComponent';

export default function Users(props) {
    const { modulePermissionData } = props;
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [executingMsg, setExecutingMsg] = useState(false);
    const [render, setRender] = useState(false);
    const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);

    const [rolesForSelectTag, setRolesForSelectTag] = useState([]);


    function openNewUserDialog() {
        setNewUserDialogOpen(true);
    }

    function closeNewUserDialog() {
        setNewUserDialogOpen(false);
    }
    const columns = [
        {
            title: "Email", render: (row) => <UpdatableTextFieldANTD
                title={"Email"}
                value={row.email}
                // updateUrl={UPDATE_BACKOFFICE_USER_INFO}
                fieldName={"email"}
                itemId={row._id}
                itemIdParamName={"userId"}
                fieldType={"email"}
            />
        },

        { title: "Name", dataIndex: "name", render: (name) => <Space style={{ width: 150 }}>{name}</Space> },
        { title: "Role", render: (row) => <RoleComponent row={row} roles={rolesForSelectTag} /> },
        { title: "Phone", dataIndex: "phone" },
        { title: "Account", render: (row) => <AccountStatusComponent {...row} modulePermissionData={modulePermissionData} /> },

        {
            title: "Created", dataIndex: "createdAt", render: (x) => {
                return moment(x).format("DD/MM/yy")
            }
        },
        { title: "Action(s)", render: (row) => <ActionsComponent {...row} modulePermissionData={modulePermissionData} /> }
    ]


    function getUsersRole() {
        axios.get(GET_USER_ROLES).then(res => {
            setRoles(res.data);
            console.log(res.data)
            setRolesForSelectTag(res.data);
        }).catch(e => {
            console.log(e.message);
        })
    }
    function getUsers() {
        setIsLoading(true);
        axios.get(GET_USER).then(res => {
            setIsLoading(false);
            setUsers(res.data);
        }).catch(e => {
            setIsLoading(false);
            console.log(e.message);
        })
    }

    function onCreateSuccess(data) {
        setUsers(old => {
            let temp = old;
            temp = [...temp, data];
            return temp;
        });
        setRender(old => !old);
    }


    useEffect(() => {
        getUsersRole();
        getUsers();
    }, [])
    console.log(modulePermissionData, "modulePermissionData")
    return <Box sx={{ width: '100%', height: '100vh' }}>
        <Box sx={{ paddingLeft: 4, paddingRight: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1>Users</h1>
            {modulePermissionData && modulePermissionData[1] == 1 && <Button variant="contained" onClick={openNewUserDialog}>Create New User</Button>}
        </Box>

        {
            executingMsg && <Loader msg={executingMsg} />
        }

        <NewUserDialog
            open={newUserDialogOpen}
            onClose={closeNewUserDialog}
            roles={roles}
            onCreateSuccess={onCreateSuccess} />

        {modulePermissionData && <Table dataSource={users} columns={columns} pagination={false} loading={isLoading} />}


    </Box>
}



function AccountStatusComponent({ _id, activated, modulePermissionData }) {
    const appContext = useContext(AppContext);
    const [checked, setChecked] = useState(activated);
    const [executingMsg, setExecutingMsg] = useState(false);

    function onChange(newChecked) {
        console.log("New Checked is ", newChecked);
        setExecutingMsg(true);
        axios.post(UPDATE_USER_INFO, { userId: _id, value: newChecked, field: "activated" })
            .then(res => {
                setExecutingMsg(false);
                setChecked(newChecked);
            }).catch(e => {
                setChecked(checked);
                setExecutingMsg(false);

            });
    }
    function logCheck() {
        console.log("Can't change account status", modulePermissionData)
        if (modulePermissionData) {
        }
    }

    return <>{<Switch
        loading={executingMsg}
        onChange={modulePermissionData && modulePermissionData[1] == 1 ? onChange : logCheck}
        unCheckedChildren={"Inactive"}
        checkedChildren={"Active"}
        checked={checked} />}</>
}

function RoleComponent({ row, roles }) {

    const appContext = useContext(AppContext);
    let [selectedRole, setSelectedRole] = useState(row.role);
    const [isUpdating, setIsUpdating] = useState(false);
    const [rolesDropDown, setRolesDropDown] = useState([]);

    function update(role) {
        setIsUpdating(true);
        axios.post(UPDATE_USER_INFO, {
            userId: row._id,
            field: 'role',
            value: role

        }).then(res => {
            setIsUpdating(false);
            setSelectedRole(role);
        }).catch(e => {
            setIsUpdating(false);
        })
    }

    const onChange = (value) => {
        if (window.confirm("Are you sure you want to change the role?")) {
            update(value);
            console.log("This is the value ", value)
        }
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };
    for (let i = 0; i < roles.length; ++i) {
        let rolesObject = {};
        rolesObject.label = roles[i].roleName;
        rolesObject.value = roles[i]._id;
        rolesDropDown.push(rolesObject)
    }
    return <>
        {isUpdating && <Loader size={16} marginTop={5} />}
        <SelectANTD
            showSearch
            style={{ width: '100%' }}
            value={selectedRole}
            placeholder="Select role"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={rolesDropDown}
        />
    </>
}

function ActionsComponent({ _id, modulePermissionData }) {



    const appContext = useContext(AppContext);
    const [executingMsg, setExecutingMsg] = useState(false);
    const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);


    function removeUser() {
        if (window.confirm("Are you sure you want to delete this user permanently?")) {
            axios.post(DELETE_USER, { _id: _id })
                .then(res => {
                    window.location.reload();
                }).catch(e => {
                    console.log(e.message);
                });
        }
    }

    function editValues() {
        console.log("Hello");
    }

    return <Space>
        {/* <Dialog open={deleteUserDialogOpen}>
            <DialogTitle>
                Delete User
            </DialogTitle>
            <DialogActions>
                <Button onClick={setDeleteUserDialogOpen(false)}>Cancel</Button>
                <LoadingButton onClick={removeUser}>Delete</LoadingButton>
            </DialogActions>
        </Dialog> */}
        {executingMsg && <Loader msg="" size={16} marginTop={5} />}
        {modulePermissionData && modulePermissionData[2] == 1 && <><Tooltip title="Remove user permanently"><a onClick={removeUser}><DeleteOutlined /></a></Tooltip>
            <Divider type="vertical" /></>}
        {modulePermissionData && modulePermissionData[1] && <Tooltip title="Edit details of user"><a onClick={editValues}><EditOutlined /></a></Tooltip>}
    </Space>
}