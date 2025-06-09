import React, { useContext, useState } from "react";
import { Table, Button, Space, Typography } from "antd";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePrinter } from "react-icons/ai";
import useSWR from "swr";
import { useRouter } from "next/router";
import Delete from "../Delete/Delete";
import { DeleteContext } from "../../../Context/DeleteContext";
import { EditContext } from "../../../Context/EditContext";
import EditModal from "../EditModal/EditModal";

const { Text } = Typography;

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const LocationList = () => {
  const router = useRouter();
  const { assert } = router.query;
  const deleteCtx = useContext(DeleteContext);
  const editCtx = useContext(EditContext);
  const { showDeleteModal, deleteModal } = deleteCtx;
  const { showEditModal, editModal } = editCtx;
  const [selectedLocationId, setSelectedLocationId] = useState();

  const { data, error } = useSWR(`/api/asserts/${assert}`, fetcher, {
    refreshInterval: 1000,
  });

  const deleteHandler = (id) => {
    setSelectedLocationId(id);
    showDeleteModal();
  };

  const editHandler = (id) => {
    setSelectedLocationId(id);
    showEditModal();
  };

  const columns = [
    {
      title: 'Location Name',
      dataIndex: 'locationName',
      key: 'locationName',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Physical Address',
      dataIndex: 'physicalAddress',
      key: 'physicalAddress',
    },
    {
      title: 'Site Owner',
      dataIndex: 'siteOwner',
      key: 'siteOwner',
    },
    {
      title: 'Telephone',
      dataIndex: 'telephoneNumber',
      key: 'telephoneNumber',
    },
    {
      title: 'Tokens Given',
      dataIndex: 'numberofTokens',
      key: 'numberofTokens',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Accessories',
      dataIndex: 'accessories',
      key: 'accessories',
      render: (text) => text || '-',
    },
    {
      title: 'Commence Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => <Text strong>{text === "" ? 'Current Location' : text}</Text>,
    },
    {
      title: 'GPS Co-ordinates',
      dataIndex: 'gpsAddress',
      key: 'gpsAddress',
      render: (gps) => (
        gps ? (
          <Space direction="vertical" size={0}>
            {gps.map((coordinate, index) => (
              <Text key={index}>{coordinate}</Text>
            ))}
          </Space>
        ) : (
          <Text>No GPS coordinates available</Text>
        )
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<AiOutlineEdit />} 
            onClick={() => editHandler(record.locationId)}
          />
          <Button 
            type="text" 
            icon={<AiOutlineDelete />} 
            onClick={() => deleteHandler(record.locationId)}
            danger
          />
        </Space>
      ),
    },
  ];

  const tableData = data?.assert?.location
    ?.slice()
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .map(item => ({ ...item, key: item.locationId })) || [];

  if (error) {
    return <Text type="danger">Error loading location data</Text>;
  }

  return (
    <div style={{ padding: 24 }}>
      <Button 
        type="primary" 
        icon={<AiOutlinePrinter />} 
        onClick={() => window.print()}
        className="printButton"
      >
        Print
      </Button>

      <Table
        columns={columns}
        dataSource={tableData}
        bordered={false}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
  />

      {deleteModal && (
        <Delete
          assertId={assert}
          routeUrl="location"
          selectedId={selectedLocationId}
        />
      )}
      {editModal && (
        <EditModal
          assertId={assert}
          routeUrl="location"
          selectedId={selectedLocationId}
        />
      )}
    </div>
  );
};

export default LocationList;