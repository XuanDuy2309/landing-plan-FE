import { Spin } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { Colors } from "src/assets";
import { MessageModel, MessageType } from "src/core/models";
import { ListMediaContextProvider, useListMediaContext, useManagerConversationContext } from "src/core/modules";
import { ButtonIcon } from "../button-icon";

interface IProps {
    onClose: () => void;
}

export const ModalPreviewMessage = observer(({ onClose }: IProps) => {
    const { selectedId } = useManagerConversationContext();
    return (
        <ListMediaContextProvider id={selectedId}>
            <ListMediaContaner onClose={onClose} />
        </ListMediaContextProvider>
    );
});


const ListMediaContaner = observer(({ onClose }: IProps) => {
    const { data, loading } = useListMediaContext();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for prev, 1 for next

    const handlePrevious = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : data.length - 1));
    };

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev < data.length - 1 ? prev + 1 : 0));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                handlePrevious();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [data.length]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 bg-gradient-to-b from-black/50 to-transparent">
                <div className="text-white text-sm">
                    {!loading && data.length > 0 && `${currentIndex + 1} / ${data.length}`}
                </div>
                <ButtonIcon
                    icon="close-outline"
                    size="small"
                    color={Colors.white}
                    className="hover:bg-gray-700/50 rounded-full p-2"
                    onClick={onClose}
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center relative">
                {!loading && data.length > 0 && (
                    <>
                        <div className="w-full flex items-center justify-center overflow-hidden">
                            <div className={`transform transition-transform duration-300 ease-in-out ${direction === 1 ? 'translate-x-0' : direction === -1 ? '-translate-x-0' : ''
                                }`}>
                                <PreviewMedia item={data[currentIndex]} />
                            </div>
                        </div>

                        {/* Navigation buttons */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
                            <ButtonIcon
                                icon="arrowleft"
                                size="medium"
                                iconSize={'24px'}
                                color={Colors.white}
                                className="hover:bg-gray-700/50 rounded-full p-2 transition-colors duration-200 backdrop-blur-sm bg-black/20"
                                onClick={handlePrevious}
                            />
                            <ButtonIcon
                                icon="arrowright"
                                size="medium"
                                iconSize={'24px'}
                                color={Colors.white}
                                className="hover:bg-gray-700/50 rounded-full p-2 transition-colors duration-200 backdrop-blur-sm bg-black/20"
                                onClick={handleNext}
                            />
                        </div>

                        {/* Thumbnails navigation */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {data.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
                                        ? 'bg-white scale-125'
                                        : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                    onClick={() => {
                                        setDirection(index > currentIndex ? 1 : -1);
                                        setCurrentIndex(index);
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}

                {!loading && data.length === 0 && (
                    <div className="text-white text-center">
                        {"Chưa có hình ảnh nào được gửi"}
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center items-center">
                        <Spin />
                    </div>
                )}
            </div>
        </div>
    );
});


const PreviewMedia = observer(({ item }: { item: MessageModel }) => {
    const isVideo = item.type === MessageType.VIDEO;
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = () => {
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
    }, [item.content]);

    return (
        <div className="max-w-[90vw] max-h-[calc(100vh-8rem)] rounded-lg overflow-hidden relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <Spin />
                </div>
            )}

            {isVideo ? (
                <video
                    src={item.content}
                    className={`max-h-[calc(100vh-8rem)] w-auto transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                    controls
                    autoPlay
                    onLoadedData={handleLoad}
                />
            ) : (
                <img
                    src={item.content}
                    alt=""
                    className={`max-h-[calc(100vh-8rem)] w-auto object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                    onLoad={handleLoad}
                />
            )}
        </div>
    );
});