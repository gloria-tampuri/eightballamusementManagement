import React, { useContext, useMemo } from "react";
import {
  Table,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Tag,
} from "antd";
import { BiArrowBack, BiPrinter, AiOutlineClose } from "react-icons/all";
import useSWR from "swr";
import { ShowMonthContext } from "../../../Context/ShowMonthContext";
import { useRouter } from "next/router";
import Back from "components/ui/back/back";

const { Title, Text } = Typography;

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Month = () => {
  const { data, error, isLoading } = useSWR("/api/asserts", fetcher);
  const showMonthCtx = useContext(ShowMonthContext);
  const { handleShowMonth, handleHideMonth, showMonth } = showMonthCtx;
  const router = useRouter();
  const year = parseInt(router.query.year);
  const month = parseInt(router.query.month) - 1;

  // Memoized calculation of asset data with totals
  const assetData = useMemo(() => {
    if (!data?.asserts) return [];

    return data.asserts.map((assert) => {
      const totalCashup =
        assert.cashup?.reduce((sum, sale) => {
          const saleDate = new Date(sale.cashupDate);
          const saleYear = saleDate.getFullYear();
          const saleMonth = saleDate.getMonth();

          if (saleYear === year && saleMonth === month) {
            return sum + sale.cashReceived;
          }
          return sum;
        }, 0) || 0;

      const currentLocation =
        assert.location?.find((loc) => loc.currentLocation)?.locationName ||
        "N/A";

      return {
        ...assert,
        totalCashup,
        currentLocation,
        isLowPerformance: totalCashup < 1200,
      };
    });
  }, [data, year, month]);

  // Sort by total cashup descending
  const sortedData = useMemo(() => {
    return [...assetData].sort((a, b) => b.totalCashup - a.totalCashup);
  }, [assetData]);

  const columns = [
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Location",
      dataIndex: "currentLocation",
      key: "location",
      render: (location) => <Text strong>{location}</Text>,
    },
    {
      title: "Asset ID",
      dataIndex: "assertId",
      key: "assetId",
    },
    {
      title: "Cashup Amount",
      dataIndex: "totalCashup",
      key: "cashup",
      render: (amount, record) => (
        <Tag color={record.isLowPerformance ? "red" : "green"}>
          ${amount.toLocaleString()}
        </Tag>
      ),
      align: "right",
    },
  ];

  const totalRevenue = useMemo(() => {
    return sortedData.reduce((sum, asset) => sum + asset.totalCashup, 0);
  }, [sortedData]);

  if (isLoading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Title level={4}>Loading monthly data...</Title>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Title level={4} type="danger">
          Error loading data
        </Title>
        <Text type="secondary">Please try again later</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Back />
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<BiPrinter />}
            onClick={() => window.print()}
            className="printButton"
          >
            Print Report
          </Button>
        </Col>
      </Row>

      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Title level={3}>
          Monthly Performance:{" "}
          {new Date(year, month).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </Title>
      </Card>

      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Statistic
          title="Total Revenue"
          value={totalRevenue}
          precision={2}
          valueStyle={{ color: "#3f8600" }}
          prefix="$"
        />
      </Card>

      <Table
        columns={columns}
        dataSource={sortedData}
        rowKey="_id"
        onRow={(record) => ({
          onClick: () => router.push(`/dashboard/asserts/${record._id}/cashup`),
          style: { cursor: "pointer" },
        })}
        pagination={false}
        bordered={false}
        style={{
          borderRadius: 8,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        }}
        rowClassName={(record) =>
          record.isLowPerformance ? "warning-row" : ""
        }
      />
    </div>
  );
};

export default Month;
