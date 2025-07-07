import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import SavedCharts from "../components/SavedChart";

export default function DashboardHome() {
  const isAuthenticated = !!localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const timeout = setTimeout(() => setLoading(false), 1000); // 1 second delay
      return () => clearTimeout(timeout);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col items-center text-center p-6">
      <img
        src="/src/assets/Images/DashBoard-Illustration.webp"
        alt="Dashboard illustration"
        className="w-full max-w-md mb-10"
      />
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
          Xcellytics
        </span>
      </h1>
      <p className="mt-1 text-xs text-gray-500">An Excel Analytic Platform</p>

      {isAuthenticated && (
        <>
          <p className="text-gray-600 mt-4 max-w-xl">
            You're now logged in 🎉 Use the sidebar to upload Excel files, view analysis
            history, or access admin tools. Start exploring your data visually!
          </p>

          {loading ? (
            <div className="mt-10 flex items-center gap-2 text-blue-500">
              <Loader2 className="animate-spin h-6 w-6" />
              <span className="text-sm text-gray-500">Loading saved charts...</span>
            </div>
          ) : (
            <SavedCharts />
          )}
        </>
      )}
    </div>
  );
}
