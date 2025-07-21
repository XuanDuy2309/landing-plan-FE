import { makeAutoObservable } from "mobx"

export class LandingTypeModel {
    id?: number
    name?: string
    code?: string
    color?: string

    err_name?: string
    err_code?: string
    err_color?: string

    constructor() {
        makeAutoObservable(this)
    }
}
