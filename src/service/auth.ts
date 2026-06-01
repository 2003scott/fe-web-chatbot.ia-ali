const API_BASE_URL = import.meta.env.VITE_BE_WEB_CHATBOT_IA_ALI_BASE_URL ?? "http://localhost:8000";
const SESSION_TOKEN_KEY = "ali_session";

const getSessionToken = () => sessionStorage.getItem(SESSION_TOKEN_KEY) ?? "";
const setSessionToken = (token: string) => sessionStorage.setItem(SESSION_TOKEN_KEY, token);
const clearSessionToken = () => sessionStorage.removeItem(SESSION_TOKEN_KEY);

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

export const AuthService = {
  loginWithGoogle() {
    window.location.href = `${API_BASE_URL.replace(/\/$/, "")}/auth/google/start`;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const token = getSessionToken();

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearSessionToken();
      }
      return null;
    }

    const payload = (await response.json()) as { user?: AuthUser };

    return payload.user ?? null;
  },

  async logout() {
    clearSessionToken();
    await fetch(`${API_BASE_URL.replace(/\/$/, "")}/auth/logout`, {
      method: "POST",
    });
  },
  saveSessionToken(token: string) {
    setSessionToken(token);
  },
};