import React, { useState, useRef, useEffect } from "react";
import { Box, Grid } from "@mui/material";

import { message } from "antd";
import Button from "@mui/material/Button";
import CSVReader from "react-csv-reader";
import { FETCH_FORMATTED_FILE_MASTER, GET_FORMATTED_FILE_HOLDING_COST, UPLOAD_HOLDING_RATE_MASTER, UPLOAD_SWAP_MASTER, } from "../../helper/apiString.js";
import axios from "axios";
import { usePapaParse } from "react-papaparse";
import UploadHistory from "./uploadHistory.js";
import ImportResult from "./ImportResult/index.js";
import TableSkeleton from "./tableSkeleton.js";

export default function HoldingCostFileUploads(props) {
    const [messageApi, contextHolder] = message.useMessage();
    const { readRemoteFile } = usePapaParse();

    const [importedRows, setImportedRows] = useState([]);
    const [filename, setFilename] = useState("");
    const [isImporting, setIsImporting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSkeletonDisplayed, setIsSkeletonDisplayed] = useState(false);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [lastUploadedFile, setLastUploadedFile] = useState(null);
    const [scrollHeight, setScrollHeight] = useState(400);
    const [changes, setChanges] = useState({}); //changes made in new while compared to last one
    const errorIndex = useRef(0);
    const [resultType, setResultType] = useState(null); // whether file is imported and opened from History
    const [uploadedFiles, setUploadedFiles] = useState([]);

    function uploadSwapMasterFile() {
        setIsUploading(true);
        var formData = new FormData();

        formData.append("swapMaster", fileToUpload);
        formData.append("changes", JSON.stringify(changes));
        axios
            .post(UPLOAD_SWAP_MASTER, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                messageApi.open({
                    type: "success",
                    content: "File uploaded successfully",
                });
            })
            .catch((e) => {
                setIsUploading(false);
                console.log("Upload error :", e.message);
                messageApi.open({
                    type: "error",
                    content: "Could not upload file. Something went wrong.",
                });
            });
    }
    function uploadHoldingRateFile() {
        setIsUploading(true);
        var formData = new FormData();

        formData.append("holdingRateMaster", fileToUpload);
        formData.append("changes", JSON.stringify(changes));
        axios
            .post(UPLOAD_HOLDING_RATE_MASTER, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                messageApi.open({
                    type: "success",
                    content: "File uploaded successfully",
                });
                uploadHistory();
            })
            .catch((e) => {
                setIsUploading(false);
                console.log("Upload error :", e.message);
                messageApi.open({
                    type: "error",
                    content: "Could not upload file. Something went wrong.",
                });
            });
    }
    function uploadHistory() {
        setIsUploading(false);
        axios
            .get(GET_FORMATTED_FILE_HOLDING_COST)
            .then((res) => {
                setUploadedFiles(res.data);
                setLastUploadedFile(res.data[0]);
                setIsUploading(true);
            })
            .catch((e) => {
                setIsUploading(false);
                console.log("Upload error :", e.message);
                messageApi.open({
                    type: "error",
                    content: "Could not upload file. Something went wrong.",
                });
            });
    }
    useEffect(() => {
        document.title = "Files Master Upload";
        document
            .getElementById("importSwapDocument")
            .addEventListener("change", function (e) {
                setIsImporting(true);
                setFileToUpload(e.target.files[0]);
                setResultType("imported");
                setImportedRows([]);
                setChanges({});
            });
        document
            .getElementById("importHoldingRateDocument")
            .addEventListener("change", function (e) {
                setIsImporting(true);
                setFileToUpload(e.target.files[0]);
                setResultType("imported");
                setImportedRows([]);
                setChanges({});
            });
        uploadHistory();
    }, []);
    function viewUploadedFormattedFileMaster(
        uploadedName,
    ) {
        setResultType("uploaded");
        setIsImporting(true);
        setFilename(uploadedName);
        setImportedRows([]);
        setIsSkeletonDisplayed(true);
        readRemoteFile(FETCH_FORMATTED_FILE_MASTER + "/" + uploadedName, {
            complete: (results) => {
                setIsImporting(false);
                setTimeout(() => {
                    setImportedRows(results.data);
                    // console.log(results.data);
                    setIsSkeletonDisplayed(false);
                }, 1000);
            },
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
        });
    }
    return (
        <>
            <Box
                sx={{
                    boxSizing: "border-box",
                    overflow: "hidden",
                    backgroundColor: "white",
                    height: "89vh",
                    width: "100%"
                }}
            >
                {contextHolder}
                <Box
                    sx={{
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        height: "10vh",
                        mt: 2,
                        mb: 0
                    }}
                >
                    <Button
                        size="large"
                        variant="contained"
                        onClick={(e) => {
                            document.getElementById("importSwapDocument").click();
                        }} sx={{ margin: 2 }}
                    >
                        <div hidden>
                            <CSVReader
                                cssClass="react-csv-input"
                                onError={(error) => {
                                    console.log("Import Failed: ", error.message);
                                    messageApi.open({
                                        type: "error",
                                        content: "Invalid file. Could not import",
                                    });
                                }}
                                onFileLoaded={() => { uploadSwapMasterFile(); }}
                                parserOptions={{
                                    header: true,
                                    dynamicTyping: true,
                                    skipEmptyLines: true,
                                    transformHeader: (header) =>
                                        header.toLowerCase().replace(/\W/g, "_"),
                                }}
                                inputId="importSwapDocument"
                            />
                        </div>
                        Import Ops Holding Rate
                    </Button>
                    <Button
                        size="large"
                        variant="contained"
                        onClick={(e) => {
                            document.getElementById("importHoldingRateDocument").click();
                        }}
                    >
                        <div hidden>
                            <CSVReader
                                cssClass="react-csv-input"
                                onError={(error) => {
                                    console.log("Import Failed: ", error.message);
                                    messageApi.open({
                                        type: "error",
                                        content: "Invalid file. Could not import",
                                    });
                                }}
                                onFileLoaded={() => { uploadHoldingRateFile(); }}
                                parserOptions={{
                                    header: true,
                                    dynamicTyping: true,
                                    skipEmptyLines: true,
                                    transformHeader: (header) =>
                                        header.toLowerCase().replace(/\W/g, "_"),
                                }}
                                inputId="importHoldingRateDocument"
                            />
                        </div>
                        Import LP Holding Rate
                    </Button>
                </Box>
                <div style={{ mt: 2, display: "flex" }}>
                    <p style={{ width: "80%" }}>
                        {importedRows.length != 0 && (
                            <ImportResult
                                importedRows={importedRows}
                                isImporting={isImporting}
                                filename={filename}
                                uploadFile={uploadSwapMasterFile}
                                resultType={resultType}
                                changes={changes}
                            />
                        )}
                        {isSkeletonDisplayed && (
                            <TableSkeleton scrollHeight={scrollHeight} resultType={resultType} />
                        )}
                    </p>
                    <Grid item xl={3} lg={3} md={3} sm={12} xs={12} sx={{ width: "20%" }}>
                        {isUploading && <UploadHistory
                            uploadedFiles={uploadedFiles}
                            setUploadedFiles={setUploadedFiles}
                            selectedFilename={filename}
                            setChanges={setChanges}
                            onViewFile={viewUploadedFormattedFileMaster}
                            setLastUploadedFile={setLastUploadedFile}
                        />}
                    </Grid>
                </div>
            </Box>
        </>
    );
}
