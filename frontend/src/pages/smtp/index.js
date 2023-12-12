import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, InputAdornment, TextField, Button, CircularProgress } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { GET_SMTP, UPDATE_SMTP } from '../../helper/apiString';
import { message } from "antd";

export default function SMTP(props) {

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    name: "", host: "", port: "", username: "", password: ""
  });
  const [isDataLoaded, setIsDataLoaded] = useState(true);
  const [somethingChanged, setSomethingChanged] = useState(false);
  const [toggle, setToggle] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const [messageApi, contextHolder] = message.useMessage();

  function onChange(e) {
    setData(old => {
      let temp = old;
      temp[e.target.name] = e.target.value;
      return temp;
    });
    setSomethingChanged(true);
  }

  function getSMTP() {
    setIsDataLoaded(false);
    setIsLoading(true);
    axios.get(GET_SMTP).then(res => {
      setData({ username: res.data.username, password: "********", name: res.data.name, port: res.data.port, host: res.data.host });
      setIsLoading(false);
      setIsDataLoaded(true);
    }).catch(e => {
      setIsLoading(false);
      console.log(e.message);
      if (e.response.status === 404)
        setIsDataLoaded(true)
    })
  };

  function updateSMTP() {
    setIsLoading(true);
    setIsDataLoaded(false);
    axios.post(UPDATE_SMTP, data).then(res => {
      setIsLoading(false);
      setIsDataLoaded(true);
      messageApi.open({
        type: "success",
        content: "SMTP updated Successfully",
      });
      // window.location.href = "/mis_home/smtp";
      getSMTP();
      data.password = "************";
    }).catch(e => {
      setIsLoading(false);
      console.log(e.message);
    })
  };

  useEffect(() => {
    document.title = "SMTP Setup";
    getSMTP();
  }, [])



  return <Box sx={{ width: '100%', height: '100vh' }}>
    {contextHolder}
    <Box sx={{ paddingLeft: 4, paddingRight: 4 }}>
      <h1>SMTP Server Setup</h1>
    </Box>
    <br /><br />
    {
      isLoading && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress disableShrink />
      </Box>
    }
    {

      isDataLoaded && <Box sx={{ width: '400px', paddingLeft: 4, paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField name="name" defaultValue={data.name} label="Name" size='small' onChange={onChange} />
        <TextField name="host" defaultValue={data.host} label="Host" size='small' onChange={onChange} />
        <TextField name="port" defaultValue={data.port} label="Port" size='small' onChange={onChange} />
        <TextField name="username" defaultValue={data.username} size='small' label="Login / Username" onChange={onChange} />
        <TextField name="password" defaultValue={data.password} onChange={onChange}
          InputProps={{ // <-- This is where the toggle button is added.
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            )
          }}
          size='small'
          type={showPassword ? "text" : "password"}
          label={"Password"}
        />
        <Button variant="contained" onClick={updateSMTP} disabled={!somethingChanged}>Save Changes</Button>
      </Box>
    }

  </Box>
}
