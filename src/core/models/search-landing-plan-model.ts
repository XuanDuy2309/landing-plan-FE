import { makeAutoObservable } from "mobx";

export class SearchLandingPlanModel {

    constructor() {
        makeAutoObservable(this)
    }
}

export class NominatimResult {
    place_id?: number;
    licence?: string;
    osm_type?: "node" | "way" | "relation";
    osm_id?: number;
    lat?: string;  // Vĩ độ
    lon?: string;  // Kinh độ
    display_name?: string; // Địa chỉ đầy đủ
    class?: string; // Loại đối tượng (ví dụ?: "place", "highway")
    type?: string; // Loại cụ thể hơn (ví dụ?: "city", "residential")
    importance?: number;
    address?: {
        house_number?: string;
        road?: string;
        neighbourhood?: string;
        suburb?: string;
        city?: string;
        town?: string;
        village?: string;
        county?: string;
        state?: string;
        country?: string;
        country_code?: string;
        postcode?: string;
    };
    boundingbox?: [string, string, string, string]; // [lat_min, lat_max, lon_min, lon_max]
    geojson?: {
        type: any;
        coordinates: any;
    }
    constructor() {
        makeAutoObservable(this)
    }
}

export class SelectedLocationModel {
    lat?: number
    lng?: number

    constructor() {
        makeAutoObservable(this)
    }
}
