
import { CircularProgress } from '@mui/material';
import { Skeleton, Space, Table } from 'antd';

export default function TableSkeleton(props) {

  const { scrollHeight, resultType } = props;

  const renderedRows = [...Array(12)].map((e, i) => (
    {}
  ));


  function DataSkeleton() {
    return <div style={{ width: '100%' }}>
      <div className="skeleton"></div>
    </div>
  }


  const columns = [
    { title: "Intrument Name", width: 150, render: (row) => <DataSkeleton /> },
    { title: "Long Finance", width: 150, render: (row) => <DataSkeleton /> },
    { title: "Matching Description With Tu Meta", width: 200, render: (row) => <DataSkeleton /> },
    { title: "Matching Symbol With Tu Meta", width: 200, render: (row) => <DataSkeleton /> },
    { title: "Short Finance", width: 100, render: (row) => <DataSkeleton /> },
    { title: "Type", width: 150, render: (row) => <DataSkeleton /> },



  ];


  return <Table
    dataSource={renderedRows}
    columns={columns}
    pagination={false}
    scroll={{
      y: scrollHeight
    }}
    title={() => <Space>
      <CircularProgress disableShrink size={16} />
      <span>{resultType === "imported" ? "Importing file..." : "Loading file from history...."}</span>
    </Space>} />
}



