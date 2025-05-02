import { action, makeAutoObservable, runInAction } from "mobx";
import { UserModel } from "../models";
import { clearPersistedStore, getPersistedStore, makePersistable } from "mobx-persist-store";

export class ILocation {
    lat: number = 0;
    lng: number = 0;
    constructor() {
        makeAutoObservable(this)
    }
}

export class ISession {
    access_token?: string;
    constructor() {
        makeAutoObservable(this)
    }
}


export class SessionStore {
    profile?: UserModel;
    session?: ISession;
    location: ILocation = new ILocation();
    isLoading: boolean = false;
    constructor() {
        makeAutoObservable(this, {
            setProfile: action,
            setSession: action,
            logout: action,
            setLocation: action,
            requestLocation: action
        })
        makePersistable(this, {
            name: 'SessionStore',
            properties: ['profile', 'session', 'location'],
            storage: window.localStorage,
            expireIn: 63115200000,
            // removeOnExpiration: true,
            // stringify: false,
            // debugMode: true,
        });
        runInAction(() => {
            this.requestLocation();
        })
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
        this.location = new ILocation()
    }

    setLocation(lat: number, lng: number) {
        this.location = { lat, lng };
    }

    requestLocation() {
        if (!navigator.geolocation) {
            console.warn("Trình duyệt không hỗ trợ Geolocation");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                runInAction(() => {
                    this.setLocation(latitude, longitude);
                });
            },
            (error) => {
                console.error("Lỗi khi lấy vị trí:", error);
                runInAction(() => {
                    this.setLocation(0, 0); // Đặt tọa độ mặc định nếu xảy ra lỗi
                });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }

    showLoading() {
        this.isLoading = true;
    }

    hideLoading() {
        this.isLoading = false;
    }
}