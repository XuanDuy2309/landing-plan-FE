import { Dropdown } from "antd";
import classNames from "classnames";
import { observer } from "mobx-react";
import { ReactNode, useMemo, useState } from "react";
import { IconBase } from "./icon-base";

interface IProps {
    data: any
    label: string
    isGrid?: boolean
    renderTitle?: React.ReactNode;
    renderItem: (item: any, index: number) => ReactNode
    renderItemGrid?: (item: any, index: number) => ReactNode
    renderEmpty?: ReactNode
    pageSizeProps?: number
    isHideDropdown?: boolean
}

export const ListPaginationLocalContainer = observer(({ data, label, isGrid, renderEmpty, renderItem, renderItemGrid, pageSizeProps, renderTitle, isHideDropdown }: IProps) => {
    const [pageSize, setPageSize] = useState(pageSizeProps || 25);

    const [currentPage, setCurrentPage] = useState(1);


    const totalPages = useMemo(() => {
        return data ? Math.ceil(data?.length / pageSize) : 1;
    }, [data, pageSize]);

    // Lọc danh sách sản phẩm theo trang hiện tại
    const displayedData = useMemo(() => {
        if (!data) return [];
        const startIndex = (currentPage - 1) * pageSize;
        return data?.slice(startIndex, startIndex + pageSize);
    }, [data?.length, currentPage, pageSize]);

    if (!data || data?.length === 0) {
        return renderEmpty ?
            renderEmpty
            :
            <div className='w-full h-full min-h-[500px] flex flex-col justify-center items-center'>
                <img src='/images/app/not-found.jpg' className='' />
                <span className='text-gray-300'>{"data_not_found"}</span>
            </div>

    }

    return <div className="w-full h-full flex flex-col">
        <div className={classNames("w-full flex items-center h-8 flex-none justify-between px-3 bg-gray-100", {
            "!justify-end": isHideDropdown
        })}>
            {!isHideDropdown && <div className='flex flex-row space-x-1'>
                <span className='text-xs text-gray-700'>Show</span>
                <Dropdown
                    trigger={["click"]}
                    menu={{
                        items: [
                            ...(pageSizeProps ? [{ key: pageSizeProps, label: pageSizeProps }] : []),
                            { key: 10, label: '10' },
                            { key: 25, label: '25' },
                            { key: 50, label: '50' },
                            { key: 100, label: '100' },
                        ],
                        selectable: true,
                        selectedKeys: [pageSize.toString()],
                        onClick: (item) => {
                            setPageSize(Number(item.key));
                            setCurrentPage(1);
                        }
                    }}>
                    <div className='px-1 flex flex-row items-center'>
                        <span className='text-xs text-black'>{pageSize}</span>
                        <IconBase icon='arrowdown' size={12} />
                    </div>
                </Dropdown>
                <span className='text-xs text-gray-700'>{label}</span>
            </div>}
            <div className="flex flex-row items-center space-x-1">
                <span className="text-lxs text-gray-700 font-normal">
                    {`${displayedData?.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, data?.length)} ${'of'} ${data?.length} ${label}`}
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
        {renderTitle && renderTitle}
        {isGrid ?
            <div className={classNames("grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3 overflow-y-auto")}>
                {displayedData.map((item: any, index) =>
                    <div key={index}>
                        {renderItemGrid && renderItemGrid(item, index)}
                    </div>
                )}

            </div>
            :
            <div className="h-full w-full flex flex-col overflow-y-auto">
                {
                    displayedData?.length > 0 && displayedData.map((item, index) => {
                        return (
                            <div className='flex border-b border-gray-100' key={index}>
                                {renderItem(item, index)}
                            </div>
                        )

                    })
                }
            </div>
        }
    </div>
})
