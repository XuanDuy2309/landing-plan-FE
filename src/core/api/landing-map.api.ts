import { server } from "../config";

export const LandingMapApi = {
    getLandingPlan: (params) => server.get("/landing-map", params),
    detectLandType: (params) => server.post("/landing-plan/detect-land-type", params),
}
