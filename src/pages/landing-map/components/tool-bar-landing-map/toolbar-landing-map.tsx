import classNames from 'classnames';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { Colors } from 'src/assets';
import { IconBase } from 'src/components';
import { useManagementLandingPlan } from 'src/core/modules';
import { Collapse } from 'react-collapse';
import { point } from 'leaflet';
import { ToolbarButton } from './button-toolbar-landing-map';
import { Tooltip } from 'antd';

export const ToolbarLandingMap = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const { pointsArea } = useManagementLandingPlan()

    const handleToggleDraw = () => {
        pointsArea.isDraw = !pointsArea.isDraw;
        if (pointsArea.isDraw) {
            pointsArea.points = [];
            pointsArea.area = 0;
            pointsArea.isDraw = true;
        }
    };
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
            pointsArea.routeTo = [0, 0]
        }
    }

    const buttons = [
        { onClick: handleToggleDraw, icon: 'pin-outline', title: 'Đo đạc khu vực', active: pointsArea.isDraw },
        { onClick: handleReset, icon: 'delete-outline', title: 'Đặt lại khu vực', active: false },
        { onClick: handleToggleRouting, icon: 'location-outline', title: 'Chỉ đường', active: pointsArea.isRouting },
        { onClick: handleGoToMyLocation, icon: 'map-outline1', title: 'Định vị', active: false },
    ];


    return (
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
    )
}
)