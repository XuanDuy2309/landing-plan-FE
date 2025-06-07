import { Dropdown, Spin } from 'antd';
import classNames from 'classnames';
import debounce from 'debounce';
import { observer } from 'mobx-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Colors } from 'src/assets';
import { LandingPlanModel } from 'src/core/models';
import { ListLandingTypeProvider } from 'src/core/modules';
import { IconBase } from '../icon-base';

interface IProps {
    className?: string;
    onSelect: (item: LandingPlanModel) => void;
    value?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
    widthLabel?: number;
    error?: string
}

export const DropdownSelectLandingType = ({
    className = '',
    onSelect,
    value,
    disabled = false,
    onChange,
    widthLabel,
    error
}: IProps) => {
    const [keyword, setKeyword] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeywordChange = debounce((value: string) => {
        setKeyword(value);
    }, 300);

    const handleBlur = () => {
        setTimeout(() => {
            setIsOpen(false);
        }, 100);
    };
    return (
        <div className='flex gap-2 items-start'>
            <span className='text-base font-medium text-gray-700 flex-none' style={{ width: widthLabel }}>{"Chọn loại đất"}:</span>
            <div className='w-full flex flex-col gap-1'>
                <Dropdown
                    dropdownRender={() => <SelectItemLandingType keyword={keyword} onSelect={(item) => {
                        item && onSelect(item)
                        setIsOpen(false)
                    }} />}
                    trigger={['click']}
                    disabled={disabled}
                    open={isOpen}
                    onOpenChange={(isDropdownOpen) => {
                        if (!isDropdownOpen) setKeyword('');
                        setIsOpen(isDropdownOpen);
                    }}
                >
                    <button
                        className={classNames(
                            'flex items-center gap-1',
                            { 'border-b border-gray-100': !isOpen },
                            { 'border-b border-blue-600': isOpen && !disabled },
                            { 'border-b border-red-400': error },
                            { "cursor-not-allowed": disabled }
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(true);
                            inputRef.current?.focus();
                        }}
                        disabled={disabled}
                    >
                        {!isOpen ? (
                            value ?
                                <span className='w-full text-start'>{value}</span>
                                :
                                <span className='w-full text-gray-500 text-left'>{"Chọn loại đất"}</span>
                        ) : (
                            <input
                                disabled={disabled}
                                readOnly={!isOpen}
                                placeholder={"Tìm kiếm"}
                                ref={inputRef}
                                autoFocus
                                onChange={(e) => {
                                    handleKeywordChange(e.target.value);
                                }}
                                className={`focus:outline-none bg-transparent focus:ring-2
                                  focus:ring-transparent text-gray-900 text-md
                                  placeholder-gray-500
                                  w-full hover:none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            />
                        )}
                        <IconBase icon='arrowdown' size={16} color={Colors.gray[700]} />
                    </button>
                </Dropdown>
                {error && <span className='text-red-400 text-sm'>{error}</span>}
            </div>
        </div>
    );
};

interface IProps2 {
    keyword: string;
    onSelect: (item?: any) => void,
    isHideButtonAdd?: boolean
    excludeIds?: number[];
}

export const SelectItemLandingType = observer(({ keyword, onSelect, isHideButtonAdd, excludeIds }: IProps2) => {
    const [openModal, setOpenModal] = useState(false);
    let provider = useMemo(() => {
        const p = new ListLandingTypeProvider();
        return p;
    }, []);
    useEffect(() => {
        provider.setFilter({
            ...provider.filter,
            query: keyword,
        });
        console.log("keyword", keyword)
        provider.refreshData()
    }, [keyword]);

    return (
        <>
            <div
                onClick={(e) => e.stopPropagation()}
                className='w-full h-[290px] bg-white flex flex-col rounded-b shadow-md'
            >
                <div id={'export-transfer-product-scroll'} className='flex flex-col w-full h-full overflow-y-auto flex-none'>
                    {provider.data.length > 0 && (
                        provider.data.map((item: any, index) => (
                            <button
                                onClick={() => onSelect(item)}
                                key={index}
                                className='text-ellipsis overflow-hidden w-full flex flex-row hover:bg-gray-100 border-b-[1px] border-gray-100 flex-none'
                            >
                                <div className='flex flex-col px-3 py-2.5 justify-center text-gray-700 text-lmd'>
                                    <div className='flex items-center gap-2'>
                                        <div className="size-4 flex-none rounded-xs" style={{ backgroundColor: item.color }}></div>
                                        <span className='font-medium text-gray-900'>{item.name}</span>
                                    </div>
                                    <span className='text-gray-500 text-start text-[12px] pl-[24px]'>Mã: {item.code}</span>
                                </div>
                            </button>
                        ))
                    )}
                    {provider.isFetchData && (
                        <div
                            className={classNames('w-full items-center justify-center flex ', {
                                'h-[300px]': provider.data.length === 0,
                            })}
                        >
                            <Spin />
                        </div>
                    )}

                    {!provider.isFetchData && provider.data.length === 0 && (
                        <div className='w-full h-full flex justify-center items-center'>
                            <span>{"Không tìm thấy giá trị"}</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
});
