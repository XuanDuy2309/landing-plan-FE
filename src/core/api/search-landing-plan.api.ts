import axios from "axios";

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search?';

export const SearchLandingPlanApi = {
    searchInterval: (params: any) => axios.get(NOMINATIM_BASE_URL, {
        params: {
            format: 'json',
            addressdetails: 1,
            polygon_geojson: 1,
            ...params
        }
    })
}