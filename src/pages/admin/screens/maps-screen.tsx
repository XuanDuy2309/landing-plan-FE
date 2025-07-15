import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Select, Table, Tag, Upload } from "antd";
import type { ColumnsType } from 'antd/es/table';
import 'leaflet/dist/leaflet.css';
import { observer } from "mobx-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from 'react-leaflet';
import { Colors } from "src/assets";
import { ButtonIcon } from "src/components/button-icon";

interface MapData {
    id: number;
    name: string;
    description: string;
    area_name: string;
    status: 'active' | 'inactive';
    folder_path: string;
    opacity: number;
    zoom_min: number;
    zoom_max: number;
    created_at: string;
    updated_at: string;
}

export const MapsScreen = observer(() => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<MapData[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedMap, setSelectedMap] = useState<MapData | null>(null);
    const [form] = Form.useForm();

    // Mock data for testing
    useEffect(() => {
        setData([
            {
                id: 1,
                name: "Quy hoạch Q7",
                description: "Bản đồ quy hoạch Quận 7",
                area_name: "Quận 7",
                status: "active",
                folder_path: "/maps/q7",
                opacity: 0.7,
                zoom_min: 12,
                zoom_max: 18,
                created_at: "2025-01-15T10:00:00",
                updated_at: "2025-07-15T09:30:00"
            },
            {
                id: 2,
                name: "Quy hoạch Q2",
                description: "Bản đồ quy hoạch Quận 2",
                area_name: "Quận 2",
                status: "inactive",
                folder_path: "/maps/q2",
                opacity: 0.7,
                zoom_min: 12,
                zoom_max: 18,
                created_at: "2025-02-20T15:00:00",
                updated_at: "2025-06-01T14:20:00"
            }
        ]);
    }, []);

    const columns: ColumnsType<MapData> = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 60,
        },
        {
            title: 'Tên bản đồ',
            dataIndex: 'name',
            width: 200,
        },
        {
            title: 'Khu vực',
            dataIndex: 'area_name',
            width: 150,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: 250,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 120,
            render: (status) => (
                <Tag color={status === 'active' ? 'success' : 'default'}>
                    {status === 'active' ? 'Đang hiển thị' : 'Đã ẩn'}
                </Tag>
            )
        },
        {
            title: 'Độ mờ',
            dataIndex: 'opacity',
            width: 100,
            render: (opacity) => `${opacity * 100}%`
        },
        {
            title: 'Zoom',
            dataIndex: 'zoom_min',
            width: 120,
            render: (_, record) => `${record.zoom_min} - ${record.zoom_max}`
        },
        {
            title: 'Cập nhật',
            dataIndex: 'updated_at',
            width: 150,
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <div className="flex space-x-2">
                    <ButtonIcon 
                        icon="eye-outline" 
                        size="xxs"
                        color={Colors.blue[600]}
                        onClick={() => handlePreview(record)}
                    />
                    <ButtonIcon 
                        icon="create-outline" 
                        size="xxs"
                        color={Colors.green[600]}
                        onClick={() => handleEdit(record)}
                    />
                    <ButtonIcon 
                        icon={record.status === 'active' ? 'eye-off-outline' : 'eye-outline'}
                        size="xxs"
                        color={record.status === 'active' ? Colors.red[600] : Colors.green[600]}
                        onClick={() => handleToggleStatus(record)}
                    />
                </div>
            )
        },
    ];

    const handlePreview = (record: MapData) => {
        setSelectedMap(record);
        setShowPreviewModal(true);
    };

    const handleEdit = (record: MapData) => {
        setSelectedMap(record);
        form.setFieldsValue(record);
        setShowAddModal(true);
    };

    const handleToggleStatus = (record: MapData) => {
        Modal.confirm({
            title: `Xác nhận ${record.status === 'active' ? 'ẩn' : 'hiển thị'} bản đồ`,
            content: `Bạn có chắc chắn muốn ${record.status === 'active' ? 'ẩn' : 'hiển thị'} bản đồ này?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => {
                // TODO: Implement toggle map status
                console.log('Toggle status:', record);
            }
        });
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            // TODO: Implement save map
            console.log('Save map:', values);
            setShowAddModal(false);
        } catch (error) {
            console.error('Validate failed:', error);
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý bản đồ</h1>
                <Button 
                    type="primary"
                    onClick={() => {
                        setSelectedMap(null);
                        form.resetFields();
                        setShowAddModal(true);
                    }}
                >
                    Thêm bản đồ mới
                </Button>
            </div>

            {/* Filters */}
            <div className="flex space-x-4 mb-6">
                <Input.Search 
                    placeholder="Tìm kiếm theo tên..." 
                    style={{ width: 300 }}
                    onSearch={(value) => console.log('Search:', value)}
                />
                <Select
                    placeholder="Trạng thái"
                    style={{ width: 150 }}
                    options={[
                        { value: 'all', label: 'Tất cả' },
                        { value: 'active', label: 'Đang hiển thị' },
                        { value: 'inactive', label: 'Đã ẩn' },
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
                    showTotal: (total) => `Tổng ${total} bản đồ`
                }}
            />

            {/* Add/Edit Modal */}
            <Modal
                title={selectedMap ? "Chỉnh sửa bản đồ" : "Thêm bản đồ mới"}
                open={showAddModal}
                onCancel={() => setShowAddModal(false)}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        name="name"
                        label="Tên bản đồ"
                        rules={[{ required: true, message: 'Vui lòng nhập tên bản đồ' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="area_name"
                        label="Khu vực"
                        rules={[{ required: true, message: 'Vui lòng nhập khu vực' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <div className="flex space-x-4">
                        <Form.Item
                            name="opacity"
                            label="Độ mờ"
                            className="flex-1"
                        >
                            <InputNumber 
                                min={0} 
                                max={1} 
                                step={0.1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="zoom_min"
                            label="Zoom tối thiểu"
                            className="flex-1"
                        >
                            <InputNumber 
                                min={1}
                                max={20}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="zoom_max"
                            label="Zoom tối đa"
                            className="flex-1"
                        >
                            <InputNumber 
                                min={1}
                                max={20}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="tiles"
                        label="File bản đồ"
                    >
                        <Upload.Dragger multiple>
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">Kéo thả hoặc click để tải lên file bản đồ</p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Preview Modal */}
            <Modal
                title={`Xem trước - ${selectedMap?.name}`}
                open={showPreviewModal}
                onCancel={() => setShowPreviewModal(false)}
                footer={null}
                width={800}
            >
                <div className="h-[500px] w-full">
                    <MapContainer
                        center={[10.7769, 106.7009]} // Ho Chi Minh City
                        zoom={12}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {selectedMap && (
                            <TileLayer
                                url={`/api/maps/${selectedMap.folder_path}/{z}/{x}/{y}.png`}
                                opacity={selectedMap.opacity}
                                minZoom={selectedMap.zoom_min}
                                maxZoom={selectedMap.zoom_max}
                            />
                        )}
                    </MapContainer>
                </div>
            </Modal>
        </div>
    );
});
