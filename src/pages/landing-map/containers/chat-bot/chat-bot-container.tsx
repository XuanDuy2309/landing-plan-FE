import { Dropdown } from 'antd';
import { observer } from 'mobx-react';
import { Colors } from 'src/assets';
import { IconBase } from 'src/components';
import { useListChatbotContext } from 'src/core/modules';
import { MessageChatBotContainer } from './message-chat-bot-container';

export const ChatBotContainer = observer(() => {
    const { isOpenDropdown, setOpenDropdown } = useListChatbotContext()

    return (
        <div className='absolute z-[9999] bottom-3 left-3 min-h-0'>
            <Dropdown trigger={['click']} placement='topRight' dropdownRender={() => <MessageChatBotContainer />}
                open={isOpenDropdown}
                onOpenChange={(value) => setOpenDropdown(value)}
            >
                <button
                    // onClick={() => setIsOpen(!isOpen)}
                    className='size-10 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2),0_-1px_0px_rgba(0,0,0,0.02)] active:border border-gray-500'>
                    <IconBase icon='chat-outline' size={20} color={Colors.gray[900]} />
                </button>
            </Dropdown>
        </div>
    )
}
)
