import { makeAutoObservable } from "mobx"
import { Status } from "./user-model"

export class LandTypeChangeModel {
    id?: number
    name?: string
    bounds: number[][] = []
    condinates?: string
    land_type_id?: number
    status: Status = Status.active
    land_type_name?: string
    land_type_code?: string
    land_type_color?: string
    created_at?: string
    last_updated_at?: string
    created_by_id?: number
    create_by_name?: string

    err_condinates?: string
    err_land_type_id?: string
    constructor() {
        makeAutoObservable(this)
    }
}