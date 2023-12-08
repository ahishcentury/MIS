import React, { useRef, useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, Autocomplete } from '@mui/material';
import DialogWithTitleAndClose from "../../components/dialogWithTitleAndClose";
import AppContext from "../../../AppContext";
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Loader from '../../components/loader';
import { CREATE_BACKOFFICE_USER } from '../../../helpers/superAdminApiStrings';


export default function NewRoleDialog(props) {
    const { open, onClose, roles, onCreateSuccess } = props;
    const appContext = useContext(AppContext);
    const [executingMsg, setExecutingMsg] = useState(false);
    const [dob, setDob] = useState('');
    const data = useRef({
        fname: "", lname: "", dob: "", role: "", email: "", phone: ""
    });

    function onChange(e) {
        data.current[e.target.name] = e.target.value;
        console.log(data.current);
    }

    function createUser() {
        setExecutingMsg(appContext.getString("creating"));
        axios.post(CREATE_BACKOFFICE_USER, data.current)
            .then(res => {
                setExecutingMsg(false);
                appContext.setSeverity("success");
                appContext.setSnackbarMsg(appContext.getString("created"));
                onCreateSuccess(res.data);
                onClose();

            }).catch(e => {
                if (e.response.status === 409)
                    displayError("Email/phone already exists");

                else if (e.response.status === 400)
                    displayError("Please enter valid values");

                else
                    displayError("Unknown ");

            })
    }

    function displayError(msg) {
        appContext.setSeverity("error");
        appContext.setSnackbarMsg(appContext.getString("errorOccured") + ":\n" + msg);
        setExecutingMsg(false);
    }

    return <DialogWithTitleAndClose maxWidth={"sm"} fullWidth open={open} onClose={onClose} title={"Create Backoffice User"}>

        {executingMsg && <Loader msg={executingMsg} />}

        <Box sx={{ height: '500px', paddingLeft: 4, paddingRight: 4, paddingTop: 2, paddingBottom: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography>First name</Typography>
                    <TextField
                        onChange={onChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                        fullWidth size="small" name="fname" />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography>Last name</Typography>
                    <TextField
                        onChange={onChange}

                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                        fullWidth size="small" name="lname" />
                </Box>
            </Box>
            <Box>
                <Typography>Email</Typography>
                <TextField
                    onChange={onChange}

                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon />
                            </InputAdornment>
                        ),
                    }}
                    fullWidth size="small" name="email" />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography>Phone</Typography>
                    <TextField
                        onChange={onChange}

                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneIphoneIcon />
                                </InputAdornment>
                            ),
                        }}
                        fullWidth size="small" name="phone" />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography>User Role</Typography>

                    <Autocomplete
                        disablePortal
                        onChange={(e, value) => {
                            onChange({ target: { name: "role", value: value.value } })
                        }}
                        size="small"
                        name="role"
                        options={roles.map(role => ({ label: role.roleName, value: role._id }))}
                        sx={{ width: '100%' }}
                        renderInput={(params) => <TextField sx={{ fontSize: '10px' }} size="small" {...params} />}
                    />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                    <Typography>Date of Birth</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            size="small"
                            value={dob}
                            onChange={(newValue) => {
                                setDob(newValue);
                                onChange({ target: { name: "dob", value: newValue.$d } });
                            }}
                            renderInput={(params) => <TextField size="small" {...params} />}
                        />
                    </LocalizationProvider>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Button
                        sx={{ borderRadius: 1, marginTop: 2 }}
                        size="large"
                        fullWidth variant="contained" onClick={createUser}>Create</Button>
                </Box>
            </Box>

        </Box>
    </DialogWithTitleAndClose>
}