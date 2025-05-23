import { observer } from "mobx-react"
import { toast } from "react-toastify"
import { ButtonLoading, IconBase } from "src/components"
import { CreateConversationContextProvider, Type_List, useCreateConversationContext, useListConversationContext } from "src/core/modules"
import { ListUserSelectedContainer } from "../member/list-user-selected"
interface IProps {
    onSave: (item?: string) => void
    onClose: () => void
}

export const ModalCreateConversation = observer(({ onSave, onClose }: IProps) => {
    return <CreateConversationContextProvider>
        <CreateConversationContainer onSave={onSave} onClose={onClose} />
    </CreateConversationContextProvider>
})

const CreateConversationContainer = observer(({ onSave, onClose }: IProps) => {
    const { data, onSubmit, onClear } = useCreateConversationContext()
    const { onRefresh } = useListConversationContext()


    return <div className="w-full h-[600px] flex-none flex flex-col items-center">
        <div className=" w-[500px] h-full flex-none bg-white rounded">
            <div className="relative w-full h-14 px-3 flex-none border-b border-gray-200 flex items-center justify-start">
                <span className="text-2xl font-semibold text-gray-700">Thêm đoạn chat mới</span>
                <div
                    className="absolute right-3 size-9 text-gray-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                        onClose()
                        onClear()
                    }}
                >
                    <IconBase icon='close-outline' size={24} />
                </div>
            </div>
            <div className="w-full h-[488px] flex flex-col">
                <ListUserSelectedContainer type={Type_List.User} title="Tìm kiếm người dùng" />
            </div>
            <div className="w-full h-14 flex-none px-3 border-t border-gray-200 flex items-center justify-end space-x-2">
                <ButtonLoading
                    label="Tạo"
                    template="ActionBlue"
                    className="h-10 w-full rounded-full flex items-center justify-center text-xl font-medium"
                    onClick={async () => {
                        const res = await onSubmit()
                        if (res.Status) {
                            toast.success(res.Message)
                            onSave()
                            onRefresh()
                            return
                        }
                        toast.error(res.Message)
                    }}
                />
            </div>
        </div>

    </div>
})
