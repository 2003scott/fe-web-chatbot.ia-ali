const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

export const AuthService = {
  loginWithGoogle() {
    window.location.href = `${API_BASE_URL.replace(/\/$/, "")}/api/auth/google/start`;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/auth/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { user?: AuthUser };

    return payload.user ?? null;
  },

  async logout() {
    await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  },
};