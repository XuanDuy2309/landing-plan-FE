import { observer } from 'mobx-react'
import moment from 'moment'
import { formatMoney } from 'src/core/base'
import { PostModel } from 'src/core/models'

interface IProps {
    item: PostModel & { update_at: string }
}

export const ItemPostSidebarLandingMap = observer(({ item }: IProps) => {
    return (
        <div onClick={() => {
            window.open(`/post/${item.id}`);
        }} className="flex flex-col cursor-pointer hover:bg-gray-100 rounded-[4px] overflow-hidden h-[315px] w-full shadow-[0_2px_4px_rgba(0,0,0,0.2),0_-1px_0px_rgba(0,0,0,0.02)] text-[14px] leading-[16px] text-gray-700">
            <img src={JSON.parse((item as any).image_links)[0]} alt="" className="h-[194px] w-full flex-none" />
            <div className='flex flex-col justify-between h-full p-2'>
                <div className='flex flex-col gap-1'>
                    <span className='line-clamp-1 font-medium text-gray-900 leading-[20px]'>{item.title}</span>
                    <span>Diện tích: <strong >{item.area} m²</strong> - <strong>{formatMoney(Number(item?.price_for_buy), 1, 'vn')}</strong></span>
                    <span className='line-clamp-2'>{item.address}</span>
                </div>
                <span className='text-gray-500'>Cập nhật: {moment(item.update_at).format("DD/MM/YYYY")}</span>
            </div>
        </div>
    )
})
