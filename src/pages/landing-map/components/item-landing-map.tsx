import { LandingPlanModel } from 'src/core/models'

interface IProps {
    item: LandingPlanModel
}

export const ItemLandingMap = ({ item }: IProps) => {
    return (
        <div className='w-full'>
            <span>{item.name}</span>
        </div>
    )
}
