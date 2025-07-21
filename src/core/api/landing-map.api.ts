import { server } from "../config";

export const LandingMapApi = {
    getLandingPlan: (params) => server.get("/landing-map", params),
    detectLandType: (params) => server.post("/landing-plan/detect-land-type", params),
    getListMaps: (params) => server.get("/landing-plan/list", params),

    //land type
    getListLandType: (params?: any) => server.get('/landing-plan/type', params),
    createLandType: (params?: any) => server.post('/landing-plan/type', params),
    updateLandType: (id: number, params?: any) => server.put('/landing-plan/type/' + id, params),
    deleteLandType: (params?: any) => server.delete('/landing-plan/type/' + params.id),

    //land type change
    getListLandTypeChange: (params?: any) => server.get('/landing-plan/change-list', params),
    createLandTypeChange: (params?: any) => server.post('/landing-plan/change', params),
    updateLandTypeChange: (id: number, params?: any) => server.put('/landing-plan/change/' + id, params),
    deleteLandTypeChange: (params?: any) => server.delete('/landing-plan/change/' + params.id),
    getListLandTypeChangeByLatLon: (params?: any) => server.get('/landing-plan/change', params),
}
