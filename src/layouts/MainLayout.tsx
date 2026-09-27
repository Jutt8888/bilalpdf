import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "./MainLayout.css";

export default function MainLayout() {
  return (
    <div className="fp-layout">
      <Header />
      <main className="fp-layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
