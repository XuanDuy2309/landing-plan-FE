import classNames from 'classnames';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { Colors } from 'src/assets';
import { IconBase } from 'src/components';
import { useManagementLandingPlan } from 'src/core/modules';

export const ToolbarLandingMap = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const { isDraw, setIsDraw } = useManagementLandingPlan()

    return (
        <div className='absolute z-[9999] bottom-0 right-0'>
            <div className="py-3 pr-4 flex flex-col gap-2">
                {isOpen && (
                    <div className="w-10 flex flex-col gap-2 bg-white rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.2),0_-1px_0px_rgba(0,0,0,0.02)]">
                        <button
                            onClick={() => setIsDraw(!isDraw)}
                            className={classNames('size-10 rounded-full  active:border border-gray-500', {
                                "text-blue-400": isDraw,
                                "text-gray-900": !isDraw
                            })}>
                            <IconBase icon='pin-outline' size={20} color={"currentColor"} />
                        </button>
                        <button

                            className='size-10 bg-white rounded-full active:border border-gray-500'>
                            <IconBase icon='more-outline' size={20} color={Colors.gray[900]} />
                        </button>
                        <button

                            className='size-10 bg-white rounded-full active:border border-gray-500'>
                            <IconBase icon='more-outline' size={20} color={Colors.gray[900]} />
                        </button>
                        <button

                            className='size-10 bg-white rounded-full active:border border-gray-500'>
                            <IconBase icon='more-outline' size={20} color={Colors.gray[900]} />
                        </button>
                    </div>
                )}
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