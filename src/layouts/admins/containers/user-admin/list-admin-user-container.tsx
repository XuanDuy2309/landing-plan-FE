import { Button, Form, Input, Select, Table, Tag } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { observer } from "mobx-react";
import moment from "moment";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Colors } from "src/assets";
import { ButtonIcon } from "src/components/button-icon";
import { ModalConfirm } from "src/components/modal-confirm/modal-confim";
import { UserModel } from "src/core/models";
import { useListUserContext } from "src/core/modules/user/context";
import { hideLoading, showLoading } from "src/core/services";

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

export const ListAdminUserContainer = observer(() => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<UserData[]>([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [form] = Form.useForm();
    const { setCreate, isCreate, data: dataUser, onToggleStatus, onRefresh, setItemUpdate } = useListUserContext()
    const [selectedRecord, setSelectedRecord] = useState<UserModel | null>(null);
    const modalConfirmChangeStatusRef = useRef<any>(null);
    // Mock data for testing

    const handleToggleStatus = (record: UserModel) => {
        setSelectedRecord(record);
        modalConfirmChangeStatusRef.current?.open();
    };

    const columns: ColumnsType<UserModel> = [
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
            render: (email) => (
                <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                    {email || '---'}
                </a>
            )
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
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
            title: 'Bài đăng',
            dataIndex: 'total_posts',
            width: 100,
            // sorter: (a, b) => ,
        },
        {
            title: 'Đấu giá',
            dataIndex: 'total_auctions',
            width: 100,
            // sorter: (a, b) => a.total_auctions - b.total_auctions,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            width: 150,
            render: (date) => date ? moment(date).format('DD/MM/YYYY HH:mm') : '---'
        },
        {
            title: 'Đăng nhập cuối',
            dataIndex: 'last_login',
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
                        onClick={() => { setItemUpdate(record); setCreate(true); }}
                    />
                    {/* <ButtonIcon
                        icon="add-outline"
                        size="xxs"
                        color={Colors.green[600]}
                    // onClick={() => handleEdit(record)}
                    /> */}
                    <ButtonIcon
                        icon={record.status === 'active' ? 'padlock-outline' : 'unlock-outline'}
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
        <>
            <div className='flex flex-col w-full h-full'>
                <div className="flex space-x-4 mb-6">
                    <Input.Search
                        placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                        style={{ width: 300 }}
                        onSearch={(value) => console.log('Search:', value)}
                    />
                    <Select
                        placeholder="Trạng thái"
                        style={{ width: 150 }}
                        options={[
                            { value: 'all', label: 'Tất cả' },
                            { value: 'active', label: 'Hoạt động' },
                            { value: 'blocked', label: 'Đã khóa' },
                        ]}
                        onChange={(value) => console.log('Status:', value)}
                    />
                    <Select
                        placeholder="Vai trò"
                        style={{ width: 150 }}
                        options={[
                            { value: 'all', label: 'Tất cả' },
                            { value: 'admin', label: 'Admin' },
                            { value: 'user', label: 'User' },
                        ]}
                        onChange={(value) => console.log('Role:', value)}
                    />
                    <Button type="default" onClick={() => console.log('Reset filters')}>
                        Đặt lại
                    </Button>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={dataUser}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        total: data.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} người dùng`
                    }}
                />
            </div>

            <ModalConfirm
                ref={modalConfirmChangeStatusRef}
                label={`Bạn có chắc chắn muốn ${selectedRecord?.status === 'active' ? 'khóa' : 'mở khóa'} tài khoản này?`}
                onConfirm={async () => {
                    try {
                        showLoading()
                        const res = await onToggleStatus(selectedRecord?.id || 0)
                        if (res?.Status) {
                            toast.success(res.Message)
                            modalConfirmChangeStatusRef.current?.close()
                            onRefresh()
                            return
                        }
                        toast.error(res?.Message)
                        hideLoading()
                    } catch (error) {
                        console.error('Toggle status failed:', error);
                    } finally {
                        setSelectedRecord(null)
                    }
                }
                }
            />
        </>
    )
})
