import classNames from 'classnames'
import debounce from 'debounce'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { Colors } from 'src/assets'
import { ButtonLoading, IconBase } from 'src/components'
import { NominatimResult } from 'src/core/models'
import { useCreatePostContext, useListSearchBoxLandingPlan, useManagementLandingPlan } from 'src/core/modules'
import { hideLoading, showLoading } from 'src/core/services'

export const ModalSearchBoxLandingMap = observer(() => {
    const { filter, handleSearch, listResultSearch, setListResultSearch, loading, handleReverseVietMap } = useListSearchBoxLandingPlan()
    const [keyWord, setKeyWord] = useState("")
    const { placement, setPlacement } = useManagementLandingPlan()
    const { setOpenMap, setAction, setMessage } = useCreatePostContext()

    const handleSelect = async (item: NominatimResult) => {
        setKeyWord("")
        setListResultSearch([])
        setPlacement(item)
    }

    return (
        <>
            <div className={classNames('w-[392px] absolute top-3 left-4', {
                "": listResultSearch.length === 0,
                "h-[454px]": listResultSearch.length > 0
            })}>
                <div className={classNames("h-full flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.2),0_-1px_0px_rgba(0,0,0,0.02)] bg-white overflow-hidden", {
                    "rounded-full": listResultSearch.length === 0,
                    "rounded-[28px]": listResultSearch.length > 0
                })}>
                    <div className={classNames('w-full h-[48px] flex-none flex items-center', {
                        "border-b border-gray-100": listResultSearch.length > 0
                    })}>
                        <button className='w-[56px] h-full'>
                            <IconBase icon='more-outline' size={24} color={Colors.gray[500]} />
                        </button>
                        <input
                            placeholder='Tìm kiếm vị trí'
                            value={keyWord}
                            onChange={(e) => { setKeyWord(e.target.value) }}
                            onBlur={(e) => { if (!keyWord) setListResultSearch([]) }}
                            className='placeholder:text-gray-500 w-full h-full outline-none'
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch(keyWord)
                                }
                            }}
                        />
                        {!loading ? <button
                            onClick={() => handleSearch(keyWord)}
                            className='w-[56px] h-full'>
                            <IconBase icon='search-outline' size={24} color={Colors.gray[500]} />
                        </button> : (
                            <div className="size-[24px] mr-[12px] animate-spin">
                                <IconBase icon='loading-outline' size={20} color={Colors.gray[500]} />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col h-full overflow-y-auto">
                        {
                            listResultSearch.map((item, index) => {

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleSelect(item)}
                                        className='flex items-center justify-start p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors'>
                                        <span className='text-start'>{item.display_name}</span>
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
)