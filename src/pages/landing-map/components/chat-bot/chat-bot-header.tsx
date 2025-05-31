import { observer } from 'mobx-react'

export const ChatBotHeader = observer(() => {
    return (
        <div className='h-[52px] border-b border-gray-100 flex items-center gap-2 px-2 flex-none'>
            <div className='size-10'>
                <img src="/images/logo-landing-plan.png" alt="" className="h-full object-contain bg-blue-300 rounded" />
            </div>
            {/* <span className='text-gray-700 font-medium'>Support</span> */}
        </div>
    )
})
