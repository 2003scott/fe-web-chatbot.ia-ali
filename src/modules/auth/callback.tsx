import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/service/auth";

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

  useEffect(() => {
    const token = extractToken();

    if (token) {
      AuthService.saveSessionToken(token);
      navigate("/", { replace: true });
      return;
    }

    navigate("/auth", { replace: true });
  }, [navigate]);

  return null;
};
