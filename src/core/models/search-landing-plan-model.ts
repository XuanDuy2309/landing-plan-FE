import * as turf from '@turf/turf';
import { makeAutoObservable } from "mobx";

export class SearchLandingPlanModel {

    constructor() {
        makeAutoObservable(this)
    }
}

export class NominatimResult {
    place_id?: number | string;
    licence?: string;
    osm_type?: "node" | "way" | "relation";
    osm_id?: number;
    lat?: string;  // Vĩ độ
    lon?: string;  // Kinh độ
    display_name?: string; // Địa chỉ đầy đủ
    class?: string; // Loại đối tượng (ví dụ?: "place", "highway")
    type?: string; // Loại cụ thể hơn (ví dụ?: "city", "residential")
    importance?: number;
    address?: AddressNominationModel
    boundingbox?: [string, string, string, string]; // [lat_min, lat_max, lon_min, lon_max]
    geojson?: {
        type: any;
        coordinates: any;
    }
    isVietMapSearch?: boolean = false
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

export class CoordinateSearchLocationModel {
    id?: number
    points?: any
    owner_name?: string
    content?: string
    area?: number
    address?: AddressNominationModel
    display_name?: string
    name?: string
    constructor() {
        makeAutoObservable(this)
    }
}

export class AddressNominationModel {
    house_number?: string;
    road?: string;
    quarter?: string;
    suburb?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
    postcode?: string;

    constructor() {
        makeAutoObservable(this)
    }
}

export class PointsMapModel {
    points: [number, number][] = [];
    area: number = 0;
    isDraw: boolean = false;
    segmentLengths: number[] = [];
    areaLabelPosition: [number, number] | null = null;
    currentMousePos?: L.LatLng
    isRouting?: boolean
    routeTo?: [number, number];

    constructor() {
        makeAutoObservable(this);
    }

    addPoint = (lngLat: [number, number], isMarkerClick?: boolean) => {
        if (!this.isDraw) {
            this.reset();
        }

        const last = this.points[this.points.length - 1];
        this.points.push(lngLat);

        // Nếu có điểm trước đó, tính chiều dài đoạn đường từ điểm trước đó đến điểm hiện tại
        if (last) {
            const dist = turf.distance(
                turf.point([last[0], last[1]]),  // Longtitude, Latitude
                turf.point([lngLat[0], lngLat[1]]), // Longtitude, Latitude
                // { units: "meters" } // Đơn vị là mét
            );
            this.segmentLengths.push(dist); // Thêm chiều dài đoạn vào mảng segmentLengths
        }

        // Nếu có ít nhất 3 điểm, kiểm tra xem có cần đóng polygon không
        if (this.points.length >= 3) {
            const first = this.points[0];
            const dist = turf.distance(
                turf.point([first[0], first[1]]),  // Longtitude, Latitude
                turf.point([lngLat[0], lngLat[1]])  // Longtitude, Latitude
            );
            if (dist < 0.001 || isMarkerClick) { // Nếu khoảng cách giữa điểm cuối và điểm đầu nhỏ hơn 10m
                this.isDraw = false;
                this.points[this.points.length - 1] = first;
                this.segmentLengths[this.segmentLengths.length - 1] = turf.distance(
                    turf.point([last[0], last[1]]),
                    turf.point([first[0], first[1]]),
                    // { units: "meters" }
                );

                // Tính diện tích của polygon
                const polygon = turf.polygon([this.points.concat([this.points[0]])]);
                this.area = turf.area(polygon); // Diện tích polygon

                // Tính vị trí của nhãn diện tích
                const center = turf.centerOfMass(polygon).geometry.coordinates;
                this.areaLabelPosition = [center[1], center[0]]; // [lat, lng]
            }
        }
    }

    reset = () => {
        this.points = [];
        this.area = 0;
        this.isDraw = false;
        this.segmentLengths = []; // Reset lại chiều dài các đoạn
        this.isRouting = false
        this.routeTo = undefined
    };

    calculateDistance = () => {
        if (this.points.length === 0) return 0
        return turf.distance(
            turf.point([this.points[this.points.length - 1][0], this.points[this.points.length - 1][1]]),
            turf.point([this.currentMousePos?.lng || 0, this.currentMousePos?.lat || 0]),
            { units: "meters" }
        );
    }
}

export class LandingPlanModel {
    id?: number
    name?: string
    description?: string
    folder_path?: string
    bounds: number[][] = []
    province_id?: number
    district_id?: number
    ward_id?: number
    created_at?: string

    constructor() {
        makeAutoObservable(this)
    }
}
