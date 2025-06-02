import classNames from "classnames"
import { useState } from "react"

interface IProps {
    onSave: (muteUntil: number) => void
    onClose: () => void
}

export const ModalSettingConversation = ({ onClose, onSave }: IProps) => {
    const [selectedOption, setSelectedOption] = useState<number>(0)

    const muteOptions = [
        {
            label: "Bật thông báo",
            value: 0,
        },
        {
            label: "1 giờ",
            value: 60 * 60, // 3600 seconds
        },
        {
            label: "8 giờ",
            value: 8 * 60 * 60, // 28800 seconds
        },
        {
            label: "24 giờ",
            value: 24 * 60 * 60, // 86400 seconds
        },
        {
            label: "7 ngày",
            value: 7 * 24 * 60 * 60, // 604800 seconds
        },
        {
            label: "30 ngày",
            value: 30 * 24 * 60 * 60, // 2592000 seconds
        },
        {
            label: "Luôn luôn",
            value: 100 * 365 * 24 * 60 * 60, // 100 years in seconds
        }
    ]

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[400px]">
                <h2 className="text-xl font-semibold mb-4">Tắt thông báo</h2>
                <div className="space-y-3">
                    {muteOptions.map((option) => (
                        <div
                            key={option.value}
                            className={classNames(
                                "w-full p-4 rounded-lg border cursor-pointer transition-colors duration-200",
                                {
                                    "border-blue-500 bg-blue-50": selectedOption === option.value,
                                    "border-gray-200 hover:bg-gray-50": selectedOption !== option.value
                                }
                            )}
                            onClick={() => setSelectedOption(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className={classNames(
                            "px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                        )}
                        onClick={() => onSave(selectedOption)}
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    )
}