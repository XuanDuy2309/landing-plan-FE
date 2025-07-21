import { Slider } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import { Collapse } from 'react-collapse';
import { Colors } from 'src/assets';
import { IconBase } from 'src/components';
import { ModalChangeLandType } from 'src/components/modal-note-planing-map/modal-change-land-type-container';
import { ModalNoteLandingMap } from 'src/components/modal-note-planing-map/modal-note-planing-map-container';
import { ChatBotModel } from 'src/core/models/chat-bot-model';
import { useListChatbotContext, useManagementLandingPlan } from 'src/core/modules';
import { ToolbarButton } from './button-toolbar-landing-map';

export const ToolbarLandingMap = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const { pointsArea, opacity, setOpacity, landingPlanMap } = useManagementLandingPlan()
    const { message, setOpenDropdown, data, handleSendMessage, isOpenDropdown } = useListChatbotContext()
    const modalNoteLandingRef = useRef<any>(null);
    const modalChangeLandTypeRef = useRef<any>(null);
    const toggleDrawMode = (changeLandType: boolean) => {
        const willEnable = !(pointsArea.isDraw && pointsArea.changeLandType === changeLandType);

        // Tắt nếu đang bật đúng mode
        if (!willEnable) {
            pointsArea.isDraw = false;
            pointsArea.changeLandType = false;
            return;
        }

        // Bật mode tương ứng
        pointsArea.points = [];
        pointsArea.area = 0;
        pointsArea.isDraw = true;
        pointsArea.changeLandType = changeLandType;
    };

    const handleToggleDraw = () => toggleDrawMode(false);
    const handleToggleChange = () => toggleDrawMode(true);

    const handleReset = () => {
        pointsArea.reset();
    };

    const handleGoToMyLocation = () => {
        const event = new CustomEvent('go-to-current-location');
        window.dispatchEvent(event);
    };

    const handleToggleRouting = () => {
        pointsArea.isRouting = !pointsArea.isRouting
        if (pointsArea.isRouting) {
            pointsArea.routeTo = undefined
        }
    }

    const buttons = [
        { onClick: handleToggleDraw, icon: 'pin-outline', title: 'Đo đạc khu vực', active: (pointsArea.isDraw && !pointsArea.changeLandType) },
        { onClick: handleToggleChange, icon: 'change-outline', title: 'Chuyển đổi loại đất', active: (pointsArea.isDraw && pointsArea.changeLandType) },
        { onClick: handleReset, icon: 'delete-outline', title: 'Đặt lại khu vực', active: false },
        { onClick: handleToggleRouting, icon: 'location-outline', title: 'Chỉ đường', active: pointsArea.isRouting },
        { onClick: handleGoToMyLocation, icon: 'map-outline1', title: 'Định vị', active: false },
        { onClick: () => modalNoteLandingRef.current?.open(), icon: 'note-outline', title: 'Kí hiệu bản đồ quy hoạch', active: false },
    ];

    useEffect(() => {
        if (!pointsArea.isDraw && pointsArea.changeLandType) {
            modalChangeLandTypeRef.current?.open()
        }
    }, [pointsArea.isDraw, pointsArea.changeLandType])


    return (
        <>
            {landingPlanMap && <div className='h-[120px] pb-2 absolute z-[9999] top-20 right-3'>
                <Slider vertical defaultValue={100} step={2} onChange={(value) => { setOpacity(value / 100) }} value={opacity * 100} />
            </div>}
            <div className='absolute z-[9999] bottom-3 right-3'>
                <div className="flex flex-col bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2),0_-1px_0px_rgba(0,0,0,0.02)]">

                    <Collapse isOpened={isOpen}>
                        <div className="w-10 flex flex-col gap-2 bg-white rounded-2xl ">
                            {buttons.map((btn, index) => (
                                <ToolbarButton
                                    key={index}
                                    onClick={btn.onClick}
                                    icon={btn.icon}
                                    title={btn.title}
                                    active={btn.active}
                                />
                            ))}
                        </div>
                    </Collapse>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className='size-10 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2),0_-1px_0px_rgba(0,0,0,0.02)] active:border border-gray-500'>
                        <IconBase icon='more-outline' size={20} color={Colors.gray[900]} />
                    </button>
                </div>
            </div>

            <ModalNoteLandingMap
                ref={modalNoteLandingRef}
                onCancel={() => modalNoteLandingRef.current?.close()}
                centered
                onClickDropdown={async (text) => {
                    const temp = new ChatBotModel()
                    temp.message = text
                    temp.isMine = true
                    data.push(temp)
                    Object.assign(message, new ChatBotModel())
                    if (!isOpenDropdown) setOpenDropdown(true)
                    const res = await handleSendMessage(temp)
                    if (res.Status) {
                    }
                }}
            />

            <ModalChangeLandType
                ref={modalChangeLandTypeRef}
                onCancel={() => modalChangeLandTypeRef.current?.close()}
                centered
            />
        </>
    )
}
)
