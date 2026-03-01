import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/"; // Hide on Home page

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default App;