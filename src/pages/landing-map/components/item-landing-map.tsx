import classNames from 'classnames'
import { LandingPlanModel } from 'src/core/models'

interface IProps {
    item: LandingPlanModel
    checked?: boolean
    onClick?: (item: LandingPlanModel) => void
}

export const ItemLandingMap = ({ item, checked, onClick }: IProps) => {
    return (
        <div onClick={() => onClick && onClick(item)} className={classNames('w-full flex flex-col gap-2 shadow flex-none cursor-pointer hover:shadow-md transition-all px-3 py-2 text-gray-700', {
            "bg-blue-50": checked
        })}>
            <span className='text-gray-900 font-medium text-[16px]'>{item.name}</span>
            <span className='font-normal line-clamp-1'>{item.description || "---"}</span>
        </div>
    )
}
