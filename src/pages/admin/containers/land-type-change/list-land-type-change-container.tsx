import { Table, Tag } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { observer } from "mobx-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Colors } from "src/assets";
import { ButtonIcon } from "src/components/button-icon";
import { ModalConfirm } from "src/components/modal-confirm/modal-confim";
import { LandTypeChangeModel } from "src/core/models";
import { useLandTypeChangeContext } from "src/core/modules";
import { hideLoading, showLoading } from "src/core/services";


export const ListLandTypeChangeContainer = observer(() => {
    const { setCreate, isCreate, data, onRefresh, setItemUpdate, loading, filter, pageSize, indexPage, total, onNext, onPrev, onDeleteItem } = useLandTypeChangeContext()
    const [selectedRecord, setSelectedRecord] = useState<LandTypeChangeModel | null>(null);
    const modalConfirmChangeStatusRef = useRef<any>(null);

    const columns: ColumnsType<LandTypeChangeModel> = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 60,
        },
        {
            title: 'Khu vực',
            dataIndex: 'name',
            width: 200,
            render: (_, record) => (
                <div className="w-full flex items-center justify-center px-3 py-1 h-full">
                    <span className="text-gray-700 text-sm line-clamp-2" title={record.name || ''}>{record.name}</span>
                </div>
            )
        },
        {
            title: 'Loại đất',
            dataIndex: 'land_type_name',
            width: 200,
            render: (_, record) => (
                <div className="w-full flex items-center justify-center px-3 py-1 h-full">
                    <span className="text-gray-700 text-sm line-clamp-2" title={record.land_type_name || ''}>{record.land_type_name}</span>
                </div>
            )
        },
        {
            title: 'Mã',
            key: 'land_type_code',
            width: 200,
            render: (_, record) => (
                <div className="w-full flex items-center justify-center px-3 py-1 h-full">
                    <div className="w-full h-full rounded flex items-center justify-center" style={{ backgroundColor: record.land_type_color }}>
                        <span className="text-gray-700 text-sm">{record.land_type_code}</span>
                    </div>
                </div>
            )
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
            title: 'Thao tác',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <div className="flex space-x-2 items-center w-full">

                    <ButtonIcon
                        icon="edit-outline"
                        size="xxs"
                        color={Colors.green[600]}
                        onClick={() => {
                            setItemUpdate(record)
                            setCreate(true)
                        }}
                    />
                    <ButtonIcon
                        icon={'delete-outline'}
                        size="xxs"
                        color={Colors.red[600]}
                        onClick={() => {
                            setSelectedRecord(record)
                            modalConfirmChangeStatusRef.current?.open()
                        }}
                    />
                </div>
            )
        },
    ];

    let pageSizeTemp = pageSize * indexPage;
    if (pageSize * indexPage >= total) {
        pageSizeTemp = total;
    }
    let showIndexTemp = 1;
    if (indexPage > 1) {
        showIndexTemp = indexPage * pageSize - pageSize;
    }

    return (
        <>
            <div className='flex flex-col w-full h-full'>
                <div className="flex items-center justify-between px-4">
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
                    <div className="flex items-center space-x-2">
                        <ButtonIcon icon="arrowleft" size="xxs" color={Colors.gray[400]} onClick={onPrev} />
                        <span>{showIndexTemp}-{pageSizeTemp} của {total} khu vực</span>
                        <ButtonIcon icon="arrowright" size="xxs" color={Colors.gray[400]} onClick={onNext} />
                    </div>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />
            </div>

            <ModalConfirm
                ref={modalConfirmChangeStatusRef}
                label={`Bạn có chắc chắn muốn xoá khu vực chuyển đổi này?`}
                onConfirm={async () => {
                    try {
                        showLoading()
                        const res = await onDeleteItem(selectedRecord?.id || 0)
                        hideLoading()
                        if (res?.Status) {
                            toast.success(res.Message)
                            modalConfirmChangeStatusRef.current?.close()
                            onRefresh()
                            return
                        }
                        toast.error(res?.Message)
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
