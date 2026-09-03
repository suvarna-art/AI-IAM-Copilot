import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ACCESS_TOKEN_KEY,
  AuthorizationDecisionError,
  getCurrentUser,
  loginAdmin,
} from "../services/auth";

import type {
  AuthSession,
  AuthorizationDecision,
} from "../types/auth";


interface AuthContextValue {
  session: AuthSession;

  accessToken: string | null;

  restoringSession: boolean;

  pendingDecision:
    AuthorizationDecision | null;

  login: (
    username: string,
    password: string
  ) => Promise<void>;

  enterAdminSession: () => void;

  enterDemoMode: () => void;

  logout: () => void;

  clearPendingDecision: () => void;

  isAuthenticated: boolean;

  isAdmin: boolean;

  isDemo: boolean;
}


const signedOutSession: AuthSession = {
  mode: "SIGNED_OUT",

  username: null,

  displayName: null,

  role: null,

  accessScope: null,

  authorization: null,
};


const AuthContext =
  createContext<AuthContextValue | null>(
    null
  );


export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    session,
    setSession,
  ] = useState<AuthSession>(
    signedOutSession
  );


  const [
    accessToken,
    setAccessToken,
  ] = useState<string | null>(
    null
  );


  const [
    pendingDecision,
    setPendingDecision,
  ] =
    useState<AuthorizationDecision | null>(
      null
    );


  const [
    restoringSession,
    setRestoringSession,
  ] =
    useState(true);


  const logout = useCallback(() => {
    sessionStorage.removeItem(
      ACCESS_TOKEN_KEY
    );

    sessionStorage.removeItem(
      "identityforge_auth_session"
    );

    setAccessToken(null);

    setPendingDecision(null);

    setSession(
      signedOutSession
    );
  }, []);


  useEffect(() => {
    async function restoreSession() {
      const storedToken =
        sessionStorage.getItem(
          ACCESS_TOKEN_KEY
        );

      const storedSession =
        sessionStorage.getItem(
          "identityforge_auth_session"
        );


      if (
        !storedToken ||
        !storedSession
      ) {
        setRestoringSession(
          false
        );

        return;
      }


      try {
        const parsedSession =
          JSON.parse(
            storedSession
          ) as AuthSession;


        await getCurrentUser(
          storedToken
        );


        setAccessToken(
          storedToken
        );

        setSession(
          parsedSession
        );
      } catch {
        logout();
      } finally {
        setRestoringSession(
          false
        );
      }
    }


    restoreSession();
  }, [logout]);


  async function login(
    username: string,
    password: string
  ) {
    setPendingDecision(
      null
    );


    try {
      const response =
        await loginAdmin(
          username,
          password
        );


      setAccessToken(
        response.access_token
      );


      setPendingDecision(
        response.authorization
      );


      sessionStorage.setItem(
        ACCESS_TOKEN_KEY,
        response.access_token
      );

    } catch (error) {

      /*
       * Authentication may succeed while
       * authorization returns STEP_UP or DENY.
       *
       * No JWT is stored for those outcomes.
       */

      if (
        error instanceof
        AuthorizationDecisionError
      ) {
        sessionStorage.removeItem(
          ACCESS_TOKEN_KEY
        );

        sessionStorage.removeItem(
          "identityforge_auth_session"
        );

        setAccessToken(
          null
        );

        setSession(
          signedOutSession
        );

        setPendingDecision(
          error.decision
        );

        return;
      }


      throw error;
    }
  }


  function enterAdminSession() {
    if (!pendingDecision) {
      return;
    }


    /*
     * Only successful ALLOW decisions may
     * create an administrator session.
     */

    if (
      pendingDecision.decision !==
      "ALLOW"
    ) {
      return;
    }


    const adminSession:
      AuthSession = {
      mode: "ADMIN",

      username:
        "iamadmin",

      displayName:
        "Identity Security Administrator",

      role:
        pendingDecision.role,

      accessScope:
        pendingDecision.access_scope,

      authorization:
        pendingDecision,
    };


    setSession(
      adminSession
    );


    sessionStorage.setItem(
      "identityforge_auth_session",
      JSON.stringify(
        adminSession
      )
    );


    setPendingDecision(
      null
    );
  }


  function enterDemoMode() {
    const demoSession:
      AuthSession = {
      mode: "DEMO",

      username:
        "demo.viewer",

      displayName:
        "IdentityForge Demo Viewer",

      role:
        "DEMO_VIEWER",

      accessScope:
        "READ_ONLY",

      authorization:
        null,
    };


    sessionStorage.removeItem(
      ACCESS_TOKEN_KEY
    );


    setAccessToken(
      null
    );


    setPendingDecision(
      null
    );


    setSession(
      demoSession
    );


    sessionStorage.setItem(
      "identityforge_auth_session",
      JSON.stringify(
        demoSession
      )
    );
  }


  function clearPendingDecision() {
    setPendingDecision(
      null
    );
  }


  const value =
    useMemo<AuthContextValue>(
      () => ({
        session,

        accessToken,

        restoringSession,

        pendingDecision,

        login,

        enterAdminSession,

        enterDemoMode,

        logout,

        clearPendingDecision,

        isAuthenticated:
          session.mode !==
          "SIGNED_OUT",

        isAdmin:
          session.mode ===
          "ADMIN",

        isDemo:
          session.mode ===
          "DEMO",
      }),
      [
        session,
        accessToken,
        restoringSession,
        pendingDecision,
      ]
    );


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context =
    useContext(
      AuthContext
    );


  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider."
    );
  }


  return context;
}