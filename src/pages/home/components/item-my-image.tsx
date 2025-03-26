import { Dropdown, MenuProps } from "antd";
import classNames from "classnames";
import { observer } from "mobx-react";
import { Colors } from "src/assets";
import { IconBase } from "src/components";

interface IProps {
    item: any
    action: any
}

export const ItemMyImage = observer(({ item, action }: IProps) => {
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Xóa',
            onClick: () => {
                action.deleteImage(item.id)
            }
        },
        {
            key: '2',
            label: 'Đặt làm avatar',
            onClick: () => {
                action.updateAvatar(item.image_link)
            }
        },
        {
            key: '3',
            label: 'Đặt làm background',
            onClick: () => {
                action.updateBackground(item.image_link)
            }
        },
    ]
    return (
        <div className={classNames("size-full rounded-md overflow-hidden relative cursor-pointer flex-none",
        )} >
            <img src={item.image_link} alt="" className="w-full h-full object-cover" />
            <Dropdown menu={{ items }} trigger={["click"]}>
                <div className="absolute top-3 right-3 rounded-full p-1 flex items-center justify-center bg-gray-100 hover:bg-gray-300">
                    <IconBase icon={"more-2"} size={24} color={Colors.blue[400]} />
                </div>
            </Dropdown>
        </div>)
})