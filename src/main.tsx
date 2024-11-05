import { render } from "preact";
import "./index.css";
import { CompassProvider } from "./components/CompassNavigator/index.tsx";
import Menu from "./views/Menu/index.tsx";

function AppRoot() {
  return (
    <CompassProvider>
      <Menu />
    </CompassProvider>
  );
}

render(<AppRoot />, document.getElementById("app")!);
