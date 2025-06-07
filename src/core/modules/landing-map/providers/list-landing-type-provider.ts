import { PostApi } from "src/core/api";
import { ListDataProvider2 } from "src/core/providers";

export class ListLandingTypeProvider extends ListDataProvider2<any, any, any> {
    constructor() {
        super();
    }

    async createInternal(c: any): Promise<any> {
        // let res = await apiWrapper(apiConnector.systemStaticPage.systemStaticPageAdminCreateCreate(c));
        // return res;
    }

    async updateInternal(u: any): Promise<any> {
        // let res = await apiWrapper(apiConnector.systemStaticPage.systemStaticPageAdminUpddateUpdate(u));
        // return res;
    }

    async deleteInternal(id: (string)[]): Promise<boolean> {
        // let res = await apiWrapper(apiConnector.systemStaticPage.systemStaticPageAdminDeleteDelete({id_in:id}));
        return true;
    }
    async fetchDetail(id: string): Promise<any> {
        //    let res = await apiWrapper(apiConnector.systemStaticPage.systemStaticPageAdminDetail(id));
        //    return res;
    }


    async fetchInternal(filter: any): Promise<{ count: number; offset: number; list: any[]; }> {
        const res = await PostApi.getListLandingType({ ...filter })
        return {
            list: res.Data.data,
            count: res.Data.total,
            offset: 0
        }
    }
}
