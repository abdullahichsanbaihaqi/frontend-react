import axios from "axios";

// Typo diperbaiki jadi BASE_URL biar lebih standar
const BASE_URL = "http://localhost:5117/api";

const instance = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- 1. REQUEST INTERCEPTOR (INI YANG KURANG) ---
// Bagian ini jalan SEBELUM request dikirim. 
// Tujuannya buat nempelin token ke setiap request biar gak kena 401 di awal.
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 2. RESPONSE INTERCEPTOR ---
// Bagian ini cuma jalan kalau ada ERROR dari Backend (seperti 401 karena token expired)
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 dan bukan karena request retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Jika proses refresh token lagi jalan, antre dulu di sini
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      try {
        // Gunakan axios standar (bukan instance) biar gak kena loop interceptor
        const res = await axios.post(BASE_URL + "/auth/refresh", {
          accessToken: localStorage.getItem("token"),
          refreshToken: refreshToken,
        });

        // Sesuaikan path data res.data.data.token dengan format response BE lu
        const newToken = res.data.data.token;
        const newRefreshToken = res.data.data.refreshToken;

        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        
        // Kalau refresh token juga gagal/expired, paksa logout
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;