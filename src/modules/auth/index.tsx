
import { Navigate } from "react-router-dom";
import { BotMessageSquare, LoaderCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export const AuthModule = () => {
  const { user, isLoading, loginWithGoogle } = useAuth();

  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-5xl items-center justify-center p-4">
      <section className="w-full max-w-md rounded-3xl border bg-background/80 p-8 shadow-sm backdrop-blur">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <BotMessageSquare className="size-7" />
          </div>

          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Acceso
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Entrar a Ali</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Usa tu cuenta de Google para iniciar sesión y continuar con el chatbot.
          </p>

          <div className="mt-8 w-full">
            <Button
              onClick={loginWithGoogle}
              variant="default"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <LogIn className="size-4" />
              )}
              Entrar con Google
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};