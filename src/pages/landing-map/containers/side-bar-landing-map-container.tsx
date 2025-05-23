import { observer } from 'mobx-react'
import { useNavigate } from 'react-router-dom'
import { Colors } from 'src/assets'
import { ButtonIcon } from 'src/components/button-icon'
import { useManagementLandingPlan, usePostContext } from 'src/core/modules'
import { ItemPostSidebarLandingMap } from '../components/item-post-sidebar-landing-map'

interface IProps {

}

export const SideBarLandingMapContainer = observer(({ }: IProps) => {
    const { openSidebar, setOpenSidebar, setHoveredPostId, hoveredPostId } = useManagementLandingPlan()
    const { data } = usePostContext()
    const navigate = useNavigate()

    return (
        <div className='w-full h-full bg-white min-h-0'>
            <div className="w-full  py-1 px-2 flex items-center justify-between cursor-pointer border-b border-gray-100 h-[52px]"
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
                    {data && data.length === 0 && <span className='text-gray-500 text-center col-span-2 h-[200px] flex items-center justify-center'>Không có bài viết nào</span>}
                </div>
            </div>
        </div >
    )
})
