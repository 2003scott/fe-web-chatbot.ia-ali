import { ThemeProvider } from "./contexts/use-theme-context";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/shared/header";
import { Home } from "./modules/home";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Header />
        <Home />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
