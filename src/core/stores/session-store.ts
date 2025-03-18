import { action, makeAutoObservable, runInAction } from "mobx";
import { UserModel } from "../models";
import { clearPersistedStore, getPersistedStore, makePersistable } from "mobx-persist-store";

export class ISession {
    access_token?: string;
    constructor() {
        makeAutoObservable(this)
    }
}

export class SessionStore {
    profile?: UserModel;
    session?: ISession;
    constructor() {
        console.log('SessionStore');
        makeAutoObservable(this, {
            setProfile: action,
            setSession: action,
            logout: action,
        })
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
                runInAction(() => {
                    Object.assign(this, data);
                });
            }
        });
    }

    setProfile(profile?: UserModel) {
        this.profile = profile;
    }

    setSession(session?: ISession) {
        this.session = session;
    }

    async clearPersistedData() {
        await clearPersistedStore(this);
    }

    logout() {
        this.clearPersistedData();
        this.profile = undefined;
        this.session = undefined;
    }
}