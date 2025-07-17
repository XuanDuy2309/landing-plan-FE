import { Select, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useState } from "react";
import { toast } from "react-toastify";
import { Colors } from "src/assets";
import { ButtonIcon } from "src/components/button-icon";
import { PostDetailModal } from "src/components/modal/post-detail";
import { PostApi } from "src/core/api";
import { formatMoney } from "src/core/base";
import { PostModel, Purpose_Post, Status_Post } from "src/core/models";
import { PostContextProvider, usePostContext } from "src/core/modules";


export const PostsScreen = observer(() => {
    return (
        <PostContextProvider>
            <PostsContainer />
        </PostContextProvider>
    )
})

const PostsContainer = observer(() => {
    const { data, loading, filter, onRefresh, total, pageSize, indexPage, onNext, onPrev } = usePostContext();
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState<PostModel>();

    let pageSizeTemp = pageSize * indexPage;
    if (pageSize * indexPage >= total) {
        pageSizeTemp = total;
    }
    let showIndexTemp = 1;
    if (indexPage > 1) {
        showIndexTemp = indexPage * pageSize - pageSize;
    }

    const columns: ColumnsType<PostModel> = [
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
                    Number(status) === Status_Post.Process ? 'success' :
                        Number(status) === Status_Post.Coming_Soon ? 'warning' :
                            'error'
                }>
                    {Number(status) === Status_Post.Process ? 'Đã duyệt' :
                        Number(status) === Status_Post.Coming_Soon ? 'Chờ duyệt' :
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
                    Number(purpose) === Purpose_Post.For_Sell ? 'green' :
                        Number(purpose) === Purpose_Post.For_Rent ? 'blue' :
                            'red'
                }>
                    {Number(purpose) === Purpose_Post.For_Sell ? 'Bán' :
                        Number(purpose) === Purpose_Post.For_Rent ? 'Cho thuê' :
                            'Đấu giá'}
                </Tag>
            )
        },
        {
            title: 'Giá',
            dataIndex: 'price_for_buy',
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
                    {Number(record.status) === Status_Post.Coming_Soon && (
                        <>
                            <ButtonIcon
                                icon="done-outline"
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

    const handleView = (record: PostModel) => {
        setSelectedPost(record);
        setShowDetailModal(true);
    };

    const handleApprove = async (record: PostModel) => {
        record.status = Status_Post.Process
        if (!record.id) return
        const res = await PostApi.updatePost(record.id, { status: record.status })
        if (res.Status) {
            toast.success(res.Message)
            onRefresh()
            return
        }
        toast.error(res.Message)
    };

    const handleReject = async (record: PostModel) => {
        record.status = Status_Post.End
        if (!record.id) return
        const res = await PostApi.updatePost(record.id, { status: record.status })
        if (res.Status) {
            toast.success(res.Message)
            onRefresh()
            return
        }
        toast.error(res.Message)

    };

    return (
        <div className="w-full h-full flex flex-col min-h-0">
            <div className="w-full flex flex-col">
                <div className="flex justify-between items-center mb-6 h-8">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý bài đăng</h1>
                </div>

                <div className="flex items-center justify-between px-4">
                    <div className="flex space-x-4 mb-6">
                        <div className="w-[300px] h-8 border border-gray-200 flex items-center rounded">
                            <input type="text" onChange={(e) => { filter.query = e.target.value }} className="w-full h-full text-xs px-3"
                                placeholder="Tìm kiếm theo địa chỉ"
                            />
                            <ButtonIcon icon="search-outline" size="xxs"
                                color={Colors.gray[300]}
                                onClick={() => {
                                    onRefresh()
                                }} />
                        </div>

                        <Select
                            placeholder="Trạng thái"
                            style={{ width: 150 }}
                            options={[
                                { value: 4, label: 'Tất cả' },
                                { value: Status_Post.Process, label: 'Đã duyệt' },
                                { value: Status_Post.Coming_Soon, label: 'Chờ duyệt' },
                                { value: Status_Post.End, label: 'Từ chối' },
                            ]}
                            onChange={(value) => {
                                filter.status = value === 4 ? undefined : value
                                onRefresh()
                            }}
                        />

                        <Select
                            placeholder="Mục đích"
                            style={{ width: 150 }}
                            options={[
                                { value: [], label: 'Tất cả' },
                                { value: Purpose_Post.For_Sell, label: 'Bán' },
                                { value: Purpose_Post.For_Rent, label: 'Cho thuê' },
                                { value: Purpose_Post.For_Auction, label: 'Đấu giá' },
                            ]}
                            onChange={(value) => {
                                filter.purpose = value ? [value] : []
                                onRefresh()
                            }}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <ButtonIcon icon="arrowleft" size="xxs" color={Colors.gray[400]} onClick={onPrev} />
                        <span>{showIndexTemp}-{pageSizeTemp} của {total} bài đăng</span>
                        <ButtonIcon icon="arrowright" size="xxs" color={Colors.gray[400]} onClick={onNext} />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    rowKey="id"
                    pagination={false}
                />
            </div>
            <PostDetailModal
                post={selectedPost}
                visible={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedPost(undefined);
                }}
            />
        </div>
    );
});