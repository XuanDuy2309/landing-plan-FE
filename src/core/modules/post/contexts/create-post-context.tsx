import { observer } from "mobx-react";
import moment from "moment";
import React, { useEffect } from "react";
import { PostApi } from "src/core/api";
import { BaseResponse } from "src/core/config";
import { LandingTypeModel, PostModel, Purpose_Post, Type_Asset_Enum } from "../../../models";
import { usePostContext } from "./post-context";

export class CreatePostContextType {
    data: PostModel = new PostModel();
    loading: boolean = false
    openMap: boolean = false
    action: ActionMap | undefined
    message: string = ''
    setOpenMap: (openMap: boolean) => void = (openMap: boolean) => { }
    setAction: (action: ActionMap | undefined) => void = (action: ActionMap | undefined) => { }
    setMessage: (message: string) => void = (message: string) => { }
    onSubmit?: () => Promise<BaseResponse | undefined>
    onClear: () => void = () => { }
}

export const CreatePostContext = React.createContext<CreatePostContextType>(new CreatePostContextType());

interface IProps {
    children: React.ReactNode
    lat?: number
    lng?: number
    landingType?: LandingTypeModel
}

export const enum ActionMap {
    Select_location = 1,
    Select_coordinate = 2,
    Get_width_height = 3
}

