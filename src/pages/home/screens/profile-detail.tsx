import { Dropdown, MenuProps } from "antd"
import classNames from "classnames"
import { observer } from "mobx-react"
import moment from "moment"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Colors } from "src/assets"
import { ButtonLoading, IconBase } from "src/components"
import { DetailMemberContextProvider, Type_List, useDetailMemberContext, useManagerConversationContext, useManagerMemberContext } from "src/core/modules"
import { BannerDetailMember } from "../containers/member/banner-detail-member"
import { ListImageDetailMember } from "../containers/member/list-image-detail-member"
import { MemberPostContainer } from "../containers/member/member-post-container"
import { FollowingScreen } from "./following-screen"

export const ProfileDetailScreen = observer(() => {
    const { selectedId } = useManagerMemberContext();
    const { id } = useParams<{ id: string }>();
    if (!id && !selectedId) return (
        <div className="w-full h-full flex items-center justify-center">
            <span>Vui lòng chọn người dùng trên danh sách</span>
        </div>
    )
    return (
        <DetailMemberContextProvider id={Number(id) || selectedId}>
            <ProfileDetail />
        </DetailMemberContextProvider>
    )
})

const ProfileDetail = observer(() => {
    const [activeTab, setActiveTab] = useState(0);
    const { data, loading, isFollow, onFollow, onUnFollow } = useDetailMemberContext();
    const { setSelectedId } = useManagerConversationContext();
    const navigate = useNavigate();
    const dataTabs = [
        {
            label: "Bài viết",
            link: '/home/profile/my_post'
        },
        {
            label: "Hình ảnh",
            link: '/home/profile/image'
        },
        {
            label: "Đang theo dõi",
            link: '/home/following',
        },
        {
            label: "Người theo dõi",
            link: '/home/follower',
        }
    ]

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Tin nhắn',
            onClick: async () => {
                // Navigate to message screen
                navigate('/home/message?user_id=' + data.id, { replace: true });
            },
            icon: <IconBase icon="mesage" size={16} color={'currentColor'} />
        },
        {
            key: '2',
            label: 'Bỏ theo dõi',
            onClick: () => {
                onUnFollow(data.id)
            },
            danger: true,
            icon: <IconBase icon="delete-outline" size={16} color={'currentColor'} />
        }
    ]

    const renderTab = () => {
        switch (activeTab) {
            case 0:
                return <MemberPostContainer id={data.id} key={data.id} />
            case 1:
                return <ListImageDetailMember id={data.id} key={data.id} />
            case 2:
                return <FollowingScreen type={Type_List.Follower} id={data.id} key={Type_List.Follower} />
            case 3:
                return <FollowingScreen type={Type_List.Following} id={data.id} key={Type_List.Following} />
            default:
                return <MemberPostContainer id={data.id} key={data.id} />
        }
    }
    return (
        <div className="w-full h-full flex flex-col items-center relative overflow-y-auto">

            <BannerDetailMember />
            <div className="w-full flex justify-center bg-white">
                <div className="w-full p-3 bg-white border-b border-gray-200 flex flex-col space-x-1 max-w-[1240px]">
                    <span className="text-2xl font-medium text-gray-700">{data.fullname}</span>
                    <div className="w-full flex items-center justify-between">
                        <div className="w-full flex flex-col">
                            <span>{data.dob ? moment(data.dob).format('DD/MM/YYYY') : '--/--/----'}</span>
                            <span>{data.follower_ids ? data.follower_ids.length : 0} Người theo dõi - {data.following_ids ? data.following_ids.length : 0} Đang theo dõi</span>
                        </div>
                        {
                            isFollow ?
                                <Dropdown trigger={["click"]} menu={{ items }}>
                                    <div className="px-3 h-9 flex-none flex items-center justify-center bg-gray-200 rounded cursor-pointer hover:bg-gray-300">
                                        <IconBase icon={"more"} size={16} color={Colors.gray[900]} />
                                    </div>
                                </Dropdown>

                                :
                                <ButtonLoading label="Theo dõi" template="ActionBlue" size="xs" onClick={() => {
                                    onFollow(data.id)
                                }} className="flex-none"
                                    loading={loading}
                                />
                        }
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center bg-white  sticky top-0 z-10">
                <div className="w-full flex items-center justify-start space-x-3 max-w-[1240px] px-3">
                    {dataTabs.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={classNames("px-4 h-13 flex flex-col items-center justify-center space-y-0.5 cursor-pointer text-[14px] font-medium",
                                    { 'text-blue-600 border-b-2 border-blue-600': activeTab === index },
                                    { 'text-gray-600 rounded hover:bg-gray-200': activeTab !== index }
                                )}
                                onClick={(e) => {
                                    setActiveTab(index);
                                }}
                            >
                                <span>{item.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="w-full h-full flex flex-col">
                {renderTab()}
            </div>
        </div>
    );
})