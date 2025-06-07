import { makeAutoObservable } from "mobx"

export class LandingTypeModel {
    id?: number
    name?: string
    code?: string
    color?: string

    constructor() {
        makeAutoObservable(this)
    }
}
