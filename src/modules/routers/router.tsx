import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Header } from "@/components/shared/header";
import { useAuth } from "@/hooks/use-auth";
import { AuthModule } from "@/modules/auth";
import { AuthCallbackModule } from "@/modules/auth/callback";
import { Home } from "@/modules/home";

const ProtectedLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const PublicOnlyLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route element={<PublicOnlyLayout />}>
        <Route path="/auth" element={<AuthModule />} />
        <Route path="/auth/callback" element={<AuthCallbackModule />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};