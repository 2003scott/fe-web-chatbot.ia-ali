import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/service/auth";
import { useAuth } from "@/hooks/use-auth";

const extractToken = () => {
  const hash = window.location.hash.replace(/^#/, "");
  const hashParams = new URLSearchParams(hash);
  const hashToken = hashParams.get("token");

  if (hashToken) {
    return hashToken;
  }

  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get("token") ?? "";
};

export const AuthCallbackModule = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const finalizeLogin = async () => {
      const token = extractToken();

      if (!token) {
        navigate("/auth", { replace: true });
        return;
      }

      AuthService.saveSessionToken(token);
      await refreshUser();
      navigate("/", { replace: true });
    };

    void finalizeLogin();
  }, [navigate, refreshUser]);

  return null;
};
