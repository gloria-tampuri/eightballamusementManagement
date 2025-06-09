import React, { useState, useEffect, useContext, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Table,
  Select,
  Button,
  Typography,
  Card,
  Statistic,
  Row,
  Col,
  Space,
} from "antd";
import { BiArrowBack, BiPrinter, BiCalendar } from "react-icons/bi";
import useSWR from "swr";
import {
  ShowMonthContext,
  useMonthContext,
} from "../../../Context/ShowMonthContext";
import Back from "components/ui/back/back";

const { Title, Text } = Typography;
const { Option } = Select;

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Allyear = () => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR("/api/asserts", fetcher);
  const showMonthCtx = useContext(ShowMonthContext);
  const { handleShowMonth, handleHideMonth, showMonth } = showMonthCtx;
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } =
    useMonthContext();

  const [monthlyCashupData, setMonthlyCashupData] = useState([]);
  const [totalCompanyAmount, setTotalCompanyAmount] = useState(0);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Memoize available years calculation
  const availableYears = useMemo(() => {
    return (
      data?.asserts?.reduce((years, assert) => {
        assert?.cashup?.forEach((cash) => {
          const cashDate = new Date(cash.cashupDate);
          const year = cashDate.getFullYear();
          if (!years.includes(year)) {
            years.push(year);
          }
        });
        return years.sort((a, b) => b - a); // Sort years in descending order
      }, []) || []
    );
  }, [data]);

  // Calculate monthly data
  useEffect(() => {
    if (data) {
      const monthlyData = Array(12).fill(0);
      let totalCompany = 0;

      data.asserts.forEach((assert) => {
        assert.cashup?.forEach((cash) => {
          const cashDate = new Date(cash.cashupDate);
          const year = cashDate.getFullYear();
          const month = cashDate.getMonth();
          if (year === selectedYear) {
            monthlyData[month] += cash.cashReceived;
            totalCompany += cash.cashReceived;
          }
        });
      });

      setMonthlyCashupData(monthlyData);
      setTotalCompanyAmount(totalCompany);
    }
  }, [data, selectedYear]);

  const handleRowClick = (month) => {
    setSelectedMonth(month);
    router.push(`/dashboard/${selectedYear}/${month + 1}`);
  };

  const columns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      render: (_, record) => <Text strong>{monthNames[record.month]}</Text>,
    },
    {
      title: "Total Cashup",
      dataIndex: "total",
      key: "total",
      render: (total) => <Text>${total.toLocaleString()}</Text>,
    },
  ];

  const tableData = monthlyCashupData.map((total, month) => ({
    key: month,
    month,
    total,
  }));

  if (isLoading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Title level={4}>Loading data...</Title>
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
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Title level={4} style={{ marginBottom: 0 }}>
              <Space>
                <BiCalendar />
                Yearly Cashup Summary
              </Space>
            </Title>
          </Col>
          <Col>
            <Select
              style={{ width: 120 }}
              value={selectedYear}
              onChange={setSelectedYear}
              suffixIcon={<BiCalendar />}
            >
              {availableYears.map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Statistic
          title={`Total Company Amount for ${selectedYear}`}
          value={totalCompanyAmount}
          precision={2}
          valueStyle={{ color: "#3f8600" }}
          prefix="$"
        />
      </Card>

      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleRowClick(record.month),
          style: { cursor: "pointer" },
        })}
        rowClassName={() => "hover-row"}
        bordered={false}
        style={{
          borderRadius: 8,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        }}
      />
    </div>
  );
};

export default Allyear;
