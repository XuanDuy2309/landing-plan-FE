import { Form, Input, Modal, Select, Switch, Tag } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { observer } from "mobx-react";
import moment from "moment";
import { useState } from "react";
import { Colors } from "src/assets";
import { ButtonIcon } from "src/components/button-icon";
import { ListUserContextProvider, useListUserContext } from "src/core/modules/user/context";
import { HeaderUserAdmin } from "src/layouts/admins/components/user-admin/header-user-admin";
import { ListAdminUserContainer } from "src/layouts/admins/containers/user-admin/list-admin-user-container";

interface UserData {
    id: number;
    fullname: string;
    email: string;
    phone: string;
    status: 'active' | 'blocked';
    role: 'admin' | 'user';
    total_posts: number;
    total_auctions: number;
    created_at: string;
    last_login: string;
}

export const UsersScreen = observer(() => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<UserData[]>([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [form] = Form.useForm();
    const { setCreate, isCreate, data: dataUser } = useListUserContext()

    const columns: ColumnsType<UserData> = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 60,
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullname',
            width: 200,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 200,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: 120,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 120,
            render: (status) => (
                <Tag color={status === 'active' ? 'success' : 'error'}>
                    {status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                </Tag>
            )
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            width: 100,
            render: (role) => (
                <Tag color={role === 'admin' ? 'blue' : 'default'}>
                    {role === 'admin' ? 'Admin' : 'User'}
                </Tag>
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            width: 150,
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Đăng nhập cuối',
            dataIndex: 'last_login',
            width: 150,
            render: (date) => date ? moment(date).format('DD/MM/YYYY HH:mm') : "Không xác định"
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
                        icon="create-outline"
                        size="xxs"
                        color={Colors.green[600]}
                        onClick={() => handleEdit(record)}
                    />
                    <ButtonIcon
                        icon={record.status === 'active' ? 'lock-closed-outline' : 'lock-open-outline'}
                        size="xxs"
                        color={record.status === 'active' ? Colors.red[600] : Colors.green[600]}
                        onClick={() => handleToggleStatus(record)}
                    />
                </div>
            )
        },
    ];

    const handleView = (record: UserData) => {
        // TODO: Implement view user detail
        console.log('View user:', record);
    };

    const handleEdit = (record: UserData) => {
        setSelectedUser(record);
        form.setFieldsValue(record);
        setShowEditModal(true);
    };

    const handleToggleStatus = (record: UserData) => {
        Modal.confirm({
            title: `Xác nhận ${record.status === 'active' ? 'khóa' : 'mở khóa'} tài khoản`,
            content: `Bạn có chắc chắn muốn \${record.status === 'active' ? 'khóa' : 'mở khóa'} tài khoản này?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => {
                // TODO: Implement toggle user status
                console.log('Toggle status:', record);
            }
        });
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            // TODO: Implement save user
            console.log('Save user:', values);
            setShowEditModal(false);
        } catch (error) {
            console.error('Validate failed:', error);
        }
    };

    return (
        <ListUserContextProvider>
            <div className="w-full h-full flex flex-col overflow-y-auto min-h-0">
                {/* Header */}
                <HeaderUserAdmin />

                {/* Filters */}
                <ListAdminUserContainer />
                {/* Edit Modal */}
                <Modal
                    title="Chỉnh sửa thông tin người dùng"
                    open={showEditModal}
                    onCancel={() => setShowEditModal(false)}
                    onOk={handleSave}
                    okText="Lưu"
                    cancelText="Hủy"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        className="mt-4"
                    >
                        <Form.Item
                            name="fullname"
                            label="Họ tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                { type: 'email', message: 'Email không hợp lệ' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="role"
                            label="Vai trò"
                        >
                            <Select
                                options={[
                                    { value: 'admin', label: 'Admin' },
                                    { value: 'user', label: 'User' },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren="Hoạt động"
                                unCheckedChildren="Đã khóa"
                                defaultChecked={selectedUser?.status === 'active'}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ListUserContextProvider>
    );
});
