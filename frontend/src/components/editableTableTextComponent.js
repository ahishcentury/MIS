import React, { useState, useRef, useContext, useEffect } from 'react';
import { Table, Space, Input, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Box, Button, Typography, IconButton } from '@mui/material';
import Loader from './loader';
import AppContext from "../AppContext";
import axios from 'axios';

export default function UpdatableTextFieldANTD(props) {
    const appContext = useContext(AppContext);
    const { title, value, updateUrl, fieldName, itemId, itemIdParamName, fieldType = "text" } = props;
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    const [editMode, setEditMode] = useState(false);

    function enableEditMode() {
        setEditMode(true);
    }

    function disableEditMode() {
        setEditMode(false);
    }

    function onChange(e) {
        setSelectedValue(e.target.value);
    }

    function update() {
        setIsUpdating(true);
        // axios.post(updateUrl, {
        //     [itemIdParamName]: itemId,
        //     field: fieldName,
        //     value: selectedValue
        // }).then(res => {
        //     setIsUpdating(false);

        //     appContext.setSeverity('success');
        //     appContext.setSnackbarMsg("Updated");
        //     disableEditMode();


        // }).catch(e => {
        //     setIsUpdating(false);
        //     appContext.setSnackbarMsg(appContext.getString("errorOccured"));
        //     appContext.setSeverity("error");
        // })

    }


    return <Space>
        {isUpdating && <Loader msg="" />}
        {!editMode && <Space size="middle">
            {/* <Tooltip title={appContext.getString("enterEditMode")}>
                <IconButton size="small" onClick={enableEditMode}><EditOutlined /></IconButton>
            </Tooltip> */}

            <span>{selectedValue}</span>
        </Space>}
        {editMode && <Space size="middle">
            {/* <Tooltip title={appContext.getString("saveChanges")}>
                <IconButton size="small" onClick={update}><SaveOutlined /></IconButton>
            </Tooltip>
            <Tooltip title={appContext.getString("exitEditMode")}>
                <IconButton size="small" onClick={disableEditMode}><CloseOutlined /></IconButton>
            </Tooltip>
            <Input type={fieldType} style={{ width: '100%' }} value={selectedValue} placeholder={title} onChange={onChange} /> */}

        </Space>}
    </Space>
}