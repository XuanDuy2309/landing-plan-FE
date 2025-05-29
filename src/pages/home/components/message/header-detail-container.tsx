import dayjs from "dayjs"
import { observer } from "mobx-react"
import { Colors } from "src/assets"
import { ButtonIcon } from "src/components/button-icon"
import { getColorFromId } from "src/core/base"
import { useDetailConversationContext } from "src/core/modules"

export const HeaderDetailContainer = observer(() => {
    const { data, showDetail, setShowDetail } = useDetailConversationContext()
    return (
        <div className="w-full flex items-center justify-between bg-white shadow-md border-b border-gray-200">
            <div className="w-full h-14 flex items-center px-3  space-x-4">
                <div className='size-10 rounded-full flex items-center justify-center overflow-hidden '
                    style={{
                        backgroundColor: getColorFromId(data.id || 0)
                    }}
                >

                    <span className="text-2xl font-bold text-white" >{data.name?.charAt(0).toUpperCase()}</span>


                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-medium text-gray-700">{data.name}</span>
                    {data.updated_at && <span className="text-xs text-gray-500">{data.updated_at ? dayjs(data.updated_at).fromNow() : ''}</span>}
                </div>

            </div>
            {!showDetail && <ButtonIcon icon={'more-2'} iconSize="24" color={Colors.gray[500]} onClick={() => {
                setShowDetail(!showDetail)
            }} className="mr-4" />}
        </div>
    )
})
