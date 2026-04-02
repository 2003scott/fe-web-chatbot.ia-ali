import { ThemeProvider } from "./contexts/use-theme-context";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/shared/header";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
