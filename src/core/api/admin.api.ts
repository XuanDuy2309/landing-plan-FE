import { server } from "../config";

export const AdminApi = {
    getDashboardSumary: (params) => server.get("/dashboard-sumary", params)
}