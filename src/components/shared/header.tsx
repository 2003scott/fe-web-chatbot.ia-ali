import { BotMessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "@/contexts/use-theme-context";
import { Separator } from "../ui/separator";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
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
        <Avatar>
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
      </div>
    </div>
  );
};
