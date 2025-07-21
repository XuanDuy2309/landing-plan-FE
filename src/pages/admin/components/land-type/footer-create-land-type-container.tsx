import { observer } from "mobx-react"
import { toast } from "react-toastify"
import { ButtonLoading } from "src/components"
import { useCreateLandTypeContext, useListLandTypeContext } from "src/core/modules"
import { hideLoading, showLoading } from "src/core/services"

export const FooterLandTypeContainer = observer(() => {
    const { setCreate, itemUpdate, onRefresh, isCreate } = useListLandTypeContext()
    const { onSubmit, onClear, data } = useCreateLandTypeContext()

    const handleSubmit = async () => {
        showLoading()
        let res = await onSubmit();
        // console.log('ok')
        if (res?.Status) {
            onClose();
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
