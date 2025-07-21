import { Carousel, Descriptions, Modal, Tag } from "antd";
import { ButtonLoading } from "src/components/Button";
import { IconBase } from "src/components/icon-base";
import { formatMoney } from "src/core/base";
import { PostModel, Purpose_Post, Status_Post, Type_Asset_Enum } from "src/core/models";

interface PostDetailModalProps {
    post?: PostModel;
    visible: boolean;
    onClose: () => void;
}

export const PostDetailModal = ({ post, visible, onClose }: PostDetailModalProps) => {
    if (!post) return null;

    const renderStatus = (status: Status_Post) => (
        <Tag color={
            Number(status) === Status_Post.Process ? 'success' :
                Number(status) === Status_Post.Coming_Soon ? 'warning' :
                    'error'
        }>
            {Number(status) === Status_Post.Process ? 'Đã duyệt' :
                Number(status) === Status_Post.Coming_Soon ? 'Chờ duyệt' :
                    'Từ chối'}
        </Tag>
    );

    const renderPurpose = (purpose: Purpose_Post) => (
        <Tag color={
            Number(purpose) === Purpose_Post.For_Sell ? 'green' :
                Number(purpose) === Purpose_Post.For_Rent ? 'blue' :
                    'red'
        }>
            {Number(purpose) === Purpose_Post.For_Sell ? 'Bán' :
                Number(purpose) === Purpose_Post.For_Rent ? 'Cho thuê' :
                    'Đấu giá'}
        </Tag>
    );


    const directionLand = {
        1: { label: 'Bắc', icon: 'user-outline' },
        2: { label: 'Nam', icon: 'user-outline' },
        3: { label: 'Đông', icon: 'user-outline' },
        4: { label: 'Tây', icon: 'user-outline' },
        5: { label: 'Tây Bắc', icon: 'user-outline' },
        6: { label: 'Đông Bắc', icon: 'user-outline' },
        7: { label: 'Tây Nam', icon: 'user-outline' },
        8: { label: 'Đông Nam', icon: 'user-outline' },
    }
    return (
        <Modal
            open={visible}
            footer={null}
            width={800}
            closable={false}
        >
            <div className="w-full h-[600px] bg-white flex-none flex flex-col">
                <div className="relative w-full h-14 px-3 flex-none border-b border-gray-200 flex items-center justify-start">
                    <span className="text-2xl font-semibold text-gray-700">Chi tiết bài viết</span>
                    <div
                        className="absolute right-3 size-9 text-gray-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                            onClose()
                        }}
                    >
                        <IconBase icon='close-outline' size={24} />
                    </div>
                </div>
                <div className="w-full h-full overflow-y-auto flex flex-col p-3">
                    <div className="space-y-6 bg-white w-full h-[600px]">
                        {/* Media */}
                        {post.image_links && post.image_links.length > 0 && (
                            <Carousel autoplay>
                                {post.image_links.map((url, index) => (
                                    <div key={index} className="h-[400px] flex justify-center w-full">
                                        <img src={url} alt="" className="w-full h-full object-contain" />
                                    </div>
                                ))}
                            </Carousel>
                        )}

                        {/* Basic Information */}
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Tiêu đề" span={2}>
                                {post.title}
                            </Descriptions.Item>
                            <Descriptions.Item label="ID">
                                {post.id}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chủ sở hữu">
                                {post.owner_name || post.create_by_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                {renderStatus(post.status)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mục đích">
                                {renderPurpose(post.purpose)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại tài sản">
                                {Type_Asset_Enum[post.type_asset]}
                            </Descriptions.Item>
                            <Descriptions.Item label="Giá">
                                {formatMoney(post.price_for_buy || 0, 1, 'vn')} VNĐ
                            </Descriptions.Item>
                            <Descriptions.Item label="Diện tích">
                                {post.area} m²
                            </Descriptions.Item>
                            <Descriptions.Item label="Kích thước">
                                {post.width && post.height ? `${post.width}m x ${post.height}m` : 'Chưa cập nhật'}
                            </Descriptions.Item>
                        </Descriptions>

                        {/* Description */}
                        <div>
                            <h3 className="font-medium mb-2">Mô tả</h3>
                            <div className="whitespace-pre-wrap">
                                {post.description}
                            </div>
                        </div>

                        {/* Location Information */}
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Địa chỉ" span={2}>
                                {post.address}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tọa độ">
                                {post.lat}, {post.lng}
                            </Descriptions.Item>
                            <Descriptions.Item label="Hướng">
                                {directionLand[post.direction_land].label}
                            </Descriptions.Item>
                        </Descriptions>

                        {/* Property Details */}
                        {post.type_asset !== Type_Asset_Enum.Land && (
                            <Descriptions bordered column={2}>
                                <Descriptions.Item label="Số tầng">
                                    {post.number_floors || 'Chưa cập nhật'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Số phòng ngủ">
                                    {post.number_bedrooms || 'Chưa cập nhật'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Số phòng tắm">
                                    {post.number_bathrooms || 'Chưa cập nhật'}
                                </Descriptions.Item>
                                {post.type_asset === Type_Asset_Enum.Apartment && (
                                    <Descriptions.Item label="Số căn hộ">
                                        {post.room_number || 'Chưa cập nhật'}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        )}
                    </div>
                </div>
                <div className="w-full h-14 flex-none px-3 border-t border-gray-200 flex items-center justify-end space-x-2">
                    <ButtonLoading
                        label="Huỷ bỏ"
                        template="ActionBase"
                        className="h-10 w-32 flex items-center justify-center text-xl font-medium"
                        onClick={() => {
                            onClose()
                        }}
                    />
                    {/* <ButtonLoading
                        label={"Câp nhật"}
                        template="ActionBlue"
                        className="h-10 w-32 flex items-center justify-center text-xl font-medium"
                    onClick={async () => {
                        const res = onSubmit && await onSubmit()
                        if (res?.Status) {
                            toast.success(res.Message)
                            onSave()
                            onRefresh()
                            return
                        }
                        toast.error(res?.Message)
                    }}
                    /> */}
                </div>

            </div>
        </Modal>
    );
};
