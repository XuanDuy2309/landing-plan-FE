import { Button, Input, Modal, Select, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { observer } from "mobx-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Colors } from "src/assets";
import { ButtonIcon } from "src/components/button-icon";
import { formatMoney } from "src/core/base";

interface AuctionData {
    id: number;
    title: string;
    create_by_name: string;
    status: 'not_started' | 'in_progress' | 'ended' | 'cancelled';
    price_start: number;
    price_current: number;
    start_date: string;
    end_date: string;
    total_bids: number;
}

interface BidHistory {
    id: number;
    user_name: string;
    bid_amount: number;
    bid_time: string;
}

export const AuctionsScreen = observer(() => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<AuctionData[]>([]);
    const [showBidHistory, setShowBidHistory] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState<AuctionData | null>(null);
    const [bidHistory, setBidHistory] = useState<BidHistory[]>([]);

    // Mock data for testing
    useEffect(() => {
        setData([
            {
                id: 1,
                title: "Nhà phố Quận 7",
                create_by_name: "Nguyễn Văn A",
                status: "in_progress",
                price_start: 2000000000,
                price_current: 2500000000,
                start_date: "2025-07-15T10:00:00",
                end_date: "2025-07-20T10:00:00",
                total_bids: 15
            },
            {
                id: 2,
                title: "Căn hộ Quận 2",
                create_by_name: "Trần Thị B",
                status: "not_started",
                price_start: 1500000000,
                price_current: 1500000000,
                start_date: "2025-07-20T15:00:00",
                end_date: "2025-07-25T15:00:00",
                total_bids: 0
            }
        ]);
    }, []);

    const columns: ColumnsType<AuctionData> = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 60,
        },
        {
            title: 'Tài sản',
            dataIndex: 'title',
            render: (text) => (
                <Tooltip title={text}>
                    <div className="max-w-[200px] truncate">
                        {text}
                    </div>
                </Tooltip>
            )
        },
        {
            title: 'Người tạo',
            dataIndex: 'create_by_name',
            width: 150,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 120,
            render: (status) => (
                <Tag color={
                    status === 'in_progress' ? 'processing' :
                    status === 'not_started' ? 'default' :
                    status === 'ended' ? 'success' :
                    'error'
                }>
                    {status === 'in_progress' ? 'Đang diễn ra' :
                     status === 'not_started' ? 'Chưa bắt đầu' :
                     status === 'ended' ? 'Đã kết thúc' :
                     'Đã hủy'}
                </Tag>
            )
        },
        {
            title: 'Giá khởi điểm',
            dataIndex: 'price_start',
            width: 150,
            render: (price) => formatMoney(price, 1, 'vn') + ' VNĐ'
        },
        {
            title: 'Giá hiện tại',
            dataIndex: 'price_current',
            width: 150,
            render: (price) => formatMoney(price, 1, 'vn') + ' VNĐ'
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'start_date',
            width: 150,
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'end_date',
            width: 150,
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Số lượt đấu giá',
            dataIndex: 'total_bids',
            width: 120,
            render: (total) => <span className="font-medium">{total}</span>
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <div className="flex space-x-2">
                    <ButtonIcon 
                        icon="eye-outline" 
                        size="xxs"
                        color={Colors.blue[600]}
                        onClick={() => handleView(record)}
                    />
                    <ButtonIcon 
                        icon="time-outline" 
                        size="xxs"
                        color={Colors.green[600]}
                        onClick={() => handleViewBidHistory(record)}
                    />
                    {record.status === 'not_started' && (
                        <ButtonIcon 
                            icon="close-outline" 
                            size="xxs"
                            color={Colors.red[600]}
                            onClick={() => handleCancel(record)}
                        />
                    )}
                </div>
            )
        },
    ];

    const bidHistoryColumns: ColumnsType<BidHistory> = [
        {
            title: 'Người đấu giá',
            dataIndex: 'user_name',
            width: 200,
        },
        {
            title: 'Số tiền',
            dataIndex: 'bid_amount',
            width: 200,
            render: (amount) => formatMoney(amount, 1, 'vn') + ' VNĐ'
        },
        {
            title: 'Thời gian',
            dataIndex: 'bid_time',
            render: (time) => moment(time).format('DD/MM/YYYY HH:mm:ss')
        },
    ];

    const handleView = (record: AuctionData) => {
        setSelectedAuction(record);
        // TODO: Navigate to auction detail page
        console.log('View auction:', record);
    };

    const handleViewBidHistory = (record: AuctionData) => {
        setSelectedAuction(record);
        // Mock bid history data
        setBidHistory([
            {
                id: 1,
                user_name: "Nguyễn Văn X",
                bid_amount: 2500000000,
                bid_time: "2025-07-15T11:30:00"
            },
            {
                id: 2,
                user_name: "Trần Văn Y",
                bid_amount: 2300000000,
                bid_time: "2025-07-15T11:00:00"
            }
        ]);
        setShowBidHistory(true);
    };

    const handleCancel = (record: AuctionData) => {
        Modal.confirm({
            title: 'Xác nhận hủy phiên đấu giá',
            content: 'Bạn có chắc chắn muốn hủy phiên đấu giá này?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => {
                // TODO: Implement cancel auction
                console.log('Cancel auction:', record);
            }
        });
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý đấu giá</h1>
            </div>

            {/* Filters */}
            <div className="flex space-x-4 mb-6">
                <Input.Search 
                    placeholder="Tìm kiếm theo tên tài sản..." 
                    style={{ width: 300 }}
                    onSearch={(value) => console.log('Search:', value)}
                />
                <Select
                    placeholder="Trạng thái"
                    style={{ width: 150 }}
                    options={[
                        { value: 'all', label: 'Tất cả' },
                        { value: 'in_progress', label: 'Đang diễn ra' },
                        { value: 'not_started', label: 'Chưa bắt đầu' },
                        { value: 'ended', label: 'Đã kết thúc' },
                        { value: 'cancelled', label: 'Đã hủy' },
                    ]}
                    onChange={(value) => console.log('Status:', value)}
                />
                <Button type="default" onClick={() => console.log('Reset filters')}>
                    Đặt lại
                </Button>
            </div>

            {/* Table */}
            <Table 
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{
                    total: data.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} phiên đấu giá`
                }}
            />

            {/* Bid History Modal */}
            <Modal
                title={`Lịch sử đấu giá - ${selectedAuction?.title}`}
                open={showBidHistory}
                onCancel={() => setShowBidHistory(false)}
                footer={null}
                width={800}
            >
                <Table 
                    columns={bidHistoryColumns}
                    dataSource={bidHistory}
                    rowKey="id"
                    pagination={false}
                />
            </Modal>
        </div>
    );
});
