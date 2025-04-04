import axios from "axios";
import { server } from "../config";

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search?';
const NOMINATIM_REVERSE_BASE_URL = 'https://nominatim.openstreetmap.org/reverse?'

export const SearchLandingPlanApi = {
    searchInterval: (params: any) => axios.get(NOMINATIM_BASE_URL, {
        params: {
            format: 'json',
            addressdetails: 1,
            polygon_geojson: 1,
            ...params
        }
    }),
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