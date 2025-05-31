import { makeAutoObservable } from "mobx";

export class ChatBotModel {
    id?: number
    reply?: string
    message?: string

    constructor() {
        makeAutoObservable(this)
    }
}
