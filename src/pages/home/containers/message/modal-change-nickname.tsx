import { observer } from "mobx-react"
import { ButtonLoading, IconBase } from "src/components"
import { UserModel } from "src/core/models"
interface IProps {
    item: UserModel
    onSave: (item?: string) => void
    onClose: () => void
}

export const ModalChangeNickname = observer(({ onSave, onClose, item }: IProps) => {

    return <div className="w-full flex-none flex flex-col items-center">
        <div className=" w-[500px] h-full flex-none bg-white rounded">
            <div className="relative w-full h-14 px-3 flex-none border-b border-gray-200 flex items-center justify-start">
                <span className="text-2xl font-semibold text-gray-700">{"Biệt danh"}</span>
                <div
                    className="absolute right-3 size-9 text-gray-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                        onClose()
                    }}
                >
                    <IconBase icon='close-outline' size={24} />
                </div>
            </div>
            <div className="w-full px-3 flex flex-col">
                <div className="w-full h-20 py-2 px-3 border-gray-200 flex items-center">
                    <input
                        value={item.nickname || ""}

                        onChange={(e) => {
                            item.nickname = e.target.value
                        }}
                        placeholder={item.fullname || "Nhập biệt danh"}
                        className="w-full h-full border rounded border-gray-200 focus-within:border-blue-600 outline-none px-3 text-base text-gray-700"
                        type="text"
                    />
                </div>
            </div>
            <div className="w-full h-14 flex-none px-3 border-t border-gray-200 flex items-center justify-end space-x-2">
                <ButtonLoading
                    label={"Lưu"}
                    iconLeft="complete"
                    template="ActionBlue"
                    className="h-10 w-full rounded-full flex items-center justify-center text-xl font-medium"
                    onClick={async () => {
                        onSave()
                    }}
                />
            </div>
        </div>

    </div>
})
