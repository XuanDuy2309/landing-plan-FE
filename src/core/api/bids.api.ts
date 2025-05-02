import { server } from "../config";

export const BidsApi = {
    getBids: (params) => server.get("/bids/"+params.id),
    createBid: (params) => server.post("/bids", params),
}