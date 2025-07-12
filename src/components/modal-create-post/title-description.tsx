import { observer } from "mobx-react"
import { useCreatePostContext } from "src/core/modules"

export const TitleDescription = observer(() => {
    const { data } = useCreatePostContext()
    return <div className="w-full flex flex-col space-y-2 px-3">
        <span className="text-xl font-medium text-gray-900">Tiêu đề & mô tả:</span>
        <div className="flex flex-col space-y-1">
            <div className="w-full flex flex-col space-y-0.5">
                <span>Tiêu đề:</span>
                <input type="text"
                    className="outline-none w-full rounded border px-2 py-1 border-gray-200"
                    value={data.title || ""}
                    onChange={(e) => {
                        data.title = e.target.value
                    }}
                    placeholder="Nhập tiêu đề ngắn gọn cho bài đăng"
                />
                {data.err_title && <span className="text-sm text-red-400">{data.err_title}</span>}
            </div>
            <div className="w-full flex flex-col space-y-0.5">
                <span>Tiện ích, mô tả BĐS:</span>
                <textarea
                    className="outline-none w-full h-24 rounded border px-2 py-1 border-gray-200"
                    value={data.description || ""}
                    onChange={(e) => {
                        data.description = e.target.value
                    }}
                    placeholder="Hãy mô tả đôi chút về tiện ích, BĐS của bạn"
                />
            </div>
        </div>
    </div>
})
