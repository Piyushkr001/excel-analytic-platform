import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import SavedCharts from "../components/SavedChart";

export default function DashboardHome() {
  const [role, setRole] = useState(null);
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded?.role || "user");
      } catch (err) {
        console.error("Token decode failed:", err);
        setRole("user");
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center text-center p-6">
      <img
        src="/src/assets/Images/DashBoard-Illustration.webp"
        alt="Dashboard illustration"
        className="w-full max-w-md mb-10"
      />
      <h1 className="text-3xl font-bold text-gray-800">
        {role === "admin" ? "Welcome Admin to" : "Welcome to"}{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
          Xcellytics
        </span>
      </h1>
      <p className="mt-1 text-xs text-gray-500">An Excel Analytic Platform</p>

      {isAuthenticated && (
        <>
          <p className="text-gray-600 mt-4 max-w-xl">
            You're now logged in 🎉 Use the sidebar to upload Excel files, view
            analysis history, or access admin tools. Start exploring your data
            visually!
          </p>

          <SavedCharts />
        </>
      )}
    </div>
  );
}
