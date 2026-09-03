import type {
  AuthenticatedUser,
  AuthorizationDecision,
  LoginResponse,
} from "../types/auth";


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";


export const ACCESS_TOKEN_KEY =
  "identityforge_access_token";


export class AuthorizationDecisionError extends Error {
  decision: AuthorizationDecision;

  constructor(
    message: string,
    decision: AuthorizationDecision
  ) {
    super(message);

    this.name =
      "AuthorizationDecisionError";

    this.decision =
      decision;
  }
}


export async function loginAdmin(
  username: string,
  password: string
): Promise<LoginResponse> {
  const body =
    new URLSearchParams();

  body.set(
    "username",
    username
  );

  body.set(
    "password",
    password
  );

  body.set(
    "grant_type",
    "password"
  );


  const response =
    await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body,
      }
    );


  if (!response.ok) {
    let message =
      "Authentication failed.";

    let decision:
      AuthorizationDecision | null =
      null;


    try {
      const data =
        await response.json();


      if (
        typeof data?.detail ===
        "string"
      ) {
        message =
          data.detail;
      }


      if (
        typeof data?.detail?.message ===
        "string"
      ) {
        message =
          data.detail.message;
      }


      if (
        data?.detail?.decision
      ) {
        decision =
          data.detail.decision;
      }

    } catch {
      // Keep safe generic fallback.
    }


    if (
      response.status === 429
    ) {
      throw new Error(
        "Too many sign-in attempts. Please wait before trying again."
      );
    }


    if (decision) {
      throw new AuthorizationDecisionError(
        message,
        decision
      );
    }


    throw new Error(
      message
    );
  }


  return response.json();
}


export async function getCurrentUser(
  accessToken: string
): Promise<AuthenticatedUser> {
  const response =
    await fetch(
      `${API_BASE_URL}/auth/me`,
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
      }
    );


  if (!response.ok) {
    throw new Error(
      "Authentication session is no longer valid."
    );
  }


  return response.json();
}