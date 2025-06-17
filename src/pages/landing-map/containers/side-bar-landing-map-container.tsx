import { observer } from 'mobx-react'
import { useNavigate } from 'react-router-dom'
import { Colors } from 'src/assets'
import { ButtonLoading } from 'src/components'
import { ButtonIcon } from 'src/components/button-icon'
import { ListPaginationLocalContainer } from 'src/components/list-pagination-local'
import { useManagementLandingPlan, usePostContext } from 'src/core/modules'
import { useCoreStores } from 'src/core/stores'
import { ItemLandingMap } from '../components/item-landing-map'

interface IProps {

}

export const SideBarLandingMapContainer = observer(({ }: IProps) => {
    const { openSidebar,
        setOpenSidebar,
        setHoveredPostId,
        hoveredPostId,
        landingPlanMap,
        setSelectedLandingPlan,
        selectedLandingPlan,
        setShouldFlyToLandingPlan,
        listCoordinates,
        setListCoordinates
    } = useManagementLandingPlan()
    const { data } = usePostContext()
    const { profile } = useCoreStores().sessionStore
    const navigate = useNavigate()
    const handleSelectLandingPlan = (item: any) => {
        setSelectedLandingPlan(item);
        setShouldFlyToLandingPlan(true);
    };

    // console.log(listCoordinates)
    return (
        <div className='w-full h-full bg-white min-h-0 flex-none'>
            <div className="w-full flex-none  py-1 px-2 flex items-center justify-between cursor-pointer border-b border-gray-100 h-[52px]"
            >
                <div onClick={() => { navigate('/home') }} className='flex items-center gap-2 w-full h-full'>
                    <img src="/images/logo-landing-plan.png" alt="" className="h-full object-contain bg-blue-300 rounded" />
                    <span className="text-lg font-medium text-green-900">LANDING PLAN</span>
                </div>

                <ButtonIcon
                    icon="close-outline"
                    size='xxs'
                    color={Colors.gray[500]}
                    onClick={() => { setOpenSidebar(false) }}
                />
            </div>
            <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full min-h-0">
                <div className="flex flex-col flex-none gap-2 min-h-0">
                    <span className='text-gray-900 font-medium text-[16px]'>Danh sách bản đồ quy hoạch</span>
                    <div className='flex flex-col gap-3 flex-none'>
                        {/* {landingPlanMap && landingPlanMap.length > 0 && landingPlanMap.map((item, index) => (
                            <ItemLandingMap item={item} key={index} checked={selectedLandingPlan?.id === item.id} onClick={(item) => handleSelectLandingPlan(item)}
                            />
                        ))}
                        {landingPlanMap && landingPlanMap.length === 0 && <span className='text-gray-500 text-center h-[200px] flex items-center justify-center'>Không có bản đồ quy hoạch tại đây</span>} */}
                        <ListPaginationLocalContainer
                            data={landingPlanMap}
                            renderItem={(item, index) => (
                                <ItemLandingMap item={item} key={index} checked={selectedLandingPlan?.id === item.id} onClick={(item) => handleSelectLandingPlan(item)}
                                />
                            )}
                            label='bản đồ quy hoạch'
                            renderEmpty={<span className='text-gray-500 text-center h-[200px] flex items-center justify-center'>Không có bản đồ quy hoạch tại đây</span>}
                            pageSizeProps={5}
                            isHideDropdown
                        />

                    </div>
                </div>
                <div className="flex flex-col gap-2 pt-2 h-full min-h-0">
                    <div className='w-full flex items-center justify-between'>
                        <span className='text-gray-900 font-medium text-[16px]'>Danh sách bài viết</span>
                        <ButtonLoading label="Clear" template="ActionBlue" onClick={() => { setListCoordinates([]) }} />
                        <ButtonLoading label="Thêm coordinates" template="ActionBlue" onClick={() => { }} />
                    </div>
                    <div className='flex flex-col '>
                        {
                            listCoordinates && listCoordinates.length > 0 && listCoordinates.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setListCoordinates(listCoordinates.filter((i) => i !== item))
                                    }}
                                >
                                    <span className='w-full line-clamp-1 h-7 border-b cursor-pointer'>{item}</span>
                                </div>
                            ))
                        }
                        {/* {data && data.length === 0 && profile && <span className='text-gray-500 text-center col-span-2 h-[200px] flex items-center justify-center'>Không có bài viết nào</span>}
                        {data && data.length === 0 && !profile && <span className='text-gray-500 text-center col-span-2 h-[200px] flex items-center justify-center gap-1'>Vui lòng <button onClick={() => {
                            navigate('/auth/login')
                        }} className='text-blue-600 font-medium'>đăng nhập</button> để xem các bài viết</span>} */}
                    </div>
                </div>
                {/* <div className="flex flex-col gap-2 pt-2 h-full min-h-0">
                    <span className='text-gray-900 font-medium text-[16px]'>Danh sách bài viết</span>
                    <div className='grid grid-cols-2 gap-2 '>
                        {data && data.length > 0 && data.map((item, index) => (
                            <div
                                key={index}
                                onMouseEnter={() => setHoveredPostId(item.id!)}
                                onMouseLeave={() => setHoveredPostId(null)}
                            >
                                <ItemPostSidebarLandingMap item={item as any} />
                            </div>
                        ))}
                        {data && data.length === 0 && profile && <span className='text-gray-500 text-center col-span-2 h-[200px] flex items-center justify-center'>Không có bài viết nào</span>}
                        {data && data.length === 0 && !profile && <span className='text-gray-500 text-center col-span-2 h-[200px] flex items-center justify-center gap-1'>Vui lòng <button onClick={() => {
                            navigate('/auth/login')
                        }} className='text-blue-600 font-medium'>đăng nhập</button> để xem các bài viết</span>}
                    </div>
                </div> */}
            </div>
        </div >
    )
})
