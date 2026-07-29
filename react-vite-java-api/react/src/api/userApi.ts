import axios from "axios";

/**
 * dev  -> http://localhost:8080/api/user
 * prod -> http://localhost:8081/api/user
 * (see .env.development / .env.production)
 */
const baseURL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD
    ? "http://localhost:8081/api/user"
    : "http://localhost:8080/api/user");

export const userApi = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export function toErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (typeof data === "string") {
      return data;
    }
    return (data?.message ?? fallback).trim() || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
