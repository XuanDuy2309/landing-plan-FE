import { observer } from "mobx-react"
import { toast } from "react-toastify"
import { ButtonLoading } from "src/components"
import { useCreateAdminUserContext } from "src/core/modules"
import { useListUserContext } from "src/core/modules/user/context"
import { hideLoading, showLoading } from "src/core/services"

export const FooterCreateAdminUser = observer(() => {
    const { setCreate, itemUpdate, onRefresh, isCreate } = useListUserContext()
    const { onSubmit, onClear, data } = useCreateAdminUserContext()

    const handleSubmit = async () => {
        showLoading()
        let res = await onSubmit();
        // console.log('ok')
        if (res?.Status) {
            onClear();
            onRefresh()
            hideLoading()
            toast.success(res.Message);
            return
        }
        hideLoading()
        toast.error(res?.Message);
    }

    const onClose = () => {
        onClear();
        console.log('onClose', isCreate)
        setCreate(false);
    }

    // useEffect(() => {
    //  hideLoading()
    // })

    return (
        <div className="w-full flex gap-2 justify-end flex-none px-3 h-[52px] items-center border-t border-gray-200">
            <ButtonLoading
                template="ActionBgNone"
                label={"Hủy"}
                size="xs"
                onClick={onClose}
            />
            <ButtonLoading
                template="ActionBlue"
                label={itemUpdate ? "Câp nhật" : "Thêm mới"}
                size="xs"
                iconLeft={itemUpdate ? "complete" : "add-outline"}
                onClick={handleSubmit}
            />
        </div>
    )
}
)
