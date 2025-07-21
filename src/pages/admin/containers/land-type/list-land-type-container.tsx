import { Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { observer } from "mobx-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Colors } from "src/assets";
import { ButtonIcon } from "src/components/button-icon";
import { ModalConfirm } from "src/components/modal-confirm/modal-confim";
import { LandingTypeModel } from "src/core/models";
import { useListLandTypeContext } from "src/core/modules";
import { hideLoading, showLoading } from "src/core/services";


export const ListLandTypeContainer = observer(() => {
    const { setCreate, isCreate, data, onRefresh, setItemUpdate, loading, filter, pageSize, indexPage, total, onNext, onPrev, onDeleteItem } = useListLandTypeContext()
    const [selectedRecord, setSelectedRecord] = useState<LandingTypeModel | null>(null);
    const modalConfirmChangeStatusRef = useRef<any>(null);

    const columns: ColumnsType<LandingTypeModel> = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 60,
        },
        {
            title: 'Loại đất',
            dataIndex: 'name',
            width: 200,
        },
        {
            title: 'Mã',
            key: 'code',
            width: 200,
            render: (_, record) => (
                <div className="w-full flex items-center justify-center px-3 py-1 h-full">
                    <div className="w-full h-full rounded flex items-center justify-center" style={{ backgroundColor: record.color }}>
                        <span className="text-gray-700 text-sm">{record.code}</span>
                    </div>
                </div>
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
                        <span>{showIndexTemp}-{pageSizeTemp} của {total} loại đất</span>
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
                label={`Bạn có chắc chắn muốn xoá loại đất này?`}
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
