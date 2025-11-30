import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // required for httpOnly cookies
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh access token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    console.log("Interceptor triggered:", error?.response?.status);

    const original = error.config;

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

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
