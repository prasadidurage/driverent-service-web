import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";

export const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:7000";

// In browser, using relative URL "" delegates requests through Next.js proxy rewrites, avoiding CORS
export const apiClient: AxiosInstance = axios.create({
  baseURL: typeof window !== "undefined" ? "" : API_GATEWAY_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request Interceptor ────────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.debug(`[API Gateway Request] ${config.method?.toUpperCase()} -> ${config.baseURL || ""}${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error("[API Gateway Request Error]:", error);
    return Promise.reject(error);
  }
);

// ─── Response Interceptor (Error Handling) ─────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (!error.response) {
      // Network Error / API Gateway unreachable
      const networkErrMsg = "Unable to connect to Spring Cloud API Gateway (http://localhost:7000). Please check if your Gateway and microservices are running.";
      console.error("[Gateway Connection Error]:", error.message);
      return Promise.reject(new Error(networkErrMsg));
    }

    const { status, data } = error.response;
    const responseData = data as Record<string, unknown> | undefined;
    const serverMessage =
      (typeof responseData?.message === "string" && responseData.message) ||
      (typeof responseData?.error === "string" && responseData.error) ||
      error.message;

    switch (status) {
      case 400:
        console.warn(`[400 Bad Request / Validation Failure]: ${serverMessage}`, responseData);
        break;
      case 401:
        console.warn(`[401 Unauthorized]: Authentication required.`);
        break;
      case 403:
        console.warn(`[403 Forbidden]: You do not have permission.`);
        break;
      case 404:
        console.warn(`[404 Not Found]: Endpoint / resource was not found -> ${error.config?.url}`);
        break;
      case 500:
        console.error(`[500 Internal Server Error]: Microservice error -> ${serverMessage}`);
        break;
      case 503:
        console.error(`[503 Service Unavailable]: Service discovery via Eureka or target microservice is unavailable.`);
        break;
      default:
        console.error(`[HTTP ${status}]: ${serverMessage}`);
    }

    const customError = new Error(serverMessage);
    (customError as unknown as { status: number; details: unknown }).status = status;
    (customError as unknown as { status: number; details: unknown }).details = responseData;
    return Promise.reject(customError);
  }
);
