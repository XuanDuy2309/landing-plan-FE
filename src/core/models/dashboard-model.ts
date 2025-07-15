import { makeAutoObservable } from "mobx"

export class DashboardSumaryModel {
    number_auction?: number
    number_new_post?: number
    number_user?: number
    constructor() {
        makeAutoObservable(this)
    }
}