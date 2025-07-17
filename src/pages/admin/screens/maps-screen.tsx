import { Button, Form, Input, Select, Table, Tag } from "antd";
import type { ColumnsType } from 'antd/es/table';
import 'leaflet/dist/leaflet.css';
import { observer } from "mobx-react";
import moment from "moment";
import { useState } from "react";
import { Colors } from "src/assets";
import { MapDetailModal } from "src/components";
import { ButtonIcon } from "src/components/button-icon";
import { LandingPlanModel } from 'src/core/models';
import { MapContextProvider, useMapContext } from 'src/core/modules';

export const MapsScreen = observer(() => {

    return (
        <MapContextProvider>
            <MapsContainer />
        </MapContextProvider>
    )
})


const MapsContainer = observer(() => {
    const { data, loading, pageSize, indexPage, total, onNext, onPrev } = useMapContext()
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedMap, setSelectedMap] = useState<LandingPlanModel>();
    const [form] = Form.useForm();

    let pageSizeTemp = pageSize * indexPage;
    if (pageSize * indexPage >= total) {
        pageSizeTemp = total;
    }
    let showIndexTemp = 1;
    if (indexPage > 1) {
        showIndexTemp = indexPage * pageSize - pageSize;
    }

    const columns: ColumnsType<LandingPlanModel> = [
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
            title: 'Cập nhật',
            dataIndex: 'updated_at',
            width: 150,
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: <div className="w-full flex items-center justify-center">
                <span>Thao tác</span>
            </div>,
            key: 'action',
            width: 150,
            render: (_, record) => (
                <div className="flex space-x-2 justify-center">
                    <ButtonIcon
                        icon="eye-outline"
                        size="xxs"
                        color={Colors.blue[600]}
                        onClick={() => handlePreview(record)}
                    />
                    {/* <ButtonIcon
                        icon="create-outline"
                        size="xxs"
                        color={Colors.green[600]}
                        onClick={() => handleEdit(record)}
                    /> */}
                    {/* <ButtonIcon 
                        icon={record.status === 'active' ? 'eye-off-outline' : 'eye-outline'}
                        size="xxs"
                        color={record.status === 'active' ? Colors.red[600] : Colors.green[600]}
                        onClick={() => handleToggleStatus(record)}
                    /> */}
                </div>
            )
        },
    ];

    const handlePreview = (record: LandingPlanModel) => {
        setSelectedMap(record);
        setShowPreviewModal(true);
    };

    const handleEdit = (record: LandingPlanModel) => {
        setSelectedMap(record);
        form.setFieldsValue(record);
        setShowAddModal(true);
    };

    // const handleToggleStatus = (record: LandingPlanModel) => {
    //     Modal.confirm({
    //         title: `Xác nhận ${record.status === 'active' ? 'ẩn' : 'hiển thị'} bản đồ`,
    //         content: `Bạn có chắc chắn muốn ${record.status === 'active' ? 'ẩn' : 'hiển thị'} bản đồ này?`,
    //         okText: 'Xác nhận',
    //         cancelText: 'Hủy',
    //         onOk: () => {
    //             // TODO: Implement toggle map status
    //             console.log('Toggle status:', record);
    //         }
    //     });
    // };

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
            <div className='w-full flex flex-col'>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý bản đồ</h1>
                    {/* <Button
                        type="primary"
                        onClick={() => {
                            setSelectedMap(undefined);
                            form.resetFields();
                            setShowAddModal(true);
                        }}
                    >
                        Thêm bản đồ mới
                    </Button> */}
                </div>

                {/* Filters */}
                <div className='flex items-center justify-between px-4'>
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
                    <div className="flex items-center space-x-2">
                        <ButtonIcon icon="arrowleft" size="xxs" color={Colors.gray[400]} onClick={onPrev} />
                        <span>{showIndexTemp}-{pageSizeTemp} của {total} bản đồ</span>
                        <ButtonIcon icon="arrowright" size="xxs" color={Colors.gray[400]} onClick={onNext} />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto">
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />
            </div>

            {/* Add/Edit Modal */}
            {/* <Modal
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
            </Modal> */}
            <MapDetailModal
                map={selectedMap}
                visible={showPreviewModal}
                onClose={() => {
                    setShowPreviewModal(false);
                    setSelectedMap(undefined);
                }}
            />
        </div>
    );
});
