import { Dropdown } from 'antd'
import classNames from 'classnames'
import debounce from 'debounce'
import { observer } from 'mobx-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SelectItemLandingType } from 'src/components'
import { LandingTypeModel } from 'src/core/models'
import { ListLandingTypeProvider, usePostContext } from 'src/core/modules'

export const FilterLandingType = observer(() => {
    const { filter, onRefresh } = usePostContext()
    const [listLandingType, setListLandingType] = useState<LandingTypeModel[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleKeywordChange = debounce((value: string) => {
        setKeyword(value);
    }, 300);

    const provider = useMemo(() => {
        const p = new ListLandingTypeProvider()
        p.setFilter({
        })
        p.pageSize = 5
        return p
    }, [])

    useEffect(() => {
        const refresh = async () => {
            await provider.refreshData();
            setListLandingType(provider.data.slice(0, length || 5));
        }

        refresh();
    }, [])

    const handleSelect = (item: LandingTypeModel) => {
        setListLandingType(prev => [...prev, item]);
        filter.type_landing_ids = [...filter.type_landing_ids, item.id!]
        onRefresh()
        setIsOpen(false);
    }

    return (
        <div className='absolute top-3 left-[400px] pl-4 flex items-center gap-2 h-[48px]'>
            {listLandingType?.map((it, idx) => (
                <button
                    className={classNames(
                        'flex items-center justify-center py-1 px-[10px] rounded-full bg-blue-50 shadow-[0_2px_4px_rgba(0,0,0,0.2),0_-1px_0px_rgba(0,0,0,0.02)]',
                        { 'bg-gray-100 ': !filter.type_landing_ids?.includes(it.id!) },
                        { 'bg-blue-100 ': filter.type_landing_ids?.includes(it.id!) }
                    )}
                    onClick={() => {
                        if (filter.type_landing_ids?.includes(it.id!)) {
                            filter.type_landing_ids = filter.type_landing_ids.filter(x => x != it.id!)
                        } else {
                            filter.type_landing_ids = [...filter.type_landing_ids, it.id!]
                        }
                        onRefresh();
                    }}
                >
                    <span
                        className={classNames(
                            'text-[14px] leading-[20px] text-blue-600 ',
                            { 'text-gray-500': !filter.type_landing_ids?.includes(it.id!) },
                            { 'text-blue-600 ': filter.type_landing_ids?.includes(it.id!) }
                        )}
                    >
                        {it.code}
                    </span>
                </button>
            ))}

            <Dropdown
                dropdownRender={() => <SelectItemLandingType keyword={keyword} excludeIds={listLandingType.map(x => x.id!)} onSelect={handleSelect} />}
                trigger={['click']}
                open={isOpen}
                onOpenChange={(value) => {
                    setIsOpen(value)
                    if (value) {
                        setKeyword('')
                    }
                }}
                destroyPopupOnHide
            >
                {!isOpen ? (
                    <button onClick={() => { setIsOpen(true) }} className="flex items-center justify-center py-1 px-[10px] rounded-full bg-blue-100 shadow-[0_2px_4px_rgba(0,0,0,0.2),0_-1px_0px_rgba(0,0,0,0.02)]">
                        <span className='text-blue-400 text-md'>{"Khác"}</span>
                    </button>
                ) : (
                    <div
                        className={classNames(
                            'flex items-center border-b border-blue-600 bg-white h-[28px] px-3 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.2),0_-1px_0px_rgba(0,0,0,0.02)]',
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(true);
                            inputRef.current?.focus();
                        }}
                    >
                        <input
                            autoFocus
                            placeholder={"Tìm kiếm"}
                            ref={inputRef}
                            onChange={(e) => {
                                handleKeywordChange(e.target.value);
                            }}
                            className={`focus:outline-none bg-transparent focus:ring-2
                  focus:ring-transparent text-gray-900 text-md
                  w-[240px] hover:none`}
                        />
                    </div>
                )}
            </Dropdown>
        </div>
    )
}
)
