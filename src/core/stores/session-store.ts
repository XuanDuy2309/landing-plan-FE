import { makeAutoObservable, runInAction } from "mobx";
import { clearPersistedStore, getPersistedStore, makePersistable } from "mobx-persist-store";
import { UserModel } from "../models";

export class ILocation {
    lat: number = 21.0283334;
    lng: number = 105.854041;
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
    new_message_count: number = 0;
    isInitialized: boolean = false;

    constructor() {
        makeAutoObservable(this);
        makePersistable(this, {
            name: 'SessionStore',
            properties: ['profile', 'session', 'location'],
            storage: window.localStorage,
            expireIn: 63115200000,
        }).then(() => {
            runInAction(() => {
                this.isInitialized = true;
            });
        });
        runInAction(() => {
            this.requestLocation();
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

    setNewMessageCount(count: number) {
        runInAction(() => {
            this.new_message_count = count
        })
    }

    showLoading() {
        this.isLoading = true;
    }

    hideLoading() {
        this.isLoading = false;
    }
}