import { useRoutes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { routes } from "./routes/routes";

function AppRoutes() {
  return useRoutes(routes);
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
