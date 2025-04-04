import axios from "axios";
import { server } from "../config";

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search?';
const url = 'https://nominatim.openstreetmap.org/reverse?lat=21.15151559584013&lon=105.75422286987306&format=json'

export const SearchLandingPlanApi = {
    searchInterval: (params: any) => axios.get(NOMINATIM_BASE_URL, {
        params: {
            format: 'json',
            addressdetails: 1,
            polygon_geojson: 1,
            ...params
        }
    }),

    getInfoLandingPlan: ([lat, lon]) => axios.get(url, {
        params: {
            format: 'json',
            lat: lat,
            lon: lon,
        }
    })
}

export const SearchLandingPlanReverseApi = {
    searchInterval: (params: any) => axios.get(NOMINATIM_REVERSE_BASE_URL, {
        params: {
            format: 'json',
            addressdetails: 1,
            polygon_geojson: 1,
            ...params
        }
    })
}

export const LandingPlanApi = {
    searchCoordinatesLocation: (params) => server.get("/landing-plan/coordinates", params)
}