const { useState, useMemo, useCallback, useEffect } = React;
const {
  Layout, Menu, Switch, Modal, Table, Button, Space, Input, Select,
  DatePicker, Tag, Popconfirm, message, Breadcrumb
} = antd;
const { Sider, Content, Header } = Layout;
const { RangePicker } = DatePicker;
const dayjs = window.dayjs;
dayjs.locale('zh-cn');

// ===== SVG Icon Component =====
const I = ({ d, size = 16 }) => (
  <span style={{ display: 'inline-flex', width: size, height: size, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d={d} />
    </svg>
  </span>
);

const icons = {
  tenant: "M3 21h18M5 21V7l8-4v18M19 21V11l-6-6",
  monitor: "M22 12h-4l-3 9L9 3l-3 9H2",
  tools: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  helper: "M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 6v4M12 16h.01",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  ticket: "M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2zM14 2v6h6M12 18v-6M9 15h6",
  content: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM16 18H8M16 14H8M10 10V6l6 6",
  card: "M20 12V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6M6 12v4a2 2 0 002 2h8a2 2 0 002-2v-4M6 12h12",
  share: "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13",
  award: "M12 15l-2 5-3-1 1-3-3-2 3-1-1-3 2 2 2-2-1 3 3 1-3 1z",
  finance: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  car: "M14 16H9m10 0h-5m-9 0H4a1 1 0 01-1-1v-3a1 1 0 011-1h1l2-4h12l2 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-1M5 16l-1 3m16-3l-1 3",
  megaphone: "M3 11l18-5v12L3 13v-2zM11.6 18a4 4 0 01-4.6-4M16.6 18a4 4 0 004.6-4",
  calendar: "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18",
  task: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 14l2 2 4-4",
  trophy: "M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2M6 3h12v6a6 6 0 01-12 0V3zM9 21h6M12 17v4",
  passenger: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  campaign: "M22 12h-4l-3 9L9 3l-3 9H2",
  activity: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9",
};

// ===== Menu Items =====
const menuItems = [
  { key: 'tenant', icon: <I d={icons.tenant} />, label: '租户管理' },
  { key: 'monitor', icon: <I d={icons.monitor} />, label: '系统监控' },
  { key: 'tools', icon: <I d={icons.tools} />, label: '系统工具' },
  {
    key: 'helper',
    icon: <I d={icons.helper} />,
    label: '喜行小助手',
    children: [
      { key: 'user-mgmt', icon: <I d={icons.users} />, label: '用户管理' },
      { key: 'ticket', icon: <I d={icons.ticket} />, label: '客服工单' },
      { key: 'content', icon: <I d={icons.content} />, label: '内容管理' },
      {
        key: 'free-card',
        icon: <I d={icons.card} />,
        label: '免佣卡商城',
        children: [
          { key: 'product-mgmt', icon: <I d={icons.card} />, label: '商品管理' },
          { key: 'order-mgmt', icon: <I d={icons.task} />, label: '订单管理' },
          { key: 'ops-config', icon: <I d={icons.tools} />, label: '运营配置' },
          { key: 'whitelist', icon: <I d={icons.share} />, label: '白名单管理' },
          { key: 'activity-mgmt', icon: <I d={icons.campaign} />, label: '活动管理' },
        ],
      },
      { key: 'distribution', icon: <I d={icons.share} />, label: '分销管理' },
      { key: 'captain', icon: <I d={icons.award} />, label: '小队长' },
      { key: 'finance', icon: <I d={icons.finance} />, label: '财务管理' },
      { key: 'rental', icon: <I d={icons.car} />, label: '租车管理' },
      { key: 'user-ops', icon: <I d={icons.megaphone} />, label: '用户运营' },
      { key: 'task', icon: <I d={icons.task} />, label: '任务管理' },
      { key: 'match', icon: <I d={icons.trophy} />, label: '赛事管理' },
    ],
  },
  { key: 'passenger', icon: <I d={icons.passenger} />, label: '乘客端' },
];

// ===== Status Tag =====
const StatusTag = ({ status }) => {
  const cls = {
    '待开始': 'status-tag-waiting',
    '进行中': 'status-tag-active',
    '已结束': 'status-tag-ended',
    '已关闭': 'status-tag-closed',
  }[status] || '';
  return <Tag className={cls}>{status}</Tag>;
};

// ===== Mock Data Generator =====
// Generate tree data: each main activity has child activities (期次)
const generateMockData = () => {
  const mainActivities = [
    {
      id: 1, name: '北京春日裂变推广', city: '北京',
      cycleStart: '2026-06-01', cycleEnd: '2026-08-31',
      status: '进行中', totalUsers: 1280, totalWinners: 156,
      createdAt: '2026-05-10 14:30:00', poster: '', sharePoster: '',
      product: '1天免佣卡', price: 69.99, tiers: 4, upgrade: 2,
      children: [
        { id: '1-1', period: 1, name: '第1期', start: '2026-06-01', end: '2026-06-15', status: '已结束', users: 320, winners: 38, purchaseLimit: 500 },
        { id: '1-2', period: 2, name: '第2期', start: '2026-06-16', end: '2026-06-30', status: '进行中', users: 480, winners: 52, purchaseLimit: 500 },
        { id: '1-3', period: 3, name: '第3期', start: '2026-07-01', end: '2026-07-15', status: '待开始', users: 0, winners: 0, purchaseLimit: 500 },
        { id: '1-4', period: 4, name: '第4期', start: '2026-07-16', end: '2026-07-31', status: '待开始', users: 0, winners: 0, purchaseLimit: 500 },
      ],
    },
    {
      id: 2, name: '上海司机裂变计划', city: '上海',
      cycleStart: '2026-05-15', cycleEnd: '2026-07-31',
      status: '进行中', totalUsers: 960, totalWinners: 98,
      createdAt: '2026-05-08 10:15:00', poster: '', sharePoster: '',
      product: '1天免佣卡', price: 79.99, tiers: 3, upgrade: 1,
      children: [
        { id: '2-1', period: 1, name: '第1期', start: '2026-05-15', end: '2026-05-31', status: '进行中', users: 560, winners: 56, purchaseLimit: 400 },
        { id: '2-2', period: 2, name: '第2期', start: '2026-06-01', end: '2026-06-15', status: '待开始', users: 0, winners: 0, purchaseLimit: 400 },
        { id: '2-3', period: 3, name: '第3期', start: '2026-06-16', end: '2026-06-30', status: '待开始', users: 0, winners: 0, purchaseLimit: 400 },
      ],
    },
    {
      id: 3, name: '广州新用户裂变', city: '广州',
      cycleStart: '2026-07-01', cycleEnd: '2026-09-30',
      status: '待开始', totalUsers: 0, totalWinners: 0,
      createdAt: '2026-05-12 09:00:00', poster: '', sharePoster: '',
      product: '1天免佣卡', price: 59.99, tiers: 3, upgrade: 3,
      children: [
        { id: '3-1', period: 1, name: '第1期', start: '2026-07-01', end: '2026-07-20', status: '待开始', users: 0, winners: 0, purchaseLimit: 600 },
        { id: '3-2', period: 2, name: '第2期', start: '2026-07-21', end: '2026-08-10', status: '待开始', users: 0, winners: 0, purchaseLimit: 600 },
        { id: '3-3', period: 3, name: '第3期', start: '2026-08-11', end: '2026-08-31', status: '待开始', users: 0, winners: 0, purchaseLimit: 600 },
      ],
    },
    {
      id: 4, name: '深圳夏日裂变活动', city: '深圳',
      cycleStart: '2026-03-01', cycleEnd: '2026-05-31',
      status: '已结束', totalUsers: 2100, totalWinners: 245,
      createdAt: '2026-02-20 16:45:00', poster: '', sharePoster: '',
      product: '1天免佣卡', price: 49.99, tiers: 4, upgrade: 2,
      children: [
        { id: '4-1', period: 1, name: '第1期', start: '2026-03-01', end: '2026-03-20', status: '已结束', users: 420, winners: 48, purchaseLimit: 350 },
        { id: '4-2', period: 2, name: '第2期', start: '2026-03-21', end: '2026-04-10', status: '已结束', users: 580, winners: 65, purchaseLimit: 350 },
        { id: '4-3', period: 3, name: '第3期', start: '2026-04-11', end: '2026-04-30', status: '已结束', users: 560, winners: 72, purchaseLimit: 350 },
        { id: '4-4', period: 4, name: '第4期', start: '2026-05-01', end: '2026-05-20', status: '已结束', users: 540, winners: 60, purchaseLimit: 350 },
      ],
    },
    {
      id: 5, name: '杭州城市扩张计划', city: '杭州',
      cycleStart: '2026-04-01', cycleEnd: '2026-06-30',
      status: '已关闭', totalUsers: 680, totalWinners: 42,
      createdAt: '2026-03-25 11:20:00', poster: '', sharePoster: '',
      product: '1天免佣卡', price: 89.99, tiers: 3, upgrade: 1,
      children: [
        { id: '5-1', period: 1, name: '第1期', start: '2026-04-01', end: '2026-04-20', status: '已关闭', users: 280, winners: 18, purchaseLimit: 450 },
        { id: '5-2', period: 2, name: '第2期', start: '2026-04-21', end: '2026-05-10', status: '已关闭', users: 220, winners: 14, purchaseLimit: 450 },
        { id: '5-3', period: 3, name: '第3期', start: '2026-05-11', end: '2026-05-31', status: '已关闭', users: 180, winners: 10, purchaseLimit: 450 },
      ],
    },
    {
      id: 6, name: '成都新人福利裂变', city: '成都',
      cycleStart: '2026-05-20', cycleEnd: '2026-08-20',
      status: '进行中', totalUsers: 450, totalWinners: 35,
      createdAt: '2026-05-05 08:30:00', poster: '', sharePoster: '',
      product: '1天免佣卡', price: 59.99, tiers: 3, upgrade: 2,
      children: [
        { id: '6-1', period: 1, name: '第1期', start: '2026-05-20', end: '2026-06-05', status: '进行中', users: 450, winners: 35, purchaseLimit: 500 },
        { id: '6-2', period: 2, name: '第2期', start: '2026-06-06', end: '2026-06-20', status: '待开始', users: 0, winners: 0, purchaseLimit: 500 },
        { id: '6-3', period: 3, name: '第3期', start: '2026-06-21', end: '2026-07-10', status: '待开始', users: 0, winners: 0, purchaseLimit: 500 },
      ],
    },
    {
      id: 7, name: '武汉限时裂变推广', city: '武汉',
      cycleStart: '2026-08-01', cycleEnd: '2026-10-31',
      status: '待开始', totalUsers: 0, totalWinners: 0,
      createdAt: '2026-05-11 15:00:00', poster: '', sharePoster: '',
      product: '1天免佣卡', price: 69.99, tiers: 4, upgrade: 1,
      children: [
        { id: '7-1', period: 1, name: '第1期', start: '2026-08-01', end: '2026-08-20', status: '待开始', users: 0, winners: 0, purchaseLimit: 400 },
        { id: '7-2', period: 2, name: '第2期', start: '2026-08-21', end: '2026-09-10', status: '待开始', users: 0, winners: 0, purchaseLimit: 400 },
      ],
    },
  ];

  // Convert to tree table data format
  return mainActivities.map(main => {
    const childrenData = main.children.map(child => ({
      key: child.id,
      _isChild: true,
      _parentId: main.id,
      period: child.period,
      periodLabel: `第${child.period}期`,
      name: '',
      city: main.city,
      start: child.start,
      end: child.end,
      timeRange: `${child.start} ~ ${child.end}`,
      status: child.status,
      users: child.users,
      winners: child.winners,
      createdAt: '',
      purchaseLimit: child.purchaseLimit,
    }));

    return {
      key: `main-${main.id}`,
      _isChild: false,
      id: main.id,
      name: main.name,
      city: main.city,
      periodLabel: `共${main.children.length}期`,
      timeRange: `${main.cycleStart} ~ ${main.cycleEnd}`,
      status: main.status,
      users: main.totalUsers,
      winners: main.totalWinners,
      createdAt: main.createdAt,
      children: childrenData,
      _mainData: main,
    };
  });
};

// ===== Main App =====
function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [moduleOn, setModuleOn] = useState(true);
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [switchingOff, setSwitchingOff] = useState(false);
  const [dataSource, setDataSource] = useState(generateMockData());
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Filter state
  const [filterName, setFilterName] = useState('');
  const [filterCity, setFilterCity] = useState(undefined);
  const [filterStatus, setFilterStatus] = useState('进行中');
  const [filterDateRange, setFilterDateRange] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // All cities
  const allCities = useMemo(() => [...new Set(dataSource.map(d => d.city))], []);

  // Default expand first level
  useEffect(() => {
    if (expandedRowKeys.length === 0 && dataSource.length > 0) {
      setExpandedRowKeys(dataSource.filter(d => !d._isChild).map(d => d.key));
    }
  }, [dataSource]);

  // Filtered data
  const filteredData = useMemo(() => {
    let data = dataSource.map(d => ({ ...d }));

    if (filterName.trim()) {
      const kw = filterName.trim().toLowerCase();
      data = data.filter(d => !d._isChild && d.name.toLowerCase().includes(kw));
    }

    if (filterCity) {
      data = data.filter(d => !d._isChild && d.city === filterCity);
    }

    if (filterStatus) {
      data = data.filter(d => !d._isChild && d.status === filterStatus);
    }

    if (filterDateRange && filterDateRange[0] && filterDateRange[1]) {
      const start = filterDateRange[0].format('YYYY-MM-DD');
      const end = filterDateRange[1].format('YYYY-MM-DD');
      data = data.filter(d => !d._isChild && d.createdAt.slice(0, 10) >= start && d.createdAt.slice(0, 10) <= end);
    }

    // Sort: main by createdAt desc, children by period asc
    data.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
    data.forEach(d => {
      if (d.children) {
        d.children.sort((a, b) => a.period - b.period);
      }
    });

    return data;
  }, [dataSource, filterName, filterCity, filterStatus, filterDateRange]);

  // Paginated data (paginate main activities only)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handle query
  const handleQuery = () => {
    setCurrentPage(1);
    messageApi.success('查询完成');
  };

  // Handle reset
  const handleReset = () => {
    setFilterName('');
    setFilterCity(undefined);
    setFilterStatus('进行中');
    setFilterDateRange(null);
    setCurrentPage(1);
  };

  // Switch toggle
  const handleSwitchToggle = (checked) => {
    if (checked) {
      setModuleOn(true);
      messageApi.success('模块已开启，所有操作权限已恢复');
    } else {
      setSwitchingOff(true);
      setSwitchModalOpen(true);
    }
  };

  const confirmSwitchOff = () => {
    setModuleOn(false);
    setSwitchModalOpen(false);
    setSwitchingOff(false);
    // Update all active/pending activities to closed
    setDataSource(prev => prev.map(d => {
      if (d._isChild) return d;
      if (['待开始', '进行中'].includes(d.status)) {
        const updated = { ...d, status: '已关闭' };
        if (updated.children) {
          updated.children = updated.children.map(c => ({ ...c, status: '已关闭' }));
        }
        return updated;
      }
      return d;
    }));
    messageApi.warning('模块已关闭，所有活动已锁定为只读状态');
  };

  const cancelSwitchOff = () => {
    setSwitchModalOpen(false);
    setSwitchingOff(false);
  };

  // Affected activities for switch modal
  const affectedActivities = useMemo(() => {
    return dataSource
      .filter(d => !d._isChild && ['进行中', '待开始'].includes(d.status))
      .map(d => ({ key: d.key, name: d.name, status: d.status }));
  }, [dataSource]);

  // Handle close activity
  const handleClose = (record) => {
    setDataSource(prev => prev.map(d => {
      if (d.key === record.key) {
        const updated = { ...d, status: '已关闭' };
        if (updated.children) {
          updated.children = updated.children.map(c => ({ ...c, status: '已关闭' }));
        }
        return updated;
      }
      return d;
    }));
    messageApi.success(`活动「${record.name}」已关闭`);
  };

  // Handle restore activity
  const handleRestore = (record) => {
    // Compute restored status based on current time vs cycle times
    const main = record._mainData;
    if (!main) {
      messageApi.error('无法恢复：活动时间数据缺失');
      return;
    }
    const now = dayjs();
    const cycleStart = dayjs(main.cycleStart);
    const cycleEnd = dayjs(main.cycleEnd);
    let restoredStatus;
    if (now.isBefore(cycleStart)) restoredStatus = '待开始';
    else if (now.isBefore(cycleEnd)) restoredStatus = '进行中';
    else restoredStatus = '已结束';

    setDataSource(prev => prev.map(d => {
      if (d.key === record.key) {
        const updated = { ...d, status: restoredStatus };
        if (updated.children) {
          updated.children = updated.children.map(c => {
            const childStart = dayjs(c.start);
            const childEnd = dayjs(c.end);
            let childStatus;
            if (now.isBefore(childStart)) childStatus = '待开始';
            else if (now.isBefore(childEnd)) childStatus = '进行中';
            else childStatus = '已结束';
            return { ...c, status: childStatus };
          });
        }
        return updated;
      }
      return d;
    }));
    messageApi.success(`活动「${record.name}」已恢复至「${restoredStatus}」状态`);
  };

  // Table columns
  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 56,
      align: 'center',
      render: (_, record, index) => {
        if (record._isChild) return '';
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      width: 200,
      ellipsis: { showTitle: true },
      render: (text, record) => {
        if (record._isChild) return null;
        return <span className="parent-row">{text}</span>;
      },
    },
    {
      title: '期数',
      dataIndex: 'periodLabel',
      width: 80,
      align: 'center',
    },
    {
      title: '活动时间',
      dataIndex: 'timeRange',
      width: 200,
      align: 'center',
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      width: 90,
      align: 'center',
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: '参与用户数',
      dataIndex: 'users',
      width: 100,
      align: 'center',
      render: (val) => <span className="cell-number">{val ?? 0}</span>,
    },
    {
      title: '获奖用户数',
      dataIndex: 'winners',
      width: 100,
      align: 'center',
      render: (val) => <span className="cell-number">{val ?? 0}</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      align: 'center',
      render: (text, record) => {
        if (record._isChild) return null;
        return text || '--';
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_, record) => {
        if (record._isChild) return null;
        const locked = !moduleOn;
        const { status } = record;

        const canView = ['进行中', '已结束', '已关闭'].includes(status);
        const canEdit = status === '待开始';
        const canClose = ['待开始', '进行中'].includes(status);
        const canRestore = status === '已关闭';

        return (
          <Space size="small">
            {canView && (
              <Button
                type="link"
                size="small"
                className="action-btn"
              >
                查看
              </Button>
            )}
            {canEdit && (
              <Button
                type="link"
                size="small"
                className="action-btn"
                disabled={locked}
              >
                编辑
              </Button>
            )}
            {canClose && (
              <Popconfirm
                title="确认关闭"
                description={`确定要关闭活动「${record.name}」吗？关闭后所有子活动将联动关闭。`}
                onConfirm={() => handleClose(record)}
                okText="确认关闭"
                cancelText="取消"
              >
                <Button type="link" size="small" danger className="action-btn" disabled={locked}>
                  关闭
                </Button>
              </Popconfirm>
            )}
            {canRestore && (
              <Popconfirm
                title="确认恢复"
                description={`确定要恢复活动「${record.name}」吗？恢复后将根据当前时间自动判定活动状态。`}
                onConfirm={() => handleRestore(record)}
                okText="确认恢复"
                cancelText="取消"
              >
                <Button type="link" size="small" className="action-btn text-success" disabled={locked}>
                  恢复
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {contextHolder}

      {/* Sider */}
      <Sider
        width={200}
        collapsedWidth={56}
        theme="dark"
        collapsible
        collapsed={collapsed}
        trigger={null}
        style={{ overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0 }}
      >
        <div className="sidebar-logo" style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div className="sidebar-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" width="16" height="16">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          {!collapsed && <span className="sidebar-logo-text">喜行约车</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['activity-mgmt']}
          defaultOpenKeys={['helper', 'free-card']}
          inlineCollapsed={collapsed}
          items={menuItems}
          style={{ borderInlineEnd: 0 }}
        />
      </Sider>

      {/* Main area */}
      <Layout>
        {/* Header */}
        <Header className="header-bar">
          <div className="header-left">
            <Button
              type="text"
              onClick={() => setCollapsed(!collapsed)}
              className="header-collapse-btn"
              aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'}
            >
              {collapsed ? <I d="M9 18l6-6-6-6" size={18} /> : <I d="M4 6h16M4 12h16M4 18h16" size={18} />}
            </Button>
            <Breadcrumb items={[
              { title: '喜行小助手' },
              { title: '免佣卡商城' },
              { title: '活动管理' },
            ]} />
            <div className="header-module-switch">
              <Switch
                size="small"
                checked={moduleOn}
                onChange={handleSwitchToggle}
                checkedChildren="开"
                unCheckedChildren="关"
              />
              <span className="header-module-switch-label">模块总开关</span>
            </div>
          </div>
          <div className="header-avatar">管</div>
        </Header>

        {/* Content */}
        <Content className="content-area">
          {/* Filter Panel */}
          <div className="filter-panel">
            <div className="filter-row">
              <div className="filter-item">
                <span className="filter-label">活动名称</span>
                <Input
                  placeholder="请输入活动名称"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  allowClear
                  style={{ width: 180 }}
                />
              </div>
              <div className="filter-item">
                <span className="filter-label">活动城市</span>
                <Select
                  placeholder="全部"
                  value={filterCity}
                  onChange={(v) => setFilterCity(v)}
                  allowClear
                  showSearch
                  style={{ width: 140 }}
                  options={allCities.map(c => ({ label: c, value: c }))}
                />
              </div>
              <div className="filter-item">
                <span className="filter-label">主活动状态</span>
                <Select
                  value={filterStatus}
                  onChange={(v) => setFilterStatus(v ?? '')}
                  allowClear
                  style={{ width: 140 }}
                  options={[
                    { label: '全部', value: '' },
                    { label: '待开始', value: '待开始' },
                    { label: '进行中', value: '进行中' },
                    { label: '已结束', value: '已结束' },
                    { label: '已关闭', value: '已关闭' },
                  ]}
                />
              </div>
              <div className="filter-item">
                <span className="filter-label">创建时间</span>
                <RangePicker
                  value={filterDateRange}
                  onChange={(dates) => setFilterDateRange(dates)}
                  style={{ width: 240 }}
                />
              </div>
              <Space>
                <Button type="primary" onClick={handleQuery}>查询</Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <div className="table-header">
              <span className="table-header-title">活动列表</span>
              <span className="table-header-subtitle">主活动为父节点，点击展开查看子活动期次</span>
              <div style={{ flex: 1 }} />
              <Button
                type="primary"
                disabled={!moduleOn}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                }
              >
                新建活动
              </Button>
            </div>
            <div style={{ padding: 16 }}>
              <Table
                className="tree-table"
                columns={columns}
                dataSource={paginatedData}
                rowKey="key"
                pagination={false}
                scroll={{ x: 1200 }}
                expandable={{
                  expandedRowKeys,
                  onExpandedRowsChange: (keys) => setExpandedRowKeys([...keys]),
                  expandRowByClick: false,
                  indentSize: 24,
                }}
                locale={{ emptyText: '暂无活动数据' }}
              />
              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <div>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredData.length}
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={['10', '20', '50']}
                    showTotal={(total) => `共 ${total} 条`}
                    onChange={(page, size) => {
                      setCurrentPage(page);
                      if (size !== pageSize) setPageSize(size);
                    }}
                    onShowSizeChange={(page, size) => {
                      setCurrentPage(1);
                      setPageSize(size);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>

      {/* Switch-off confirmation Modal */}
      <Modal
        title="确认关闭模块总开关"
        open={switchModalOpen}
        onOk={confirmSwitchOff}
        onCancel={cancelSwitchOff}
        okText="确认关闭"
        okButtonProps={{ danger: true }}
        cancelText="取消"
        width={640}
      >
        <p style={{ color: '#595959', marginBottom: 12, fontSize: 13 }}>
          关闭后，移动端入口将隐藏，后台所有活动将锁定为只读状态（仅可查看，禁止新建、编辑、关闭等操作）。以下活动将受到影响：
        </p>
        <Table
          size="small"
          columns={[
            { title: '活动名称', dataIndex: 'name', ellipsis: true },
            {
              title: '当前状态', dataIndex: 'status', width: 100, align: 'center',
              render: (s) => <StatusTag status={s} />,
            },
            {
              title: '关闭后状态', width: 100, align: 'center',
              render: () => <Tag className="status-tag-closed">已关闭</Tag>,
            },
          ]}
          dataSource={affectedActivities}
          rowKey="key"
          pagination={false}
          className="switch-modal-table"
        />
        {affectedActivities.some(a => a.status === '进行中') && (
          <div className="switch-modal-warning">
            注意：「进行中」的活动将被变更为「已关闭」状态，关闭期间列表仅支持查看详情。
          </div>
        )}
      </Modal>
    </Layout>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
