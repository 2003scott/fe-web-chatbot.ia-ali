import { useEffect, useState } from "react";
import { BotMessageSquare, LogIn, LogOut, LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "@/contexts/use-theme-context";
import { Separator } from "../ui/separator";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AuthService, type AuthUser } from "@/service/auth";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();

        if (isMounted) {
          setUser(currentUser);
        }
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = () => {
    AuthService.loginWithGoogle();
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <div className="container mx-auto text-primary font-extrabold flex gap-2 items-center p-3 justify-between border-b">
      <a href="" className="flex items-center gap-2">
        <BotMessageSquare /> Ali
      </a>
      <div className="flex gap-2 items-center">
        <Button onClick={toggleTheme} variant="ghost" size="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="size-4.5"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
            <path d="M12 3l0 18"></path>
            <path d="M12 9l4.65 -4.65"></path>
            <path d="M12 14.3l7.37 -7.37"></path>
            <path d="M12 19.6l8.85 -8.85"></path>
          </svg>
        </Button>
        <Separator
          orientation="vertical"
          className="my-1
            "
        />
        {isAuthLoading ? (
          <Button variant="ghost" size="sm" disabled>
            <LoaderCircle className="size-4 animate-spin" />
          </Button>
        ) : user ? (
          <div className="flex items-center gap-2">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
            </div>
            <Avatar>
              <AvatarImage src={user.picture} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              <AvatarBadge className="bg-green-600 dark:bg-green-800" />
            </Avatar>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="size-4" />
              Salir
            </Button>
          </div>
        ) : (
          <Button onClick={handleLogin} variant="default" size="sm">
            <LogIn className="size-4" />
            Entrar con Google
          </Button>
        )}
      </div>
    </div>
  );
};
