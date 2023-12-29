import React, { useEffect, useState } from 'react';
import { Box, Typography, Dialog, Button, DialogContent, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
const CustomDialog = (props) => {
    const { message, customAction, open, onClose } = props;
    function onDelete() {
        customAction();
        onClose();
    }
    return <>
        <Dialog open={open}>
            <DialogContent>
                <Box mt={2}>
                    <Typography>{message}</Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <LoadingButton onClick={onDelete}>Delete</LoadingButton>
            </DialogActions>
        </Dialog>
    </>
}
export default CustomDialog;