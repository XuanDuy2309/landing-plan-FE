import { server } from "../config";

export const LandingMapApi = {
    getLandingPlan: (params) => server.get("/landing-map", params),
    detectLandType: (params) => server.post("/landing-plan/detect-land-type", params),
    getListMaps: (params) => server.get("/landing-plan/list", params)
}
