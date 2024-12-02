import { render } from "preact";
import { useState } from "preact/hooks";
import "./index.css";
import { CompassProvider } from "./components/CompassNavigator/index.tsx";
import LoginView from "./views/Login/index.tsx";
import Menu from "./views/Menu/index.tsx";

function AppRoot() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function handleLogin() {
    setIsAuthenticated(true); // Define o estado de autenticação
  }

  function handleLogout() {
    setIsAuthenticated(false); // Reseta o estado de autenticação
  }

  return (
    <CompassProvider>
      {isAuthenticated ? (
        <Menu onLogout={handleLogout} /> // Renderiza o Menu ao autenticar
      ) : (
        <LoginView onLogin={handleLogin} /> // Renderiza a tela de login se não autenticado
      )}
    </CompassProvider>
  );
}

render(<AppRoot />, document.getElementById("app")!);
