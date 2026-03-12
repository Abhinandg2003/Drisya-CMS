import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import BlogsPage from "./pages/BlogsPage";
import OpenPositionsPage from "./pages/OpenPositionsPage";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen">
        <ToastContainer position="top-right" />
        <Login setToken={setToken} />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" />
      <div className="mx-auto max-w-[1600px] space-y-4">
        <Navbar setToken={setToken} />

        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Sidebar />

          <main className="min-w-0">
            <Routes>
              <Route path="/" element={<Navigate to="/blogs" replace />} />
              <Route path="/blogs" element={<BlogsPage token={token} />} />
              <Route
                path="/open-positions"
                element={<OpenPositionsPage token={token} />}
              />
              <Route path="*" element={<Navigate to="/blogs" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
