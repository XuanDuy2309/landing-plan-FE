import { makeAutoObservable } from "mobx";

export class ChatBotModel {
    id?: number
    message?: string
    isMine?: boolean
    isError?: boolean

    constructor() {
        makeAutoObservable(this)
    }
}
