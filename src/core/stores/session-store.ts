import { makeAutoObservable } from "mobx";
import { UserModel } from "../models";
import { clearPersistedStore, getPersistedStore, makePersistable } from "mobx-persist-store";

export class ISession {
    access_token?: string;
}

export class SessionStore {
    profile?: UserModel;
    session?: ISession;
    constructor() {
        makeAutoObservable(this)
        makePersistable(this, {
            name: 'SessionStore',
            properties: ['profile', 'session'],
            storage: window.localStorage,
            expireIn: 63115200000,
            // removeOnExpiration: true,
            // stringify: false,
            // debugMode: true,
        });

        getPersistedStore(this).then((data) => {
            if (data) {
                Object.assign(this, data); // Cập nhật store với dữ liệu đã lưu
            }
        });
    }

    async clearPersistedData() {
        await clearPersistedStore(this); // Xóa dữ liệu trong localStorage nhưng giữ nguyên giá trị trong RAM
    }

    logout() {
        this.clearPersistedData();
        this.profile = undefined;
        this.session = undefined;
    }
}