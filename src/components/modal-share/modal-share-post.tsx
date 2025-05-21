import { observer } from "mobx-react";
import { toast } from "react-toastify";
import { Colors } from "src/assets";
import { IconBase } from "src/components";
import { PostApi } from "src/core/api";
import { PostModel } from "src/core/models";
import { ButtonIcon } from "../button-icon";

interface IProps {
    post: PostModel;
    onClose: () => void;
}

export const ModalSharePost = observer(({ post, onClose }: IProps) => {
    const handleCopyLink = async () => {
        const postUrl = `${window.location.origin}/post/${post.id}`;
        navigator.clipboard.writeText(postUrl).then(async () => {
            const res = await PostApi.sharePost({ id: post.id })
            if (res.Status) {
                toast.success(res.Message)
            }
            onClose();
        });
    };

    return (
        <div className="w-full flex justify-center">
            <div className="w-[500px] flex flex-col space-y-4 bg-white rounded pb-4">
                <div className="w-full h-12 border-b border-gray-200 px-3 flex items-center justify-between flex-none">
                    <span className="text-lg font-medium text-gray-900">Chia sẻ bài viết của {post.create_by_name}</span>
                    <ButtonIcon icon="close-outline" size={'xxs'} color={Colors.gray[700]} onClick={onClose} />
                </div>
                <div
                    className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={handleCopyLink}
                >
                    <IconBase icon="link" size={24} color={Colors.gray[700]} />
                    <span className="text-base">Sao chép liên kết</span>
                </div>

                <div
                    className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => {
                        const postUrl = `${window.location.origin}/post/${post.id}`;
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
                        onClose();
                    }}
                >
                    <IconBase icon="facebook" size={24} color={Colors.blue[600]} />
                    <span className="text-base">Chia sẻ lên Facebook</span>
                </div>
            </div>
        </div>
    );
});
