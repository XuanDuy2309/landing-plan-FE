import { Button, Select, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { observer } from "mobx-react";
import moment from "moment";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Colors } from "src/assets";
import { ModalBase, PostDetailModal } from "src/components";
import { ButtonIcon } from "src/components/button-icon";
import { ModalConfirm } from "src/components/modal-confirm/modal-confim";
import { BidsApi, PostApi } from "src/core/api";
import { formatMoney } from "src/core/base";
import { BIDModel, PostModel, Purpose_Post, Status_Post } from "src/core/models";
import { PostContextProvider, usePostContext } from "src/core/modules";

export const AuctionsScreen = observer(() => {
    return (
        <PostContextProvider purpose={Purpose_Post.For_Auction}>
            <AuctionsContainer />
        </PostContextProvider>
    )
})


const AuctionsContainer = observer(() => {
    const { data, loading, total, pageSize, filter, onRefresh, indexPage, onNext, onPrev } = usePostContext()
    const [selectedAuction, setSelectedAuction] = useState<PostModel>();
    const [bidHistory, setBidHistory] = useState<BIDModel[]>([]);
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false)
    const modalBids = useRef<any>(null)
    const confirmRef = useRef<any>(null)

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
                    Number(status) === Status_Post.Process ? 'success' :
                        Number(status) === Status_Post.Coming_Soon ? 'warning' :
                            'error'
                }>
                    {Number(status) === Status_Post.Process ? 'Đã duyệt' :
                        Number(status) === Status_Post.Coming_Soon ? 'Chờ duyệt' :
                            'Từ chối'}
                </Tag >
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
                        icon="auction-outline"
                        size="xxs"
                        color={Colors.green[600]}
                        onClick={() => handleViewBidHistory(record)}
                    />
                    {Number(record.status) === Status_Post.Coming_Soon && (
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

    const bidHistoryColumns: ColumnsType<BIDModel> = [
        {
            title: 'Người đấu giá',
            dataIndex: 'user_name',
            width: 200,
        },
        {
            title: 'Số tiền',
            dataIndex: 'price',
            width: 200,
            render: (amount) => formatMoney(amount, 1, 'vn') + ' VNĐ'
        },
        {
            title: 'Thời gian',
            dataIndex: 'bid_time',
            render: (time) => moment(time).format('DD/MM/YYYY HH:mm:ss')
        },
    ];

    const handleView = (record: PostModel) => {
        setSelectedAuction(record);
        setShowDetailModal(true)
    };

    const handleViewBidHistory = async (record: PostModel) => {
        setSelectedAuction(record);
        const res = await BidsApi.getBids({ id: record.id })
        if (res.Status) {
            setBidHistory(res.Data.data)
        }
        modalBids.current.open()
    };

    const handleCancel = (record: PostModel) => {
        setSelectedAuction(record)
        confirmRef.current.open()
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="w-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý đấu giá</h1>
                </div>

                {/* Filters */}
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
                        <Button type="default" onClick={() => {
                            filter.status = undefined
                            filter.query = undefined
                            onRefresh()
                        }}>
                            Đặt lại
                        </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ButtonIcon icon="arrowleft" size="xxs" color={Colors.gray[400]} onClick={onPrev} />
                        <span>{showIndexTemp}-{pageSizeTemp} của {total} phiên đấu giá</span>
                        <ButtonIcon icon="arrowright" size="xxs" color={Colors.gray[400]} onClick={onPrev} />
                    </div>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={false}
            />

            {/* Bid History Modal */}
            <ModalBase
                ref={modalBids}
            >
                <div className="w-full h-[600px] flex flex-col min-h-0 bg-white">
                    <div className="w-full h-12 flex items-center justify-between px-3 border-b border-gray-200">
                        <span className="text-lg text-gray-900 font-medium">Danh sách lượt đấu giá</span>
                        <ButtonIcon icon="close-outline" size="xxs" color={Colors.gray[900]} onClick={() => { modalBids.current.close() }} />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <Table
                            columns={bidHistoryColumns}
                            dataSource={bidHistory}
                            rowKey="id"
                            pagination={false}
                            className="h-full"
                        />
                    </div>
                </div>
            </ModalBase>
            <PostDetailModal
                post={selectedAuction}
                visible={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedAuction(undefined);
                }}
            />
            <ModalConfirm
                ref={confirmRef}
                label={`Bạn có chắc chắn muốn huỷ phiên đấu giá này`}
                onConfirm={async () => {
                    if (!selectedAuction) return
                    selectedAuction.status = Status_Post.End
                    const res = await PostApi.updatePost(selectedAuction?.id || 0, { status: selectedAuction.status })
                    if (res.Status) {
                        toast.success(res.Message)
                        onRefresh()
                        return
                    }
                    toast.error(res.Message)
                }
                }
            />
        </div>
    );
});
