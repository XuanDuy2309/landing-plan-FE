import { observer } from "mobx-react"
import { ButtonIcon } from "../button-icon"

interface IProps {
    item: any
    onRemove: () => void
}

export const ItemImageCreate = observer(({ item, onRemove }: IProps) => {
    return (
        <div className="size-full rounded bg-gray-200 cursor-pointer relative">
            <img src={item} alt="" className="w-full h-full object-cover" />
            <ButtonIcon icon="close-outline" size='xxs' className="absolute top-1.5 right-1.5 bg-gray-100" onClick={onRemove}/>
        </div>
    )
})