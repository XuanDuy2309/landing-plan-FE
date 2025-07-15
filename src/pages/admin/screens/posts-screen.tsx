import { Button, Input, Select, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { observer } from "mobx-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Colors } from "src/assets";
import { ButtonIcon } from "src/components/button-icon";
import { formatMoney } from "src/core/base";
import { Purpose_Post } from "src/core/models";

interface PostData {
    id: number;
    title: string;
    create_by_name: string;
    status: 'active' | 'pending' | 'rejected';
    purpose: number;
    price: number;
    area: number;
    create_at: string;
}

export const PostsScreen = observer(() => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PostData[]>([]);

    // Mock data for testing
    useEffect(() => {
        setData([
            {
                id: 1,
                title: "Nhà phố Quận 7",
                create_by_name: "Nguyễn Văn A",
                status: "active",
                purpose: Purpose_Post.For_Sell,
                price: 2000000000,
                area: 100,
                create_at: "2025-07-15T10:00:00"
            },
            {
                id: 2,
                title: "Căn hộ cho thuê",
                create_by_name: "Trần Thị B",
                status: "pending",
                purpose: Purpose_Post.For_Rent,
                price: 15000000,
                area: 50,
                create_at: "2025-07-14T15:30:00"
            }
        ]);
    }, []);

    const columns: ColumnsType<PostData> = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 60,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            render: (text, record) => (
                <Tooltip title={text}>
                    <div className="max-w-[200px] truncate">
                        {text}
                    </div>
                </Tooltip>
            )
        },
        {
            title: 'Người đăng',
            dataIndex: 'create_by_name',
            width: 150,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 120,
            render: (status) => (
                <Tag color={
                    status === 'active' ? 'success' :
                    status === 'pending' ? 'warning' :
                    'error'
                }>
                    {status === 'active' ? 'Đã duyệt' :
                     status === 'pending' ? 'Chờ duyệt' :
                     'Từ chối'}
                </Tag>
            )
        },
        {
            title: 'Mục đích',
            dataIndex: 'purpose',
            width: 120,
            render: (purpose) => (
                <Tag color={
                    purpose === Purpose_Post.For_Sell ? 'green' :
                    purpose === Purpose_Post.For_Rent ? 'blue' :
                    'red'
                }>
                    {purpose === Purpose_Post.For_Sell ? 'Bán' :
                     purpose === Purpose_Post.For_Rent ? 'Cho thuê' :
                     'Đấu giá'}
                </Tag>
            )
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            width: 150,
            render: (price) => formatMoney(price, 1, 'vn') + ' VNĐ'
        },
        {
            title: 'Diện tích',
            dataIndex: 'area',
            width: 120,
            render: (area) => area + ' m²'
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'create_at',
            width: 150,
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
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
                    {record.status === 'pending' && (
                        <>
                            <ButtonIcon 
                                icon="checkmark-outline" 
                                size="xxs"
                                color={Colors.green[600]}
                                onClick={() => handleApprove(record)}
                            />
                            <ButtonIcon 
                                icon="close-outline" 
                                size="xxs"
                                color={Colors.red[600]}
                                onClick={() => handleReject(record)}
                            />
                        </>
                    )}
                </div>
            )
        },
    ];

    const handleView = (record: PostData) => {
        // TODO: Implement view post detail
        console.log('View post:', record);
    };

    const handleApprove = (record: PostData) => {
        // TODO: Implement approve post
        console.log('Approve post:', record);
    };

    const handleReject = (record: PostData) => {
        // TODO: Implement reject post
        console.log('Reject post:', record);
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý bài đăng</h1>
            </div>

            {/* Filters */}
            <div className="flex space-x-4 mb-6">
                <Input.Search 
                    placeholder="Tìm kiếm theo tiêu đề..." 
                    style={{ width: 300 }}
                    onSearch={(value) => console.log('Search:', value)}
                />
                <Select
                    placeholder="Trạng thái"
                    style={{ width: 150 }}
                    options={[
                        { value: 'all', label: 'Tất cả' },
                        { value: 'active', label: 'Đã duyệt' },
                        { value: 'pending', label: 'Chờ duyệt' },
                        { value: 'rejected', label: 'Từ chối' },
                    ]}
                    onChange={(value) => console.log('Status:', value)}
                />
                <Select
                    placeholder="Mục đích"
                    style={{ width: 150 }}
                    options={[
                        { value: 'all', label: 'Tất cả' },
                        { value: Purpose_Post.For_Sell, label: 'Bán' },
                        { value: Purpose_Post.For_Rent, label: 'Cho thuê' },
                        { value: Purpose_Post.For_Auction, label: 'Đấu giá' },
                    ]}
                    onChange={(value) => console.log('Purpose:', value)}
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
                    showTotal: (total) => `Tổng ${total} bài đăng`
                }}
            />
        </div>
    );
});
