import { Dropdown } from "antd";
import { observer } from "mobx-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { IconBase } from "src/components";
import { currencyFormat } from "src/core/base";

interface IProps {
    data: any
    value?: any
    onSelected?: (item: any) => void
}

export const HistorySetBid = observer(({ data, value, onSelected }: IProps) => {
    const [pageSize, setPageSize] = useState(25);

    const [currentPage, setCurrentPage] = useState(1);


    const totalPages = useMemo(() => {
        return data ? Math.ceil(data.length / pageSize) : 1;
    }, [data]);

    // Lọc danh sách sản phẩm theo trang hiện tại
    const displayedProgram = useMemo(() => {
        if (!data) return [];
        const startIndex = (currentPage - 1) * pageSize;
        return data.slice(startIndex, startIndex + pageSize);
    }, [data.length, currentPage]);

    // console.log('displayedProgram', displayedProgram);

    return (
        <div className="w-full h-full flex flex-col min-h-0">
            {data?.length > 0 && (
                <div className="w-full flex items-center h-8 justify-between px-3 bg-blue-50 flex-none">
                    <div className='flex flex-row space-x-1'>
                        <span className='text-xs text-gray-700'>Hiển thị:</span>
                        <Dropdown
                            trigger={["click"]}
                            menu={{
                                items: [
                                    { key: 10, label: '10' },
                                    { key: 25, label: '25' },
                                    { key: 50, label: '50' },
                                    { key: 100, label: '100' },
                                ],
                                selectable: true,
                                selectedKeys: [pageSize.toString()],
                                onClick: (item) => {
                                    setPageSize(Number(item.key));
                                }
                            }}>
                            <div className='px-1 flex flex-row items-center'>
                                <span className='text-xs text-black'>{pageSize}</span>
                                <IconBase icon='arrowdown' size={12} />
                            </div>
                        </Dropdown>
                        <span className='text-xs text-gray-700'>{'đặt giá/trang'}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-lxs text-gray-700 font-normal">
                            {`${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, data.length)} ${'của'} ${data.length} đặt giá`}
                        </span>
                        <div className="flex items-center">
                            <button
                                className={`size-7 flex items-center justify-center cursor-pointer hover:bg-gray-200 rounded-full ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}`}
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            >
                                <IconBase icon="arrowleft" size="16px" color="currentColor" />
                            </button>
                            <button
                                className={`size-7 flex items-center justify-center cursor-pointer hover:bg-gray-200 rounded-full ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}`}
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            >
                                <IconBase icon="arrowright" size="16px" color="currentColor" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full h-full flex flex-col overflow-y-auto">
                {
                    displayedProgram.length > 0 ?
                        <div className="w-full flex flex-col flex-none border border-gray-200">
                            <div className='w-full h-12 flex items-center divide-x font-medium text-gray-700 border-b border-gray-200 divide-gray-200'>
                                <div className="w-[100px] flex-none h-full px-3 flex items-center justify-center">
                                    <span>{'STT'}</span>
                                </div>
                                <div className="w-full h-full px-3 flex items-center">
                                    <span>{"Thời gian đặt giá"}</span>
                                </div>
                                <div className="w-full h-full px-3 flex items-center">
                                    <span>{"Họ và tên"}</span>
                                </div>
                                <div className="w-full h-full px-3 flex items-center justify-end">
                                    <span>{"Giá (VND)"}</span>
                                </div>
                            </div>
                            {
                                displayedProgram.map((item, index) => {
                                    return (
                                        <div className='w-full h-12 flex items-center divide-x border-b border-gray-200 divide-gray-200' key={index}>
                                            <div className="w-[100px] h-full px-3 flex flex-none items-center justify-center">
                                                <span>{index + 1}</span>
                                            </div>
                                            <div className="w-full h-full px-3 flex items-center">
                                                <span>{item.create_at ? moment(item.create_at, 'YYYY-MM-DD HH:mm').format('HH:mm DD/MM/YYYY') : '--/--/----'}</span>
                                            </div>
                                            <div className="w-full h-full px-3 flex items-center">
                                                <span>{item.user_name}</span>
                                            </div>
                                            <div className="w-full h-full px-3 flex items-center justify-end">
                                                <span>{currencyFormat(item.price)} VND</span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        :
                        <div className="w-full h-full flex-none flex items-center justify-center">
                            <span>{'Không có dữ liệu'}</span>
                        </div>
                }
            </div>
        </div>
    )
})