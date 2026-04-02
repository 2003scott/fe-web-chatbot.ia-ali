import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import { Button } from "./components/ui/button";
import { BotMessageSquare } from "lucide-react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="text-primary font-extrabold flex gap-2 items-center p-2 justify-between border-b">
        <a href="" className="flex items-center gap-2">
          <BotMessageSquare /> Ali
        </a>
        <Button>Iniciar Session</Button>
      </div>
    </>
  );
}

export default App;
