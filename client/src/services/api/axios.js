import axios from "axios";

const api = axios.create({
  baseURL:`${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});
let logoutHandler = null;

export const setLogoutHandler = (logout) => {
  logoutHandler = logout;
};
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    console.log("Interceptor triggered:", error?.response?.status);

    const original = error.config;
    const skipUrls = [
      "/auth/login",
      "/auth/register",
      "/auth/logout",
      "/auth/refresh-token",
    ];

    if (skipUrls.some((url) => original.url.includes(url))) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (original.url.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 && !original._retry) {
      console.log("Access token expired. Trying refresh...");
      original._retry = true;

      try {
        const refresh = await api.post("/auth/refresh-token");

        console.log("Refresh success:", refresh.data);
        const newToken = refresh.data.accessToken;

        localStorage.setItem("accessToken", newToken);

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        console.log("Refresh failed:", err.response?.data || err);

        if (logoutHandler) logoutHandler();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
