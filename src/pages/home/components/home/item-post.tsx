import { Dropdown, MenuProps } from "antd";
import classNames from "classnames";
import { observer } from "mobx-react";
import moment from "moment";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Colors } from "src/assets";
import { IconBase, ModalBase } from "src/components";
import { ButtonIcon } from "src/components/button-icon";
import { ModalSharePost } from "src/components/modal-share/modal-share-post";
import { formatMoney, getColorFromId } from "src/core/base";
import { PostModel, Purpose_Post } from "src/core/models";
import { useUserContext } from "src/core/modules";
import { ItemMyImage } from "../item-my-image";

interface IProps {
    item: PostModel
    onLike: (id: number) => void
    onUnlike: (id: number) => void
}

export const ItemPost = observer(({ item, onLike, onUnlike }: IProps) => {
    const navigate = useNavigate();
    const { data: user } = useUserContext();
    const shareModalRef = useRef<any>(null);

    const renderPurpose = {
        1: { label: "Bán", color: Colors.green[400] },
        2: { label: "Cho thuê", color: Colors.blue[400] },
        3: { label: "Đấu giá", color: Colors.red[400] },
    }

    let listOption: MenuProps['items'] = [
        {
            key: '1',
            label: 'Chi tiết',
            onClick: () => {
                navigate(`/post/${item.id}`);
            },
        },

        ...(item.purpose === Purpose_Post.For_Auction
            ? [{
                key: '2',
                label: 'Đấu giá ngay',
                onClick: () => {
                    navigate(`/auction/${item.id}`);
                },
            }]
            : []
        ),
        {
            key: '3',
            label: 'Liên hệ ngay',
            onClick: () => {
            },
        },
        ...(item.create_by_id === user?.id
            ? [{
                key: '5',
                label: 'Xóa bài viết',
                onClick: () => {
                    navigate(`/home/edit-post/${item.id}`);
                },
                danger: true,
            }]
            : []
        )
    ]

    const renderUnit = () => {
        if (item.purpose === Purpose_Post.For_Sell) {
            return 'VNĐ'
        }
        if (item.purpose === Purpose_Post.For_Rent) {
            return 'VNĐ/Tháng'
        }
        if (item.purpose === Purpose_Post.For_Auction) {
            return 'VNĐ'
        }
        return 'VNĐ'
    }

    const renderPrice = () => {
        if (item.purpose === Purpose_Post.For_Sell) {
            return item.price_for_buy
        }
        if (item.purpose === Purpose_Post.For_Rent) {
            return item.price_for_rent
        }
        if (item.purpose === Purpose_Post.For_Auction) {
            return item.price_start
        }
        return item.price_current
    }


    const getGridClass = () => {
        switch (item.image_links.length) {
            case 1:
                return 'grid-cols-1';
            case 2:
                return 'grid-cols-2';
            default:
                return 'grid-cols-3 grid-rows-2';
        }
    };
    return (
        <div className="w-full p-3 flex flex-col bg-white rounded-xl space-y-2">
            <div className="w-full flex items-center space-x-2 border-gray-200 relative">
                <div className='size-10 flex-none rounded-full flex items-center bg-gray-200 justify-center overflow-hidden cursor-pointer hover:opacity-80'
                    onClick={() => {
                        navigate(`/home/profile/${item.create_by_id}`)
                    }}
                    style={{
                        backgroundColor: getColorFromId(item.create_by_id || 0)
                    }}
                >
                    {
                        item && item.create_by_avatar ?
                            <img src={item.create_by_avatar} alt="" className="size-full object-cover" />
                            :
                            <span className="text-2xl font-bold text-white">{item?.create_by_name?.charAt(0).toUpperCase()}</span>

                    }
                </div>
                <div className="w-full flex-col flex"
                    onClick={() => {
                    }}
                >
                    <span className="text-base font-medium text-gray-900">{item.create_by_name}</span>
                    <span>{item.create_at ? moment(item.create_at).format('HH:mm DD/MM/YYYY') : '--/--/----'}</span>
                </div>
                <Dropdown trigger={["click"]} menu={{ items: listOption }}>
                    <div><ButtonIcon icon="more" size={'xxs'} color={Colors.gray[700]} /></div>
                </Dropdown>
            </div>
            <div className="w-full flex items-center space-x-2">
                <span className="text-sm font-medium px-2 py-1 rounded-full flex-none text-white"
                    style={{ backgroundColor: renderPurpose[item.purpose].color }}
                >{renderPurpose[item.purpose].label}</span>
                <span className="text-gray-900 font-bold text-base">{item.title}</span>
            </div>
            <div className="w-full flex items-center space-x-1 flex-wrap">
                <div className=" flex items-center space-x-2">
                    <IconBase icon='location-outline' size={16} color={Colors.gray[700]} />
                    <span>{item.address}</span>
                </div>
                <span>-</span>
                <span>{formatMoney(renderPrice(), 1, 'vn')} {renderUnit()}</span>
                <span>-</span>
                <span>{item.area} m²</span>
            </div>

            <div className={`relative overflow-hidden h-[412px] grid gap-2 ${getGridClass()}`}>
                {item.image_links && item.image_links.slice(0, 3).map((it, index) => {
                    return (
                        <div
                            key={index}
                            className={classNames('relative size-full', {
                                'row-span-2 col-span-2': item.image_links.length > 2 && index == 0,
                            })}
                        >
                            <ItemMyImage key={index} item={it} action={undefined} />
                        </div>
                    )
                })}
            </div>
            <div className="w-full flex items-center justify-end px-3">
                <span>{item.like_by_ids?.length} người thích - {item.share_count} lượt chia sẻ</span>
            </div>
            <div className="w-full flex items-center border-t space-x-2 border-gray-200 pt-3">
                <div className={classNames("w-full h-10 flex items-center justify-center space-x-2 rounded hover:bg-gray-200 cursor-pointer",
                    { 'text-gray-700': !item.like_by_ids?.includes(user.id || 0) },
                    { 'text-blue-800': item.like_by_ids?.includes(user.id || 0) }
                )}
                    onClick={() => {
                        if (item.like_by_ids?.includes(user.id || 0)) {
                            item.like_by_ids = item.like_by_ids.filter((id: number) => id !== user.id);
                            onUnlike(item.id || 0);
                        }
                        else {
                            onLike(item.id || 0);
                            item.like_by_ids.push(user.id || 0);
                        }
                    }}
                >
                    <IconBase
                        icon={item.like_by_ids.includes(user.id || 0) ? 'like' : 'like-outline'}
                        size={20}
                        color={!item.like_by_ids.includes(user.id || 0) ? Colors.gray[700] : Colors.blue[600]} />
                    <span>Thích</span>
                </div>
                <div
                    className="w-full h-10 flex items-center justify-center space-x-2 rounded hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                        shareModalRef.current?.open();
                    }}
                >
                    <IconBase icon='share-outline' size={20} color={Colors.gray[700]} />
                    <span>Chia sẻ</span>
                </div>
            </div>

            <ModalBase
                ref={shareModalRef}
            >
                <ModalSharePost
                    post={item}
                    onClose={() => shareModalRef.current?.close()}
                />
            </ModalBase>
        </div>
    );
})
