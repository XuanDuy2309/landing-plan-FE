import { server } from "../config";

export const LocationApi = {
    getListProvince: (params) => server.get('/province',params),
    getListDistrict: (params) => server.get('/district/'+params.id,params),
    getListWard: (params) => server.get('/ward/'+params.id,params),
}