import classNames from 'classnames'
import debounce from 'debounce'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { Colors } from 'src/assets'
import { IconBase } from 'src/components'
import { NominatimResult } from 'src/core/models'
import { useListSearchBoxLandingPlan, useManagementLandingPlan } from 'src/core/modules'

export const SearchBoxLandingMap = observer(() => {
    const { filter, handleSearch, listResultSearch, setListResultSearch, loading } = useListSearchBoxLandingPlan()
    const [keyWord, setKeyWord] = useState("")
    const { placement, setPlacement } = useManagementLandingPlan()

    return (
        <>
            <div className={classNames('w-[392px] absolute top-0 left-0 py-3 pl-4 ', {
                "h-[72px]": listResultSearch.length === 0,
                "h-[454px]": listResultSearch.length > 0
            })}>
                <div className={classNames("h-full flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.2),0_-1px_0px_rgba(0,0,0,0.02)] bg-white", {
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
                            className='placeholder:text-gray-500 w-full outline-none'
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
                    {/* <button className='w-[54px] h-full'>
                        <IconBase icon='search-outline' size={24} color={Colors.gray[500]} />
                    </button> */}

                    <div className="flex flex-col h-full ">
                        {
                            listResultSearch.map((item, index) => {

                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setKeyWord("")
                                            setListResultSearch([])
                                            setPlacement(item)
                                            console.log(item)
                                        }}
                                        className='flex items-center justify-start p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors'>
                                        <span>{item.display_name}</span>
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