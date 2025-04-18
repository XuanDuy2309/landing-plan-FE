import { observer } from "mobx-react";
import React, { use, useEffect } from "react";
import { AuthApi } from "../../../api";
import { PostModel, Purpose_Post, Type_Asset_Enum } from "../../../models";
import moment from "moment";

export class CreatePostContextType {
    data: PostModel = new PostModel();
    loading: boolean = false
    onSubmit?: () => void
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
            return
        }
        const params = {
            ...data
        }
        console.log('params', params)
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