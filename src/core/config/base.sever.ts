// import { baseUrl } from "./config";
import axios from 'axios';
import qs from "querystringify";
import { useCoreStores } from '../stores';
let HEADERS: any = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': "*",
  'ngrok-skip-browser-warning': 'true',
  "charset": "utf-8",
};
// export let baseUrl = 'http://localhost:3000';
export let baseUrl = 'https://landing-plan-be.onrender.com';

export class BaseResponse {
  Data: any = null;
  Status: boolean = false;
  Message: string = '';
  Code: any = null;
}


const onResponseAxios = async (request: any, result: any) => {

  const obj = new BaseResponse();
  try {
    // console.log('result', result)
    const body = await result.data;
    // tronLog('body1111', body);
    if (result.status === 401) {
      obj.Data = null;
      obj.Status = false;
      obj.Code = null;
      return obj;
    }
    if (result.status !== 200) {
      obj.Data = null;
      obj.Status = false;
      obj.Message = body.message;
      obj.Code = body.code;
      return obj;
    }
    if (result.status === 200) {
      if (body.status) {
        obj.Data = body;
        obj.Status = true;
        obj.Message = body.message;
        return obj;
      }
      obj.Data = null;
      obj.Status = false;
      obj.Message = body.message;
      obj.Code = body.code;
      return obj;
    }

    // SUCCESS: Return valid response
    return obj;
  } catch (e) {
    obj.Data = null;
    obj.Status = false;
    obj.Message = 'Có lỗi xảy ra';
    return obj;
  }
};

const onResponse = async (request: any, result: any) => {
  const { sessionStore } = useCoreStores()
  const obj = new BaseResponse();
  try {
    const body = await result.json();
    if (result.status === 401) {
      sessionStore.logout();
      obj.Data = null;
      obj.Status = false;
      obj.Code = null;
      return obj;
    }

    if (result.status !== 200) {
      obj.Data = null;
      obj.Status = false;
      obj.Message = body.message;
      obj.Code = body.code;
      return obj;
    }
    if (result.status === 200) {
      if (body.status) {
        obj.Data = body;
        obj.Status = true;
        obj.Message = body.message;
        return obj;
      }
      obj.Data = null;
      obj.Status = false;
      obj.Message = body.message;
      obj.Code = body.code;
      return obj;
    }

    // SUCCESS: Return valid response
    return obj;
  } catch (e) {
    obj.Data = null;
    obj.Status = false;
    obj.Message = 'Có lỗi xảy ra';
    return obj;
  }
};

