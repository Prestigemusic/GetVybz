// FILE: src/api/client.ts
import axios, { AxiosError } from "axios";
import { Platform } from "react-native";

/**
 * PROD candidates (try in order)
 * Put your Render / production endpoints here.
 */
const PROD_CANDIDATES = [
  "https://getvybz-backend-9imn.onrender.com",
  "https://getvybz-backend.onrender.com",
];

/** Local/dev fallback hosts (edit to include your LAN IP if needed) */
const LOCAL_CANDIDATES =
  Platform.OS === "android"
    ? ["http://10.0.2.2:8000", "http://127.0.0.1:8000", "http://localhost:8000"]
    : ["http://127.0.0.1:8000", "http://localhost:8000"];

let authToken: string | null = null;
let preferredHost: string | null = null; // cached best host

/** Call this from AuthContext on login/logout so headers are set */
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

/** Build axios client for a base host, attach token if present */
const makeClient = (base: string) => {
  const client = axios.create({
    baseURL: base,
    timeout: 20000,
  });
  if (authToken) client.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  return client;
};

/** Logging helpers */
const logRequest = (method: string, url: string, targetLabel: string) =>
  console.log(`➡️ [${targetLabel}] ${method.toUpperCase()} ${url}`);

const handleError = (err: any, url: string) => {
  if (err instanceof AxiosError) {
    console.error(`❌ API Error on ${url}:`, err.response?.status, err.response?.data || err.message);
  } else {
    console.error(`❌ Unexpected error on ${url}:`, err);
  }
};

/** Decide whether to failover (network/timeouts/404) */
const shouldFailover = (err: any) => {
  if (!(err instanceof AxiosError)) return false;
  const code = (err as AxiosError).code;
  const status = err.response?.status ?? null;
  const msg = (err.message || "").toString();

  if (code === "ECONNABORTED" || msg.includes("Network Error")) return true;
  if (status === 404) return true; // common when prod code doesn't include a route
  return false;
};

/** Try health endpoints and pick a preferred host */
export const detectBestHost = async () => {
  const candidates = [...PROD_CANDIDATES, ...LOCAL_CANDIDATES];
  for (const host of candidates) {
    try {
      const client = makeClient(host);
      const res = await client.get("/api/health");
      if (res?.data?.status === "ok") {
        preferredHost = host;
        console.log(`✅ Selected preferred host: ${host}`);
        return host;
      }
    } catch (err) {
      console.warn(`⚠️ Host not healthy: ${host}`);
      continue;
    }
  }
  console.error("❌ No healthy host found. Requests may fail.");
  preferredHost = null;
  return null;
};

/** Normalize path: ensure path starts with /api/... */
const normalizePath = (url: string) => {
  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/api")) path = `/api${path}`;
  return path;
};

/** Main request with failover logic */
const requestWithFallback = async (method: "get" | "post", url: string, data?: any) => {
  const path = normalizePath(url);

  // put preferred host first if found
  const candidates = preferredHost
    ? [preferredHost, ...PROD_CANDIDATES.filter((h) => h !== preferredHost), ...LOCAL_CANDIDATES]
    : [...PROD_CANDIDATES, ...LOCAL_CANDIDATES];

  for (const base of candidates) {
    try {
      const client = makeClient(base);
      logRequest(method, path, base);
      const res = await client.request({ url: path, method, data });

      // cache success
      if (base !== preferredHost) {
        preferredHost = base;
        console.log(`🔄 Updated preferred host to: ${base}`);
      }

      return res.data;
    } catch (err: any) {
      handleError(err, path);
      if (shouldFailover(err)) {
        console.warn(`⚠️ Failover from ${base}, trying next...`);
        continue;
      }
      throw err;
    }
  }

  throw new Error(`All API hosts failed for ${method.toUpperCase()} ${path}`);
};

/** Public helpers */
export const apiGet = async (url: string) => requestWithFallback("get", url);
export const apiPost = async (url: string, data: any) => requestWithFallback("post", url, data);

export default {
  apiGet,
  apiPost,
  setAuthToken,
  detectBestHost,
};
