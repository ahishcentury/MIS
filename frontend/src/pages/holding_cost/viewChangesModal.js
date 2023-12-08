import { Box } from '@mui/material';
import { Button, Divider, Modal, Space, Tag } from 'antd';
import { useState } from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';


function NoValueLabel() {
  return <Space>
    <ReportProblemIcon fontSize="small" style={{ color: 'gold' }} />
    <span style={{ color: 'gray' }}> No value provided</span>
  </Space>
}

function getValue(key, map) {

  if (map.hasOwnProperty(key)) {
    try {
      if (map[key]) {
        if (map[key].length === 0) {
          return <NoValueLabel />
        } else {
          return map[key];
        }
      } else {
        return <NoValueLabel />
      }
    } catch (e) {
      return <NoValueLabel />
    }
  } else {
    return <NoValueLabel />
  }
}

const ViewChangesModal = (props) => {

  const { open, onClose, changes } = props;


  return (

    <Modal title="View changes" width={1000} open={open} onOk={onClose} onCancel={onClose}>
      <Box sx={{ height: '60vh', width: "100%", overflow: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {
            Object.keys(changes).map(symbol => {
              let old = changes[symbol].old || {};
              let current = changes[symbol].current || {};

              return <Box sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Box sx={{ backgroundColor: 'whitesmoke', padding: 1, width: '200px', fontWeight: 'bold', borderRight: '1px solid', borderColor: 'divider' }}>
                    {symbol}
                    {changes[symbol].new && <Tag style={{ marginLeft: 8 }} color="blue">New</Tag>}
                  </Box>
                  <Box sx={{ padding: 1, width: '200px', borderRight: '1px solid', borderColor: 'divider', fontWeight: 'bold' }}>Old Data</Box>
                  <Box sx={{ padding: 1, width: '200px', fontWeight: 'bold' }}>Current Data</Box>
                </Box>

                {
                  Object.keys(old).map(key => {
                    return <Box sx={{ display: 'flex', flexDirection: 'row', borderTop: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ padding: 1, width: '200px', borderRight: '1px solid', borderColor: 'divider' }}>{key.toUpperCase()}</Box>
                      <Box sx={{ padding: 1, width: '200px', borderRight: '1px solid', borderColor: 'divider' }}>{getValue(key, old)}</Box>
                      <Box sx={{ padding: 1, width: '200px' }}>{getValue(key, current)}</Box>


                    </Box>
                  })
                }

              </Box>
            })
          }
        </Box>
      </Box>
    </Modal>
  );
};
export default ViewChangesModal;

