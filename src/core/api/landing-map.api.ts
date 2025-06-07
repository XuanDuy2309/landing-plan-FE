import { server } from "../config";

export const LandingMapApi = {
    getLandingPlan: (params) => server.get("/landing-map", params),
}
