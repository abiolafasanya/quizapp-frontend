import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

// Type for the error response
interface ErrorResponse {
  response?: {
    status: number;
  };
}

const axiosConfig = async (): Promise<void> => {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;

  axios.defaults.withCredentials = true;

  // ✅ Add request interceptor to dynamically inject token
  axios.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  // ✅ Response interceptor remains the same
  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ErrorResponse>) => {
      const isLoggedOut = useAuthStore.getState().user === null;

      if (error.response?.status === 401 && !isLoggedOut) {
        useAuthStore.getState().setAuth("", null);
        toast.error("Session expired");
        window.location.href = "/login";
        useAuthStore.getState().logout();
        return Promise.reject("Unauthorized");
      }

      return Promise.reject(error);
    }
  );
};

export default axiosConfig;
