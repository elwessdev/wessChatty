import axios from "axios";

const axiosInstance = axios.create({
  baseURL:`${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { data } = await axiosInstance.post('/auth/refresh');
      originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;