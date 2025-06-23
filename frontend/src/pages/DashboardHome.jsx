// src/pages/DashboardHome.jsx
export default function DashboardHome() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className="flex flex-col items-center justify-center text-center p-6">
      <img
        src="/src/assets/Images/DashBoard-Illustration.webp"
        alt="Dashboard illustration"
        className="w-full max-w-md mb-20"
      />
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to Excel Analytics Platform
      </h1>

      {isAuthenticated && (
        <p className="text-gray-600 mt-4 max-w-xl">
          You're now logged in 🎉 Use the sidebar to upload Excel files, view analysis
          history, or access admin tools. Start exploring your data visually!
        </p>
      )}
    </div>
  );
}
