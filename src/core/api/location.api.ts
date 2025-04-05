import { server } from "../config";

export const LocationApi = {
    getListProvince: (params) => server.get('/province',params),
    getListDistrict: (id,params) => server.get('/district/'+id,params),
    getListWard: (id,params) => server.get('/ward/'+id,params),
}