export const CreatePostContextProvider = observer(({ children, lat, lng, landingType }: IProps) => {
    const [data, setData] = React.useState<PostModel>(new PostModel());
    const [loading, setLoading] = React.useState<boolean>(false);
    const [openMap, setOpenMap] = React.useState<boolean>(false);
    const [action, setAction] = React.useState<ActionMap>();
    const [message, setMessage] = React.useState<string>('');
    const { itemUpdate, setItemUpdate } = usePostContext()

    const isValidate = () => {
        let isValid = true;

        // Reset tất cả lỗi
        data.err_create_by_name = ''
        data.err_create_by_phone = ''
        data.err_title = ''
        data.err_image = ''
        data.err_lng = ''
        data.err_lat = ''
        data.err_coordinate = ''
        data.err_area = ''
        data.err_width = ''
        data.err_height = ''
        data.err_price_for_buy = ''
        data.err_price_for_rent = ''
        data.err_price_start = ''
        data.err_price_current = ''
        data.err_step_bid = '' // ✅ mới
        data.err_date_start = ''
        data.err_date_end = ''
        data.err_number_floors = ''
        data.err_number_bedrooms = ''
        data.err_number_bathrooms = ''
        data.err_owner_name = ''
        data.err_owner_phone = ''
        data.err_max_bid = ''

        // Tiêu đề
        if (!data.title) {
            data.err_title = 'Vui lòng nhập tiêu đề'
            isValid = false
        }

        // Hình ảnh
        if (data.image_links.length === 0) {
            data.err_image = 'Vui lòng chọn hình ảnh'
            isValid = false
        }

        // Tọa độ
        if (!data.lng) {
            data.err_lng = 'Vui lòng nhập kinh độ'
            isValid = false
        }
        if (!data.lat) {
            data.err_lat = 'Vui lòng nhập vĩ độ'
            isValid = false
        }

        // Diện tích
        if (!data.area) {
            data.err_area = 'Vui lòng nhập diện tích'
            isValid = false
        }

        // Giá mua bán / thuê
        if (!data.price_for_buy) {
            data.err_price_for_buy = 'Vui lòng nhập giá trị'
            isValid = false
        }
        if (data.purpose === Purpose_Post.For_Rent && !data.price_for_rent) {
            data.err_price_for_rent = 'Vui lòng nhập giá trị thuê'
            isValid = false
        }

        // Kiểm tra nếu là đấu giá
        if (data.purpose === Purpose_Post.For_Auction) {
            if (!data.price_start) {
                data.err_price_start = 'Vui lòng nhập giá khởi điểm'
                isValid = false
            }
            if (!data.bid_step) {
                data.err_step_bid = 'Vui lòng nhập bước giá'
                isValid = false
            }
            if (!data.max_bid) {
                data.err_max_bid = 'Vuiật bước giá tối đa'
                isValid = false
            }
            if (!data.start_date) {
                data.err_date_start = 'Vui lòng nhập ngày bắt đầu'
                isValid = false
            }
            if (!data.end_date) {
                data.err_date_end = 'Vui lòng nhập ngày kết thúc'
                isValid = false
            }
            // if (data.start_date && moment(data.start_date).isSameOrBefore(moment().startOf('day').add(1, 'day'))) {
            //     data.err_date_start = 'Ngày bắt đầu muộn nhất vào ngày mai'
            //     isValid = false
            // }
            // if (data.end_date && moment(data.end_date).isSameOrBefore(data.start_date)) {
            //     data.err_date_end = 'Ngày kết thúc phải sau ngày bắt đầu'
            //     isValid = false
            // }
        }

        // Kiểm tra tài sản có tầng / phòng
        const hasRoomInfo = [
            Type_Asset_Enum.Home,
            Type_Asset_Enum.Apartment,
            Type_Asset_Enum.Office,
            Type_Asset_Enum.Other,
            Type_Asset_Enum.Motel,
            Type_Asset_Enum.Hotel
        ].includes(data.type_asset);

        if (hasRoomInfo) {
            if (!data.number_floors) {
                data.err_number_floors = 'Vui lòng nhập số tầng'
                isValid = false
            }
            if (!data.number_bedrooms) {
                data.err_number_bedrooms = 'Vui lòng nhập số phòng ngủ'
                isValid = false
            }
            if (!data.number_bathrooms) {
                data.err_number_bathrooms = 'Vui lòng nhập số phòng tắm'
                isValid = false
            }
        }

        // Thông tin người đăng / chủ sở hữu
        if (data.is_owner) {
            if (!data.create_by_name) {
                data.err_create_by_name = 'Vui lòng nhập họ và tên'
                isValid = false
            }
            if (!data.create_by_phone) {
                data.err_create_by_phone = 'Vui lòng nhập số điện thoại'
                isValid = false
            }
        } else {
            if (!data.owner_name) {
                data.err_owner_name = 'Vui lòng nhập họ và tên'
                isValid = false
            }
            if (!data.owner_phone) {
                data.err_owner_phone = 'Vui lòng nhập số điện thoại'
                isValid = false
            }
        }

        // kiem tra bat buoc loai dat
        if (!data.type_landing_id) {
            isValid = false
            data.err_type_landing = 'Vui lòng chọn loại đất'
        }

        return isValid
    }


    const onSubmit = async () => {
        if (!isValidate()) {
            return
        }
        const params = {
            "type": data.type,
            "purpose": data.purpose,
            "type_asset": data.type_asset,
            "status": data.status,
            "image_links": JSON.stringify(data.image_links),
            "video_links": JSON.stringify(data.video_links),
            "coordinates": data.coordinates || "POLYGON((0 0, 10 0, 10 10, 0 10, 0 0))",
            "direction_land": data.direction_land,
            "area": data.area,
            "width": data.width,
            "height": data.height,
            "price_for_buy": data.price_for_buy,
            "price_for_rent": data.price_for_rent,
            "price_start": data.price_start,
            "price_current": data.purpose === Purpose_Post.For_Auction ? data.price_start : data.price_for_buy,
            "bid_step": data.bid_step,
            "max_bid": data.max_bid,
            "start_date": data.start_date ? moment(data.start_date).format('YYYY-MM-DD') : '',
            "end_date": data.end_date ? moment(data.end_date).format('YYYY-MM-DD') : '',
            "number_floors": data.number_floors,
            "number_bedrooms": data.number_bedrooms,
            "number_bathrooms": data.number_bathrooms,
            "room_number": data.room_number,
            "in_alley": data.in_alley,
            "title": data.title,
            "description": data.description,
            "lng": data.lng,
            "lat": data.lat,
            "address": data.address,
            "owner_name": data.owner_name,
            "owner_phone": data.owner_phone,
            "group_id": data.group_id,
            "type_landing_id": data.type_landing_id
        }

        let res: BaseResponse = {
            Status: false,
            Data: undefined,
            Message: "",
            Code: undefined
        }

        if (itemUpdate) {
            res = await PostApi.updatePost(itemUpdate.id || 0, params);
            if (res.Status) {
                onClear()
            }
            return res
        }

        res = await PostApi.createPost(params);
        if (res.Status) {
            onClear()
        }
        return res
    }


    const onClear = () => {
        setData(new PostModel())
        setOpenMap(false)
        setAction(undefined)
        setMessage('')
        setItemUpdate(undefined)
    }

    const initData = (itemUpdate: PostModel) => {
        Object.assign(data, itemUpdate);
        data.is_owner = itemUpdate.owner_phone ? false : true
    }

    useEffect(() => {
        if (itemUpdate) {
            initData(itemUpdate)
        }
    }, [itemUpdate])

    useEffect(() => {
        if (lat) {
            data.lat = lat
        }
        if (lng) {
            data.lng = lng
        }
        if (landingType) {
            data.type_landing = landingType
            data.type_landing_id = landingType.id
        }
    }, [lat, lng, landingType])

    return (
        <CreatePostContext.Provider value={{ data, loading, openMap, action, message, setOpenMap, setAction, setMessage, onSubmit, onClear }}>
            {children}
        </CreatePostContext.Provider>
    )
})

export const useCreatePostContext = () => {
    return React.useContext(CreatePostContext);
}
