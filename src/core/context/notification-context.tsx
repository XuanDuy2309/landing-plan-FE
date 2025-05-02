// context/NotificationContext.tsx
import { makeObservable } from "mobx";
import { observer } from "mobx-react";
import React, { createContext, useContext, useEffect } from "react";
import { NotificationApi } from "../api";
import { useCoreStores } from "../stores";
import { IBaseContextType, IContextFilter, useBaseContextProvider } from "./base-context";

export const enum NotificationType {
  LIKE = 1,
  SET_BID = 2,
  MESSAGE = 3,
}

export class NotificationModel {
  id?: number;
  created_at?: string;
  receiver_id?: number;
  sender_id?: number;
  sender_name?: string;
  sender_avatar?: string;
  message?: string;
  post_id?: number;
  type?: NotificationType;
  is_read: 1 | 0 = 0;
}

export class IFilterNotificationContextType extends IContextFilter {
  sort = 'DESC'
  constructor() {
    super();
    makeObservable(this);
  }
}

export class NotificationContextType extends IBaseContextType<NotificationModel, IFilterNotificationContextType> {
  onReadNotification!: (id: number) => Promise<any>;
  onReadAllNotification!: () => Promise<any>;
}

export const NotificationContext = createContext<NotificationContextType>(new NotificationContextType());

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
  const context = useBaseContextProvider<IFilterNotificationContextType, NotificationModel>(new IFilterNotificationContextType(), request);
  const { sessionStore } = useCoreStores()
  async function request(
    filter: IFilterNotificationContextType,
    index: number,
    pageSize: number
  ): Promise<{ count: number; list: NotificationModel[]; offset: number }> {

    const res = await NotificationApi.getNotifications({ filter, page: index, page_size: pageSize });
    return {
      count: res.Data?.total,
      list: res.Data?.data,
      offset: 0,
    }
  }

  const onReadNotification = async (id: number) => {
    const res = await NotificationApi.readNotification(id, {});
    return res
  }

  const onReadAllNotification = async () => {
    const res = await NotificationApi.readAllNotification(0, {});
    return res
  }

  useEffect(() => {
    if (!sessionStore.session?.access_token) return;
    context.onRefresh()
  }, [sessionStore.session?.access_token]);

  return (
    <NotificationContext.Provider value={{ ...context, onReadNotification, onReadAllNotification }}>
      {children}
    </NotificationContext.Provider >
  );
});

export const useNotificationStore = () => {
  const context = useContext(NotificationContext);
  return context;
};
