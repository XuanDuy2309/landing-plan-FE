import { observer } from "mobx-react"
import { ButtonIcon } from "../button-icon"

interface IProps {
    item: any
    onRemove: () => void
}

export const ItemVideoCreate = observer(({ item, onRemove }: IProps) => {
    return (
        <div className="size-full rounded bg-gray-200 cursor-pointer relative">
            <video src={item} className="w-full h-full object-cover" controls >
            </video>
            <ButtonIcon icon="close-outline" size='xxs' className="absolute top-1.5 right-1.5 bg-gray-100" onClick={onRemove} />

        </div>
    )
})