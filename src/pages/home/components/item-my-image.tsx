import { Dropdown, MenuProps } from "antd";
import classNames from "classnames";
import { observer } from "mobx-react";
import { Colors } from "src/assets";
import { IconBase } from "src/components";

interface IProps {
    item: any
    action?: any
    type?: string
}

export const ItemMyImage = observer(({ item, action, type }: IProps) => {
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Xóa',
            onClick: () => {
                action.deleteImage()
            }
        },
        {
            key: '2',
            label: 'Đặt làm avatar',
            onClick: () => {
                action.updateAvatar(item)
            }
        },
        {
            key: '3',
            label: 'Đặt làm background',
            onClick: () => {
                action.updateBackground(item)
            }
        },
    ]
    if (type === 'video') {
        return (
            <div className={classNames("size-full rounded-md overflow-hidden relative cursor-pointer flex-none",
            )} >
                <video src={item} className="w-full h-full object-cover" controls />
                {action &&
                    <div className="absolute top-3 right-3 rounded-full p-1 flex items-center justify-center bg-gray-100 hover:bg-gray-300">
                        <IconBase icon={"more-2"} size={24} color={Colors.blue[400]} />
                    </div>
                }
            </div>
        )
    }
    return (
        <div className={classNames("size-full rounded-md overflow-hidden relative cursor-pointer flex-none",
        )} >
            <img src={item} alt="" className="w-full h-full object-cover" loading="lazy" />
            {action && <Dropdown menu={{ items }} trigger={["click"]}>
                <div className="absolute top-3 right-3 rounded-full p-1 flex items-center justify-center bg-gray-100 hover:bg-gray-300">
                    <IconBase icon={"more-2"} size={24} color={Colors.blue[400]} />
                </div>
            </Dropdown>}
        </div>)
})