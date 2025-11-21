import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: false,
});

// Auto attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh token when expired
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    console.log("Interceptor triggered:", error.response?.status);

    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      console.log("Access token expired. Trying refresh...");
      original._retry = true;

      try {
        const refresh = await api.post("/auth/refresh-token", {
          token: localStorage.getItem("refreshToken"),
        });

        console.log("Refresh success:", refresh.data);

        const newToken = refresh.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        console.log("Refresh failed:", err.response?.data || err);
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);



export default api;
