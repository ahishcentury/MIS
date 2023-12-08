import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { Table, Space, Button, Grid, Tooltip, Alert, Modal } from "antd";
import ShortFinance from "./shortFinance";
import IntrumentName from "./instrumentName";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewChangesModal from "../viewChangesModal";
import Type from "./type";
import MatchingTuMetaDescription from "./matchingTuMetaDescription";
import MatchingSymbolWithTuMeta from "./matchingSymbolWithTuMeta";
import TableSkeleton from "../tableSkeleton";
import LongFinance from "./longFinance";
const { useBreakpoint } = Grid;

export default function ImportResult(props) {
  const {
    importedRows,
    filename,
    isImporting,
    uploadFile,
    resultType,
    changes
  } = props;
  const screens = useBreakpoint();
  const [scrollHeight, setScrollHeight] = useState(400);
  const [changesModalVisible, setChangesModalVisible] = useState(false);
  const [confirmUploadMsg, setConfirmUploadMsg] = useState(false);
  const columns = [
    {
      title: "Intrument Name",
      width: 150,
      render: (row) => (<IntrumentName {...row} />),
    },
    {
      title: "Long Finance",
      width: 150,
      render: (row) => (
        <LongFinance {...row}
        />
      ),
    },
    {
      title: "Matching Description With Tu Meta",
      width: 200,
      render: (row) => <MatchingTuMetaDescription {...row} />,
    },
    {
      title: "Matching Symbol With Tu Meta",
      width: 200,
      render: (row) => <MatchingSymbolWithTuMeta {...row} />,
    },
    {
      title: "Short Finance",
      width: 100,
      render: (row) => <ShortFinance {...row} />,
    },
    {
      title: "Type",
      width: 150,
      render: (row) => <Type  {...row} />,
    },
  ];
  function closeViewChangesModal() {
    setChangesModalVisible(false);
  }

  function openViewChangesModal() {
    setChangesModalVisible(true);
  }
  useEffect(() => {
    if (screens.xs) {
      setScrollHeight(600);
    } else {
      setScrollHeight(getHeight());
    }
  }, [screens]);

  function getHeight() {
    return (
      document.getElementById("resultBox").parentElement.offsetHeight - 200
    );
  }

  function TableTitle(props) {
    return (
      <Space size={"large"}>
        <Box>
          File : <span style={{ color: "blue" }}>{filename}</span>
        </Box>
        <Box>
          <span style={{ color: "gray" }}>Total Instruments</span> :{" "}
          {importedRows.length}
        </Box>
        {Object.keys(changes).length > 0 && (
          <Box>
            <span style={{ color: "teal" }}>Changes</span> :{" "}
            {Object.keys(changes).length}{" "}
            <Tooltip title="View Changes">
              <IconButton size="small" onClick={openViewChangesModal}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Space>
    );
  }

  return (
    <div id={"resultBox"}>
      <Modal
        title={"Confirm changes"}
        open={confirmUploadMsg}
        onOk={() => {
          uploadFile();
          setConfirmUploadMsg(false);
        }}
        onCancel={() => setConfirmUploadMsg(false)}
        okText="Yes"
        cancelText="No"
      >
        <Box sx={{ marginTop: 4 }}>{confirmUploadMsg}</Box>
      </Modal>

      <ViewChangesModal
        open={changesModalVisible}
        onClose={closeViewChangesModal}
        changes={changes}
      />
      {!isImporting && importedRows.length > 0 && (
        <Table
          dataSource={importedRows}
          columns={columns}
          pagination={false}
          scroll={{
            y: scrollHeight,
          }}
          title={() => <TableTitle />}
        />
      )}
      {!isImporting && importedRows.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            fontSize: {
              lg: 56,
              xl: 56,
              md: 56,
              sm: 30,
              xs: 30,
            },
            color: "#dbdbdb",
            fontWeight: "bold",
            padding: {
              lg: 16,
              xl: 16,
              md: 16,
              sm: 4,
              xs: 4,
            },
          }}
        >
          Import a file to see the results here
        </Box>
      )}
    </div>
  );
}
