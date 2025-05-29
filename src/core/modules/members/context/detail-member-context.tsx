import { observer } from "mobx-react";
import React, { createContext } from "react";
import { AuthApi } from "src/core/api";
import { UserModel } from "src/core/models";

export class DetailMemberContextType {
    data: UserModel = new UserModel()
    loading: boolean = false
    isFollow: boolean = false
    onFollow!: (user_id?: number) => Promise<void>
    onUnFollow!: (user_id?: number) => Promise<void>
}

export const DetailMemberContext = createContext<DetailMemberContextType>(new DetailMemberContextType());

interface IProps {
    children: React.ReactNode
    id?: number
}
export const DetailMemberContextProvider = observer(({ children, id }: IProps) => {
    const [data, setData] = React.useState<UserModel>(new UserModel());
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isFollow, setIsFollow] = React.useState<boolean>(false);

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await AuthApi.getDetailUser({ id });
            if (res.Status) {
                const use = new UserModel();
                Object.assign(use, res.Data.data);
                setData(use);
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }


    const checkFollow = async () => {
        try {
            setLoading(true)
            const res = await AuthApi.checkFollow({ id });
            if (res.Status) {
                setIsFollow(res.Data.data)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    const onFollow = async (user_id?: number) => {
        if (!user_id) return
        try {
            setLoading(true)
            const res = await AuthApi.follow({ id: user_id });
            if (res.Status) {
                setIsFollow(res.Data.data)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    const onUnFollow = async (user_id?: number) => {
        if (!user_id) return
        try {
            setLoading(true)
            const res = await AuthApi.unfollow({ id: user_id });
            if (res.Status) {
                setIsFollow(res.Data.data)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        if (!id) return
        fetchData()
        checkFollow()
    }, [id])
    return (
        <DetailMemberContext.Provider value={{ data, loading, isFollow, onFollow, onUnFollow }}>
            {children}
        </DetailMemberContext.Provider>
    )
})
export const useDetailMemberContext = () => {
    return React.useContext(DetailMemberContext)
}