// src/admin/components/MenuTable.jsx

import {
  Table, Tag
} from "antd";

export default function MenuTable({
  data, loading
}) {

  const columns = [

    {
      title: "STT",
      Key: "stt",
      render: (_,__, index) => (
        index + 1
      )
    },

    {
      title: "Tên",
      key: "name",
      render: (_, record) => (
        record.ngonngus?.[0]?.danduong_nn_ten
      )
    },

    {
        title: "Mặc định",
        key: "default",
        render: (_, record) => (
            record.macdinh ? (<Tag color="green">Yes</Tag>) : (<Tag>No</Tag>)
        )
    },

    {
        title: "Trang thái",
        key: "status",
        render: (_, record)=> (
            record.trangthai ? (<Tag color="green">Publish</Tag>) : (<Tag color="red">UbPublish</Tag>)
        )
    }

  ];

  return (

    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
    />

  );

}