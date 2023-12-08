import { DialogContent,Paper,Box,Dialog,FormControl,FormLabel,FormControlLabel,Radio,Divider, IconButton, RadioGroup, Typography, CircularProgress } from '@mui/material';
import React,{useState,useRef,useEffect, useContext} from 'react';
import CloseIcon from '@mui/icons-material/Close';

export default function DialogWithTitleAndClose(props){

    const {open,onClose,maxWidth="xl",fullWidth=false,title} = props;

   
    return <Dialog open={open} fullWidth={fullWidth} maxWidth={maxWidth}>
        <Box p={2} sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <Typography sx={{fontSize:'16px',fontWeight:'bold'}} >{title}</Typography>
            <IconButton size="small" onClick={onClose}><CloseIcon size="small"/></IconButton>
        </Box>
        <Divider/>
        {props.children}
    </Dialog>
}