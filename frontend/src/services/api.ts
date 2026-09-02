import {
  ACCESS_TOKEN_KEY,
} from "./auth";


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";


export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const accessToken =
    sessionStorage.getItem(
      ACCESS_TOKEN_KEY
    );


  const headers =
    new Headers(
      options?.headers
    );


  if (
    options?.body &&
    !headers.has(
      "Content-Type"
    )
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }


  if (accessToken) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`
    );
  }


  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );


  if (!response.ok) {
    let message =
      `API Error: ${response.status}`;


    try {
      const data =
        await response.json();


      if (
        typeof data?.detail ===
        "string"
      ) {
        message =
          data.detail;
      } else if (
        typeof data?.detail?.message ===
        "string"
      ) {
        message =
          data.detail.message;
      }
    } catch {
      // Preserve status fallback.
    }


    throw new Error(
      message
    );
  }


  return response.json();
}