import axios, { AxiosRequestConfig } from 'axios'
import qs from 'querystringify'

// Base URL của VietMap
export const baseUrlMap = 'https://maps.vietmap.vn/api'

const API_KEY = "9fd8f44cc355598937e0f5acfcc8b7b4750be5cbb9e04345" 

// Headers mặc định
const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json', 
}

// BaseResponse format
class BaseResponse<T = any> {
  Data: T | null = null
  Status: boolean = false
  Message: string = ''
  Code: any = null
}

const viet_map_server = {
  get: async <T = any>(endpoint: string, params: Record<string, any> = {}): Promise<BaseResponse<T>> => {
    const obj = new BaseResponse<T>()

    try {
      // Thêm API key vào params nếu cần
      const fullParams = {
        ...params,
        apikey: API_KEY,
      }

      const queryString = qs.stringify(fullParams, true)
      const url = `${baseUrlMap}${endpoint}${queryString}`

      const config: AxiosRequestConfig = {
        method: 'GET',
        headers: HEADERS,
        url,
      }

      const response = await axios(config)

      // Xử lý dữ liệu trả về
      if (response.status === 200) {
        obj.Data = response.data
        obj.Status = true
      } else {
        obj.Message = 'Lỗi phản hồi từ VietMap'
      }

    } catch (error: any) {
      obj.Status = false
      obj.Message = error?.message || 'Có lỗi xảy ra khi gọi API VietMap'
    }

    return obj
  },
}

export { viet_map_server }
