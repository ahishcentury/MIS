import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, } from "@mui/material";

import { List, message, Skeleton, Button, Space, Divider, Empty, Result, Popconfirm } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { FETCH_FORMATTED_FILE_MASTER_BY_NAME, GET_FORMATTED_FILE_HOLDING_COST, READ_HOLDING_COST_UPLOADS_DIR, REMOVE_FORMATTED_FILE } from '../../helper/apiString';



export default function UploadHistory(props) {

    const { onViewFile, setLastUploadedFile, selectedFilename, uploadedFiles, setUploadedFiles, setChanges } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(true);
    const [connError, setConnError] = useState(false);


    function getFormattedFileHoldingCost() {
        setConnError(false);
        setIsLoading(true);
        axios.get(GET_FORMATTED_FILE_HOLDING_COST)
            .then(res => {
                setUploadedFiles(res.data);
                setIsLoading(false);
                setLastUploadedFile(res.data[0]);
            }).catch(e => {
                console.log(e.message);
            })
    }
    function readHoldingCostUploadsDir() {
        setConnError(false);
        setIsLoading(true);
        axios.get(READ_HOLDING_COST_UPLOADS_DIR)
            .then(res => {
                setIsLoading(false);
                setLastUploadedFile(res.data[0]);
            }).catch(e => {
                console.log(e.message);
            })
    }
    useEffect(() => {
        readHoldingCostUploadsDir();
        getFormattedFileHoldingCost();
    }, [])


    const height = {
        lg: '85vh',
        xl: '85vh',
        md: '85vh',
        sm: 'auto', xs: 'auto'
    };

    return <Box sx={{
        borderLeft: '1px solid', borderColor: 'divider',
        height: height
    }}>
        {contextHolder}

        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'whitesmoke', padding: 2, textAlign: 'center' }}>
            Upload History
        </Box>
        <Box sx={{ textAlign: 'left', }}>
            <List size='large'>
                {uploadedFiles.map(file => {
                    return <ListItem file={file}
                        messageApi={messageApi}
                        onViewFile={onViewFile}
                        uploadedFiles={uploadedFiles}
                        setChanges={setChanges}
                        setLastUploadedFile={setLastUploadedFile}
                        setUploadedFiles={setUploadedFiles}
                        selectedFilename={selectedFilename} />

                })}


            </List>

            {
                !isLoading && uploadedFiles.length === 0 && !connError && <Box sx={{
                    paddingTop: 8
                }}>
                    <Empty description={"No data available"} />
                </Box>
            }

            {
                !isLoading && uploadedFiles.length === 0 && connError && <Box>
                    <Result
                        status="warning"
                        title="Could not fetch data from the server. Something went wrong."
                        extra={
                            <Button onClick={getFormattedFileHoldingCost} type="primary" key="console">
                                Try again
                            </Button>
                        }
                    />
                </Box>
            }

            {
                isLoading && <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
                    <ListSkeleton />
                    <ListSkeleton />
                    <ListSkeleton />
                    <ListSkeleton />
                    <ListSkeleton />
                    <ListSkeleton />
                </Box>
            }

        </Box>
    </Box>
}


function ListItem(props) {

    const { onViewFile, setLastUploadedFile, setUploadedFiles, uploadedFiles, file, selectedFilename, messageApi, setChanges } = props;
    const [isRemoving, setIsRemoving] = useState(false);

    function removeFile() {
        setIsRemoving(true);
        axios.post(REMOVE_FORMATTED_FILE + "/" + file._id).
            then(res => {
                setIsRemoving(false);
                messageApi.open({
                    type: 'success',
                    content: `${file.originalName} removed successfully`
                });

                let tempUploadedFiles = uploadedFiles.filter(x => x._id !== file._id);
                setUploadedFiles(tempUploadedFiles);

                if (tempUploadedFiles.length == 0) {
                    setLastUploadedFile(null)
                } else {
                    setLastUploadedFile(tempUploadedFiles[0]);
                }

            }).catch(e => {
                setIsRemoving(false);
                messageApi.open({
                    type: 'error',
                    content: "Could not remove file."
                });

            })
    }
    function fetchFormattedFileByName(fileName) {
        axios.post(FETCH_FORMATTED_FILE_MASTER_BY_NAME + "/" + fileName)
            .then(res => {
                res.data.forEach(element => {
                    if (res.data[0].originalName == fileName) {
                        if (element.hasOwnProperty("changes")) {
                            setChanges(element["changes"]);
                        }
                        else {
                            setChanges({});
                        }
                    }
                });
            }).catch(e => {
                console.log(e.message);
            })
    }

    return <List.Item key={file._id} extra={<>
        {!isRemoving && <Space>
            <a onClick={() => {
                if (file.originalName === selectedFilename) {
                    messageApi.open({
                        type: 'info',
                        content: `${selectedFilename} is already loaded.`
                    });
                } else {
                    fetchFormattedFileByName(file.originalName)
                    onViewFile(file.uploadedName, file.originalName, file.changes)
                }
            }}>View</a>
            <Box sx={{ width: '1px', height: '10px', backgroundColor: 'divider' }}></Box>

            <Popconfirm
                title="Are you sure you want to remove this file?"
                onConfirm={removeFile}
                okText="Yes"
                cancelText="No"
            >
                <a>Remove</a>

            </Popconfirm>
        </Space>}

        {isRemoving && <Space><CircularProgress disableShrink size={16} /><span>Removing...</span></Space>}
    </>}>
        <List.Item.Meta
            title={file.originalName}
            description={
                <span>{Object.keys(file.changes || {}).length} Changes • {moment(file.createdAt).format("DD MMM YY [at] hh:mm a")}</span>} />
    </List.Item>
}


function ListSkeleton() {
    return <Box sx={{ width: '100%' }}>
        <Space direction='vertical' style={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Skeleton.Button active style={{ height: 20, width: 100 }} />
                <Skeleton.Button active style={{ height: 10, width: 50 }} />


            </Box>
            <Skeleton.Button active style={{ height: 20, width: 200 }} />

        </Space>
        <Divider />
    </Box>
}