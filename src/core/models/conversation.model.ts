import { makeAutoObservable } from "mobx"
import { UserModel } from "./user-model"

export const enum Type_Conversation {
    Direct = 'direct',
    Group = 'group'
}

export const enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    FILE = 'file',
    VIDEO = 'video',
    LOCATION = 'location',
    STICKER = 'sticker',
    EMOJI = 'emoji',
    AUDIO_CALL = 'audio_call',
    VIDEO_CALL = 'video_call',
    MENTION = 'mention'
}

export const enum Status_Conversation {
    Send = 'send',
    Edit = 'edited',
    Delete = 'deleted'
}

export class MessageModel {
    id?: number
    conversation_id?: number
    reply_id?: number
    content?: string
    type: MessageType = MessageType.TEXT
    status: Status_Conversation = Status_Conversation.Send
    metadata?: any
    mentions: number[] = []
    is_favorite: 1 | 0 = 0
    created_at?: string
    updated_at?: string
    mentioned_user_ids: number[] = []
    mentioned_users: any = []
    sender_id?: number
    sender_name?: string
    sender_avatar?: string
    is_new: boolean = false
    is_edited: boolean = false
    reply_content?: string
    reply_sender_id?: number
    reply_sender_name?: string
    reply_type?: MessageType

    constructor() {
        makeAutoObservable(this)
    }
}

export class ConversationModel {
    id?: number
    name?: string
    type: Type_Conversation = Type_Conversation.Direct
    avatar?: string
    created_at?: string
    updated_at?: string
    last_message_id?: number
    last_message_time?: number
    last_message: MessageModel = new MessageModel()
    unread_count: number = 0
    members: UserModel[] = []

    constructor() {
        makeAutoObservable(this)
    }
}