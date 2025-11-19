import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
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
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refresh = await axios.post(
          "http://localhost:5000/api/auth/refresh-token",
          {
            token: localStorage.getItem("refreshToken"),
          }
        );

        const newToken = refresh.data.accessToken;

        localStorage.setItem("accessToken", newToken);

        original.headers.Authorization = `Bearer ${newToken}`;

        return api(original);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
