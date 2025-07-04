import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 flex items-center justify-center px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl w-full">
        
        {/* Left: Text Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-700 leading-tight">
            Empower Your Data with <span className='text-green-700'>Xcellytics</span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl">
            Upload your Excel files, generate beautiful charts, and gain instant insights. Fast, simple, and powerful.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/dashboard">
              <Button
                label="Get Started"
                icon="pi pi-check"
                className="bg-green-600 border-none px-5 py-2 rounded-2xl text-white text-lg"
              />
            </Link>
            <Link to="/features">
              <Button
                label="Learn More"
                className="p-button-outlined text-green-700 rounded-2xl border-green-600 px-5 py-2 text-lg"
              />
            </Link>
          </div>
        </div>

        {/* Right: Image / Illustration */}
        <div className="flex justify-center">
          <img
            src="/src/assets/Images/Home-Photoroom.png"
            alt="Dashboard Illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
}
