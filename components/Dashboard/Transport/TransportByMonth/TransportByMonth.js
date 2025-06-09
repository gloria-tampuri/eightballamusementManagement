import React, { useEffect, useState, useMemo } from "react";
import { 
  Table, 
  Button, 
  Typography, 
  Card, 
  Collapse, 
  Tag,
  Space,
  Row,
  Col,
  Statistic,
  Spin,
  Alert,
  Popconfirm,
  message,
  List,
  Divider
} from "antd";
import { 
  BiArrowBack, 
  BiShow, 
  BiHide,
  BiCheckCircle,
  BiMoney
} from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import useSWR from "swr";
import { useRouter } from "next/router";
import { getSignedInEmail } from '../../../../auth';
import Back from "components/ui/back/back";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TransportByMonth = () => {
  const router = useRouter();
  const { year } = router.query;
  const { data, error, mutate } = useSWR(
    `/api/transport/year/${year}`,
    fetcher,
    { refreshInterval: 1000 }
  );

  const [admin, setAdmin] = useState(false);
  const [activePanels, setActivePanels] = useState({});
  const [paidWeeks, setPaidWeeks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const email = await getSignedInEmail();
        setAdmin(email === 'richard.ababio@eightball.com');
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    checkAdminStatus();
  }, []);

  const deleteHandler = async (transportId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/transport/${transportId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        message.success("Transport record deleted successfully");
        mutate();
      } else {
        throw new Error("Failed to delete transport record");
      }
    } catch (error) {
      console.error("Error deleting transport:", error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const markWeekAsPaid = async (weekKey) => {
    try {
      setLoading(true);
      const transportsToUpdate = groupedData
        .flatMap(month => month.weeks)
        .filter(week => week.key === weekKey)
        .flatMap(week => week.transports);

      const updatePromises = transportsToUpdate.map(transport => 
        fetch(`/api/transport/${transport._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: transport._id, update: { paid: true } }),
        })
      );

      await Promise.all(updatePromises);
      setPaidWeeks([...paidWeeks, weekKey]);
      message.success(`Week ${weekKey} marked as paid`);
      mutate();
    } catch (error) {
      console.error("Error marking week as paid:", error);
      message.error("Failed to mark week as paid");
    } finally {
      setLoading(false);
    }
  };

  const togglePanel = (panelKey) => {
    setActivePanels(prev => ({
      ...prev,
      [panelKey]: !prev[panelKey]
    }));
  };

  const getWeekNumber = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  };

  const formatDateRange = (date) => {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(start.getDate() + 6);
    
    if (isMobile) {
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const groupedData = useMemo(() => {
    if (!data?.transport) return [];

    const grouped = data.transport.reduce((acc, transport) => {
      const date = new Date(transport.transportDate);
      const monthIndex = date.getMonth();
      const monthName = monthNames[monthIndex];
      const weekNumber = getWeekNumber(date);
      const weekKey = `${monthName}-${weekNumber}`;

      let month = acc.find(m => m.month === monthName);
      if (!month) {
        month = { month: monthName, monthIndex, weeks: [] };
        acc.push(month);
      }

      let week = month.weeks.find(w => w.key === weekKey);
      if (!week) {
        week = {
          key: weekKey,
          weekNumber,
          dateRange: formatDateRange(date),
          transports: [],
          totalAmount: 0,
          allPaid: true
        };
        month.weeks.push(week);
      }

      week.transports.push(transport);
      week.totalAmount += transport.amount;
      if (!transport.paid) week.allPaid = false;

      return acc;
    }, []);

    return grouped
      .sort((a, b) => b.monthIndex - a.monthIndex)
      .map(month => ({
        ...month,
        weeks: month.weeks.sort((a, b) => b.weekNumber - a.weekNumber)
      }));
  }, [data, isMobile]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'transportDate',
      key: 'date',
      render: date => new Date(date).toLocaleDateString(),
      width: isMobile ? 80 : 120
    },
    {
      title: 'Route',
      key: 'route',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: isMobile ? '12px' : '14px' }}>
            <Text strong>{record.from}</Text>
          </div>
          <div style={{ fontSize: isMobile ? '11px' : '12px', color: '#666' }}>
            to {record.destination}
          </div>
        </div>
      ),
      width: isMobile ? 120 : 200
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: amount => (
        <Text strong style={{ fontSize: isMobile ? '12px' : '14px' }}>
          ${amount.toLocaleString()}
        </Text>
      ),
      align: 'right',
      width: isMobile ? 70 : 100
    },
    {
      title: 'Status',
      key: 'paid',
      render: (_, record) => (
        <Tag 
          color={record.paid ? "green" : "orange"}
          style={{ fontSize: isMobile ? '10px' : '12px' }}
        >
          {record.paid ? "Paid" : "Pending"}
        </Tag>
      ),
      width: isMobile ? 60 : 80
    },
    ...(admin ? [{
      title: '',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Delete this record?"
          onConfirm={() => deleteHandler(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            type="text" 
            icon={<AiOutlineDelete />} 
            danger
            size={isMobile ? "small" : "middle"}
          />
        </Popconfirm>
      ),
      width: isMobile ? 40 : 60
    }] : [])
  ];

  // Mobile card view for transport items
  const MobileTransportList = ({ transports }) => (
    <List
      dataSource={transports}
      renderItem={(transport) => (
        <List.Item style={{ padding: '12px 0' }}>
          <Card 
            size="small" 
            style={{ width: '100%' }}
            bodyStyle={{ padding: '12px' }}
          >
            <Row justify="space-between" align="top">
              <Col span={16}>
                <div style={{ marginBottom: '4px' }}>
                  <Text style={{ fontSize: '12px', color: '#666' }}>
                    {new Date(transport.transportDate).toLocaleDateString()}
                  </Text>
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <Text strong style={{ fontSize: '13px' }}>{transport.from}</Text>
                  <Text style={{ fontSize: '12px', color: '#666' }}> → {transport.destination}</Text>
                </div>
                <Tag 
                  color={transport.paid ? "green" : "orange"}
                  style={{ fontSize: '10px' }}
                >
                  {transport.paid ? "Paid" : "Pending"}
                </Tag>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong style={{ fontSize: '14px' }}>
                    ${transport.amount.toLocaleString()}
                  </Text>
                </div>
                {admin && (
                  <Popconfirm
                    title="Delete this record?"
                    onConfirm={() => deleteHandler(transport._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button 
                      type="text" 
                      icon={<AiOutlineDelete />} 
                      danger
                      size="small"
                    />
                  </Popconfirm>
                )}
              </Col>
            </Row>
          </Card>
        </List.Item>
      )}
    />
  );

  if (error) return (
    <Alert 
      message="Error Loading Data" 
      description={error.message} 
      type="error" 
      showIcon
      style={{ margin: 16 }}
    />
  );

  if (!data) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
      <Spin size="large" />
    </div>
  );

  return (
    <div style={{ padding: isMobile ? 12 : 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: isMobile ? 16 : 24 }}>
        <Col>
         <Back/>
        </Col>
        <Col>
          <Title 
            level={isMobile ? 4 : 3} 
            style={{ margin: 0, textAlign: 'center' }}
          >
            Transport {year}
          </Title>
        </Col>
      </Row>

      {groupedData.map(({ month, weeks }) => (
        <Card 
          key={month} 
          title={<Text strong style={{ fontSize: isMobile ? '16px' : '18px' }}>{month}</Text>}
          style={{ marginBottom: isMobile ? 16 : 24 }}
          headStyle={{ 
            backgroundColor: '#f0f2f5',
            padding: isMobile ? '8px 16px' : '16px 24px'
          }}
          bodyStyle={{ padding: isMobile ? '8px' : '24px' }}
        >
          <Collapse accordion size={isMobile ? "small" : "middle"}>
            {weeks.map(week => (
              <Panel
                key={week.key}
                header={
                  <div>
                    <Row justify="space-between" align="middle">
                      <Col span={isMobile ? 24 : 16}>
                        <Space 
                          size={isMobile ? "small" : "middle"} 
                          direction={isMobile ? "vertical" : "horizontal"}
                          style={{ width: '100%' }}
                        >
                          <Space size="small">
                            <Text strong style={{ fontSize: isMobile ? '13px' : '14px' }}>
                              Week {week.weekNumber}
                            </Text>
                            <Text 
                              type="secondary" 
                              style={{ fontSize: isMobile ? '11px' : '12px' }}
                            >
                              {week.dateRange}
                            </Text>
                          </Space>
                          <Space size="small">
                            <Tag 
                              color={week.allPaid ? "green" : "orange"}
                              style={{ fontSize: isMobile ? '10px' : '11px' }}
                            >
                              {week.allPaid ? "All Paid" : "Pending"}
                            </Tag>
                            <Text strong style={{ fontSize: isMobile ? '13px' : '14px' }}>
                              ${week.totalAmount.toLocaleString()}
                            </Text>
                          </Space>
                        </Space>
                      </Col>
                    </Row>
                  </div>
                }
              >
                {isMobile ? (
                  <MobileTransportList transports={week.transports} />
                ) : (
                  <Table
                    columns={columns}
                    dataSource={week.transports}
                    rowKey="_id"
                    pagination={false}
                    size="small"
                    scroll={{ x: 400 }}
                  />
                )}
                
                {admin && (
                  <div style={{ 
                    marginTop: 16, 
                    textAlign: isMobile ? 'center' : 'right' 
                  }}>
                    <Button
                      type="primary"
                      icon={week.allPaid ? <BiCheckCircle /> : <BiMoney />}
                      onClick={() => markWeekAsPaid(week.key)}
                      disabled={week.allPaid}
                      loading={loading}
                      size={isMobile ? "middle" : "large"}
                      block={isMobile}
                      className="printButton"
                    >
                      {week.allPaid ? "All Paid" : "Mark Week as Paid"}
                    </Button>
                  </div>
                )}
              </Panel>
            ))}
          </Collapse>
        </Card>
      ))}
    </div>
  );
};

export default TransportByMonth;