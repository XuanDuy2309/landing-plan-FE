import { observer } from "mobx-react";
import React from "react";
import { PostModel, Purpose_Post, Type_Asset_Enum } from "../../../models";
import moment from "moment";
import { PostApi } from "src/core/api";
import { BaseResponse } from "src/core/config";

export class CreatePostContextType {
    data: PostModel = new PostModel();
    loading: boolean = false
    onSubmit?: () => Promise<BaseResponse | undefined>
    onClear: () => void = () => { }
}

export const CreatePostContext = React.createContext<CreatePostContextType>(new CreatePostContextType());

interface IProps {
    children: React.ReactNode
}

export const CreatePostContextProvider = observer(({ children }: IProps) => {
    const [data, setData] = React.useState<PostModel>(new PostModel());
    const [loading, setLoading] = React.useState<boolean>(false);

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
        if (!data.width) {
            data.err_width = 'Vui lòng nhập chiều ngang'
            isValid = false
        }
        if (!data.height) {
            data.err_height = 'Vui lòng nhập chiều dài'
            isValid = false
        }

        // Giá mua bán / thuê
        if (data.purpose === Purpose_Post.For_Sell && !data.price_for_buy) {
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
            if (!data.date_start) {
                data.err_date_start = 'Vui lòng nhập ngày bắt đầu'
                isValid = false
            }
            if (!data.date_end) {
                data.err_date_end = 'Vui lòng nhập ngày kết thúc'
                isValid = false
            }
            if (data.date_start?.isSameOrBefore(moment().startOf('day').add(1, 'day'))) {
                data.err_date_start = 'Ngày bắt đầu muộn nhất vào ngày mai'
                isValid = false
            }
            if (data.date_end?.isSameOrBefore(data.date_start)) {
                data.err_date_end = 'Ngày kết thúc phải sau ngày bắt đầu'
                isValid = false
            }
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

        return isValid
    }


    const onSubmit = async () => {
        if (!isValidate()) {
            console.log('data', data)
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
            "price_current": data.price_current,
            "bid_step": data.bid_step,
            "max_bid": data.max_bid,
            "start_date": data.date_start ? moment(data.date_start).format('YYYY-MM-DD') : '',
            "end_date": data.date_end ? moment(data.date_end).format('YYYY-MM-DD') : '',
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
        }

        const res = await PostApi.createPost(params);
        if (res.Status) {
            onClear()
        }
        return res
    }


    const onClear = () => {
        setData(new PostModel())
    }

    return (
        <CreatePostContext.Provider value={{ data, loading, onSubmit, onClear }}>
            {children}
        </CreatePostContext.Provider>
    )
})

export const useCreatePostContext = () => {
    return React.useContext(CreatePostContext);
}