const server = {
  post: async (endpoint: string, params: object) => {
    // tronLog('params', params);
    // consoleLog('baseUrl111', baseUrl)
    const url = baseUrl + endpoint;
    const options = {
      method: 'POST',
      body: JSON.stringify(params),
      headers: HEADERS,
    };
    const request = {
      url,
      options,
    };
    // tronLog(request);
    return fetch(url, options).then((result) => onResponse(request, result));
  },

  get: async (endpoint: string, params: object = {}) => {
    // tronLog('params', params);
    const url = `${baseUrl}${endpoint}${qs.stringify(params, true)}`;
    // tronLog(url);
    const options = {
      method: 'GET',
      headers: HEADERS,
    };
    const request = {
      url,
      options,
    };
    // tronLog(request);
    return fetch(url, options).then((result) => onResponse(request, result));
  },
  getSync: async (endpoint: string, params: object = {}, option: any) => {
    // tronLog('params', params);
    const url = `${baseUrl}${endpoint}${qs.stringify(params, true)}`;
    // tronLog(url);
    const options = {
      method: 'GET',
      headers: HEADERS,
      signal: option.signal
    };
    const request = {
      url,
      options,
    };
    // tronLog(request);
    return fetch(url, options).then((result) => onResponse(request, result));
  },

  put: async (endpoint: string, params: object) => {
    // consoleLog('JSON.stringify(params)', JSON.stringify(params))
    const url = baseUrl + endpoint;
    const options = {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(params),
    };
    const request = {
      url,
      options,
    };
    return fetch(url, options).then((result) => onResponse(request, result));
  },

  delete: async (endpoint: string, params?: any) => {
    const url = `${baseUrl}${endpoint}${qs.stringify(params, true)}`;
    const options = {
      method: 'DELETE',
      headers: HEADERS,
    };
    const request = {
      url,
      options,
    };
    return fetch(url, options).then((result) => onResponse(request, result));
  },

  deleteBodyParam: async (endpoint: string, params?: object) => {
    const url = baseUrl + endpoint;
    const options = {
      method: 'DELETE',
      body: JSON.stringify(params),
      headers: HEADERS,
    };
    const request = {
      url,
      options,
    };
    return fetch(url, options).then((result) => onResponse(request, result));
  },

  patch: async (endpoint: string, params?: object) => {
    const url = baseUrl + endpoint;
    const options = {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify(params),
    };
    const request = {
      url,
      options,
    };
    return fetch(url, options).then((result) => onResponse(request, result));
  },

  refresh: async (endpoint: string, params: object = {}) => {
    const url = `${baseUrl}${endpoint}${qs.stringify(params, true)}`;
    const options = {
      method: 'GET',
      headers: HEADERS,
    };
    const request = {
      url,
      options,
    };
    return fetch(url, options).then((result) => onResponse(request, result));
  },

  multipartPost: async (endpoint: string, params: object) => {
    try {
      const url = baseUrl + endpoint;
      // const options = {
      //   method: 'POST',
      //   body: createFormData(params),
      //   headers: { ...HEADERS, 'Content-Type': 'multipart/form-data;boundary=abc' },
      // };
      // console.log('ủlll', url)

      // console.log('dataaaa', data)
      let res = await axios({
        baseURL: url,
        method: 'POST',
        data: params,
        headers: { ...HEADERS, 'Content-Type': 'multipart/form-data' },
      })
      // console.log('ressss', res)
      return onResponseAxios(null, res);
    } catch (e: any) {
      return onResponseAxios(null, e?.response);
    }
    // return fetch(url).then((result) => onResponse(request, result));
  },

  multipartPut: async (endpoint: string, params: object) => {
    try {
      const url = baseUrl + endpoint;
      // const options = {
      //   method: 'POST',
      //   body: createFormData(params),
      //   headers: { ...HEADERS, 'Content-Type': 'multipart/form-data;boundary=abc' },
      // };
      // console.log('ủlll', url)

      // console.log('dataaaa', data)
      let res = await axios({
        baseURL: url,
        method: 'PUT',
        data: params,
        headers: { ...HEADERS, 'Content-Type': 'multipart/form-data' },
      })
      // console.log('ressss', res)
      return onResponseAxios(null, res);
    } catch (e: any) {
      return onResponseAxios(null, e?.response);
    }
    // return fetch(url).then((result) => onResponse(request, result));
  },

  binary: async (URL: string, file: object) => {
    try {
      const url = URL;
      const options: object = {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': 'application/binary' },
      };
      await fetch(url, options);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};

const setBaseUrl = (url: any) => {
  baseUrl = url;
}

const getApiUrl = () => baseUrl;
const setToken = (_token: any) => {
  if (_token) {
    HEADERS = {
      ...HEADERS,
      Authorization: `Bearer ${_token}`,
    };
  } else {
    HEADERS = {
      ...HEADERS,
    };
    delete HEADERS.Authorization;
  }
};

const setWarehouseIdHeader = (id: any) => {
  if (id) {
    HEADERS = {
      ...HEADERS,
      WarehouseId: id,
    };
  } else {
    HEADERS = {
      ...HEADERS,
    };
    delete HEADERS.WarehouseId;
  }
};

const setRoleHeader = (id: any) => {
  if (id) {
    HEADERS = {
      ...HEADERS,
      RoleId: id,
    };
  } else {
    HEADERS = {
      ...HEADERS,
    };
    delete HEADERS.RoleId;
  }
};

export { getApiUrl, server, setBaseUrl, setRoleHeader, setToken, setWarehouseIdHeader };

