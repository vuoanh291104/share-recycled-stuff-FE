import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

// =======================
// Interfaces
// =======================

// Interface lỗi backend
export interface ErrorResponse {
  path: string;
  error: string;
  errorCode: string;
  message: string;
  status: number;
  timestamp: string;
  fieldErrors?: any[];
}

// =======================
// Axios instance
// =======================
const api = axios.create({
  baseURL: import.meta.env.VITE_URL_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm token nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


const handleAxiosError = (error: any): ErrorResponse => {
  return error.response?.data as ErrorResponse || {
    path: "",
    error: "",
    errorCode: "",
    message: error.message,
    status: 0,
    timestamp: new Date().toISOString(),
    fieldErrors: [],
  };
};

// =======================
// HTTP Methods
// =======================
export const getData = async <T>(
  url: string,
  params: Record<string, any> = {},
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.get(url, { params, ...config });
    return response.data;
  } catch (error) {
    const errData = handleAxiosError(error);
    console.error("GET error:", errData.message);
    throw errData;
  }
};

export const postData = async <T>(
  url: string,
  body: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.post(url, body, config);
    return response.data;
  } catch (error) {
    const errData = handleAxiosError(error);
    console.error("POST error:", errData.message);
    throw errData;
  }
};

export const putData = async <T>(
  url: string,
  body: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.put(url, body, config);
    return response.data;
  } catch (error) {
    const errData = handleAxiosError(error);
    console.error("PUT error:", errData.message);
    throw errData;
  }
};

export const patchData = async <T>(
  url: string,
  body?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.patch(url, body, config);
    return response.data;
  } catch (error) {
    const errData = handleAxiosError(error);
    console.error("PATCH error:", errData.message);
    throw errData;
  }
};

export const deleteData = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.delete(url, config);
    return response.data;
  } catch (error) {
    const errData = handleAxiosError(error);
    console.error("DELETE error:", errData.message);
    throw errData;
  }
};

export default api;
